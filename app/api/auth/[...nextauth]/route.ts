import { authOptions } from "@/lib/auth-config";
import NextAuth from "next-auth";

// Dynamically get base URL from request headers (for proper OAuth redirects)
function getBaseUrlFromRequest(request: Request): string {
  // Try environment variables first
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Fallback to request headers (Vercel provides these)
  const host = request.headers.get("host") || "";
  const protocol = request.headers.get("x-forwarded-proto") || "https";
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Last resort
  return process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";
}

// Create handlers with runtime URL detection
const authHandlers = NextAuth({
  ...authOptions,
  // Override URL at runtime from request
  // NextAuth will use this for OAuth callbacks
});

export const GET = async (request: Request) => {
  // Get base URL from request
  const baseUrl = getBaseUrlFromRequest(request);
  
  // Update authOptions with runtime URL
  const runtimeAuthOptions = {
    ...authOptions,
    url: baseUrl,
  };
  
  const handlers = NextAuth(runtimeAuthOptions);
  return handlers.GET(request);
};

export const POST = async (request: Request) => {
  // Get base URL from request
  const baseUrl = getBaseUrlFromRequest(request);
  
  // Update authOptions with runtime URL
  const runtimeAuthOptions = {
    ...authOptions,
    url: baseUrl,
  };
  
  const handlers = NextAuth(runtimeAuthOptions);
  return handlers.POST(request);
};
