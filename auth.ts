import NextAuth from "next-auth";
import { authOptions } from "./lib/auth-config";

// Enhanced auth configuration with runtime URL detection
const runtimeAuthOptions = {
  ...authOptions,
  // Ensure URL is set at runtime, not just build time
  url: process.env.NEXTAUTH_URL || 
       process.env.NEXT_PUBLIC_APP_URL || 
       process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
       (process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'),
};

export const { handlers, signIn, signOut, auth } = NextAuth(runtimeAuthOptions);
