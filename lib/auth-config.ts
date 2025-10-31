import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { IAccountDoc } from "../database/account.model";
import { IUserDoc } from "../database/user.model";
import { api } from "./api";
import { SignInSchema } from "./validations";

type NextAuthConfig = Parameters<typeof import("next-auth").default>[0];

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  throw new Error('AUTH_SECRET or NEXTAUTH_SECRET must be set in environment variables');
}

// Get base URL from environment or construct from headers
function getBaseUrl(): string {
  // Priority 1: Explicit NEXTAUTH_URL (highest priority)
  if (process.env.NEXTAUTH_URL) {
    const url = process.env.NEXTAUTH_URL.trim();
    // Remove trailing slash
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // Priority 2: NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL.trim();
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // Priority 3: Vercel auto-detection
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Priority 4: VERCEL_PROJECT_PRODUCTION_URL (if available)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }
  
  // Last resort: Only in development, never in production
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production fallback - should never reach here if env vars are set
  console.error('⚠️ WARNING: No base URL found! Set NEXTAUTH_URL environment variable.');
  return 'http://localhost:3000'; // Fallback, but should warn
}

export const authOptions: NextAuthConfig = {
  basePath: '/api/auth',
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const validatedFields = SignInSchema.safeParse(credentials);
          if (!validatedFields.success) {
            throw new Error('Invalid credentials format');
          }

          const { email, password } = validatedFields.data;

          // Get account by email
          const accountResponse = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;
          if (accountResponse.error || !accountResponse.data) {
            throw new Error('Invalid credentials');
          }
          const existingAccount = accountResponse.data;

          // Get user by account's userId
          const userResponse = await api.users.getById(existingAccount.userId.toString()) as ActionResponse<IUserDoc>;
          if (userResponse.error || !userResponse.data) {
            throw new Error('User not found');
          }
          const existingUser = userResponse.data;

          // Verify password
          const isValidPassword = await bcrypt.compare(password, existingAccount.password || '');
          if (!isValidPassword) {
            throw new Error('Invalid credentials');
          }

          return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            image: existingUser.image || null,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only handle OAuth providers (not credentials)
      if (account?.provider === "credentials") {
        return true;
      }

      if (!account || !user.email) {
        return false;
      }

      try {
        // Dynamically import mongoose to avoid Edge Runtime issues
        const mongoose = await import("mongoose");
        const slugify = await import("slugify").then(m => m.default);
        const Account = (await import("../database/account.model")).default;
        const User = (await import("../database/user.model")).default;
        const dbConnect = (await import("./mongoose")).default;

        await dbConnect();

        const provider = account.provider;
        const providerAccountId = account.providerAccountId || user.id;
        const name = user.name || profile?.name || user.email?.split("@")[0] || "User";
        const email = user.email;
        const image = user.image || profile?.image || profile?.picture || null;

        // Generate username from email or name
        const usernameBase = user.email?.split("@")[0] || name.toLowerCase() || "user";
        const slugifiedUsername = slugify(usernameBase, {
          lower: true,
          strict: true,
          trim: true,
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
          // Find or create user
          let existingUser = await User.findOne({ email }).session(session);

          if (!existingUser) {
            // Generate unique username if it exists
            let finalUsername = slugifiedUsername;
            let counter = 1;
            while (await User.findOne({ username: finalUsername }).session(session)) {
              finalUsername = `${slugifiedUsername}${counter}`;
              counter++;
            }

            [existingUser] = await User.create(
              [{ name, username: finalUsername, email, image }],
              { session }
            );
          } else {
            // Update user info if changed
            const updatedData: { name?: string; image?: string } = {};
            if (existingUser.name !== name) updatedData.name = name;
            if (existingUser.image !== image && image) updatedData.image = image;

            if (Object.keys(updatedData).length > 0) {
              await User.updateOne(
                { _id: existingUser._id },
                { $set: updatedData }
              ).session(session);
            }
          }

          // Find or create account
          const existingAccount = await Account.findOne({
            userId: existingUser._id,
            provider,
            providerAccountId,
          }).session(session);

          if (!existingAccount) {
            await Account.create(
              [
                {
                  userId: existingUser._id,
                  name,
                  image,
                  provider,
                  providerAccountId,
                },
              ],
              { session }
            );
          }

          await session.commitTransaction();

          // Update user object with database ID
          user.id = existingUser._id.toString();
          return true;
        } catch (error) {
          await session.abortTransaction();
          console.error("Error in signIn callback:", error);
          return false;
        } finally {
          session.endSession();
        }
      } catch (error) {
        console.error("Error connecting to database in signIn:", error);
        return false;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      if (session.user) {
        // Prioritize token.id (MongoDB ObjectId) over token.sub (OAuth provider ID)
        session.user.id = (token.id as string) || token.sub;
        if (token.name) session.user.name = token.name;
        if (token.email) session.user.email = token.email as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
    async jwt({ token, user, account, profile }: { 
      token: JWT; 
      user?: User | AdapterUser; 
      account?: any; 
      profile?: any 
    }): Promise<JWT> {
      // Initial sign in
      if (account && user) {
        token.id = user.id || (user as any)._id?.toString();
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image || profile?.picture || profile?.image;
      }
      return token;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  // Explicitly set the base URL for OAuth callbacks
  // In NextAuth v5, we need to use url property for proper OAuth redirect URIs
  url: getBaseUrl(),
};

// Helper function to get auth options
export function getAuthOptions(): NextAuthConfig {
  return authOptions;
}
