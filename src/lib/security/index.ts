import { NextRequest } from 'next/server';

/**
 * Extract client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  // Try different headers in order of preference
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  const remoteAddr = request.headers.get('remote-addr');
  if (remoteAddr) {
    return remoteAddr.trim();
  }
  
  return request.ip ?? 'unknown';
}

/**
 * Generate secure random string for tokens/secrets
 */
export function generateSecureToken(length: number = 32): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  
  return result;
}

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate URL to prevent SSRF attacks
 */
export function validateURL(url: string, allowedDomains?: string[]): boolean {
  try {
    const parsedURL = new URL(url);
    
    // Block dangerous protocols
    const dangerousProtocols = ['file:', 'ftp:', 'gopher:', 'dict:'];
    if (dangerousProtocols.includes(parsedURL.protocol)) {
      return false;
    }
    
    // Block private IP ranges
    const hostname = parsedURL.hostname;
    const privateIPRegex = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|::1|localhost)/;
    if (privateIPRegex.test(hostname)) {
      return false;
    }
    
    // Check allowed domains if specified
    if (allowedDomains && allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
      if (!isAllowed) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Hash sensitive data (passwords, etc.)
 */
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or similar
  // For now, using native crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(40);
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
}

/**
 * Rate limiting key generation
 */
export function getRateLimitKey(identifier: string, action: string): string {
  return `ratelimit:${action}:${identifier}`;
}

/**
 * Security audit logging
 */
export interface SecurityEvent {
  event: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userId?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export function logSecurityEvent(event: SecurityEvent): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...event,
  };
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.warn('🔒 Security Event:', logEntry);
  }
  
  // In production, send to logging service (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with logging service
    console.error('Security Event:', logEntry);
  }
}

/**
 * Validate file upload security
 */
export function validateFileUpload(
  filename: string, 
  mimetype: string, 
  size: number,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;
  
  // Check file size
  if (size > maxSize) {
    return { valid: false, error: 'File size exceeds limit' };
  }
  
  // Check MIME type
  if (!allowedTypes.includes(mimetype)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  // Check file extension
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension not allowed' };
  }
  
  // Check for dangerous filenames
  const dangerousPatterns = [
    /\.\./,  // Path traversal
    /[<>]/,  // HTML/XML chars
    /[&$`|;]/,  // Shell injection chars
  ];
  
  if (dangerousPatterns.some(pattern => pattern.test(filename))) {
    return { valid: false, error: 'Invalid filename' };
  }
  
  return { valid: true };
}

/**
 * Environment-specific security configuration
 */
export const securityConfig = {
  development: {
    rateLimitEnabled: false,
    strictCSP: false,
    auditLogging: false,
  },
  production: {
    rateLimitEnabled: true,
    strictCSP: true,
    auditLogging: true,
  }
} as const;

/**
 * Get current security configuration
 */
export function getSecurityConfig() {
  const env = process.env.NODE_ENV as keyof typeof securityConfig;
  return securityConfig[env] || securityConfig.development;
}