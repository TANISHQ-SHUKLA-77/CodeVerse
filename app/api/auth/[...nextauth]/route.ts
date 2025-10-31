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
  try {
    // Get base URL from request
    const baseUrl = getBaseUrlFromRequest(request);
    
    // Log for debugging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('NextAuth baseUrl:', baseUrl);
      console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
      console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    }
    
    // Update authOptions with runtime URL
    const runtimeAuthOptions = {
      ...authOptions,
      url: baseUrl,
    };
    
    const handlers = NextAuth(runtimeAuthOptions);
    return await handlers.GET(request);
  } catch (error) {
    console.error('NextAuth GET error:', error);
    // Log full error details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Let NextAuth handle the error - don't wrap it
    // Return to original error handling
    throw error;
  }
};

export const POST = async (request: Request) => {
  try {
    // Get base URL from request
    const baseUrl = getBaseUrlFromRequest(request);
    
    // Log for debugging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('NextAuth baseUrl:', baseUrl);
    }
    
    // Update authOptions with runtime URL
    const runtimeAuthOptions = {
      ...authOptions,
      url: baseUrl,
    };
    
    const handlers = NextAuth(runtimeAuthOptions);
    return await handlers.POST(request);
  } catch (error) {
    console.error('NextAuth POST error:', error);
    // Log full error details
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Let NextAuth handle the error - don't wrap it
    throw error;
  }
};
