import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers (OWASP Top 10 compliance)
  
  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filtering
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict dangerous browser features
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Content Security Policy
  const isDev = process.env.NODE_ENV === 'development';
  const cspPolicy = isDev 
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self';"
    : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self';";
  
  response.headers.set('Content-Security-Policy', cspPolicy);

  // Add custom security headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Prevent caching of API responses by default
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    // Add API-specific security headers
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('X-Request-ID', crypto.randomUUID());
  }

  // CORS handling for public API endpoints
  const publicApiPaths = ['/api/v1/track', '/api/v1/webhook', '/api/v1/redirect'];
  const isPublicApi = publicApiPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isPublicApi) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    // Add CORS headers to public API responses
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // Rate limiting preparation (headers for monitoring)
  const clientIP = request.ip ?? 
    request.headers.get('x-forwarded-for') ?? 
    request.headers.get('x-real-ip') ?? 
    'unknown';
  
  response.headers.set('X-Client-IP', clientIP);
  response.headers.set('X-Timestamp', new Date().toISOString());

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};