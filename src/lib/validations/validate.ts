/**
 * 🚀 Ultimate Contest Radar - Validation Utilities
 * Request/response validation middleware and helpers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema, ZodError } from 'zod';
import { ContestErrorResponseSchema } from '@/lib/schemas/contest';

// =================================================================
// 🔧 VALIDATION MIDDLEWARE
// =================================================================

/**
 * Validate request body with Zod schema
 */
export function validateBody<T>(
  schema: ZodSchema<T>,
  fallbackHandler?: (error: ZodError) => NextResponse
) {
  return async (request: NextRequest): Promise<{ data: T } | NextResponse> => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return { data: validatedData };
    } catch (error) {
      console.error('❌ Body validation error:', error);
      
      if (fallbackHandler && error instanceof ZodError) {
        return fallbackHandler(error);
      }
      
      return createValidationErrorResponse('INVALID_REQUEST_BODY', error);
    }
  };
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQuery<T>(
  schema: ZodSchema<T>,
  fallbackHandler?: (error: ZodError) => NextResponse
) {
  return (request: NextRequest): { data: T } | NextResponse => {
    try {
      const { searchParams } = new URL(request.url);
      const queryObject: Record<string, string> = {};
      
      // Convert searchParams to object
      searchParams.forEach((value, key) => {
        queryObject[key] = value;
      });
      
      const validatedData = schema.parse(queryObject);
      return { data: validatedData };
    } catch (error) {
      console.error('❌ Query validation error:', error);
      
      if (fallbackHandler && error instanceof ZodError) {
        return fallbackHandler(error);
      }
      
      return createValidationErrorResponse('INVALID_QUERY_PARAMETERS', error);
    }
  };
}

/**
 * Validate route parameters with Zod schema
 */
export function validateParams<T>(
  schema: ZodSchema<T>,
  fallbackHandler?: (error: ZodError) => NextResponse
) {
  return (request: NextRequest, context: { params: Record<string, string> }): { data: T } | NextResponse => {
    try {
      const validatedData = schema.parse(context.params);
      return { data: validatedData };
    } catch (error) {
      console.error('❌ Params validation error:', error);
      
      if (fallbackHandler && error instanceof ZodError) {
        return fallbackHandler(error);
      }
      
      return createValidationErrorResponse('INVALID_ROUTE_PARAMETERS', error);
    }
  };
}

// =================================================================
// 🎯 VALIDATION HELPERS
// =================================================================

/**
 * Create standardized validation error response
 */
export function createValidationErrorResponse(
  code: string,
  error: unknown,
  statusCode: number = 400
): NextResponse {
  const zodError = error instanceof ZodError;
  
  const errorResponse = {
    success: false,
    error: {
      code,
      message: zodError ? 'Validation failed' : 'Request validation error',
      details: zodError ? {
        fieldErrors: error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          if (!acc[path]) acc[path] = [];
          acc[path].push(err.message);
          return acc;
        }, {} as Record<string, string[]>),
        formErrors: error.errors.map(err => err.message),
      } : { message: error instanceof Error ? error.message : 'Unknown error' },
      timestamp: new Date().toISOString(),
    },
  };
  
  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Validate and format Zod error for API response
 */
export function formatZodError(error: ZodError) {
  const fieldErrors: Record<string, string[]> = {};
  const formErrors: string[] = [];
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    
    if (path) {
      if (!fieldErrors[path]) {
        fieldErrors[path] = [];
      }
      fieldErrors[path].push(err.message);
    } else {
      formErrors.push(err.message);
    }
  });
  
  return {
    fieldErrors,
    formErrors,
    issues: error.errors.map(err => ({
      path: err.path,
      message: err.message,
      code: err.code,
    })),
  };
}

/**
 * Validate response data with Zod schema (for development/testing)
 */
export function validateResponse<T>(schema: ZodSchema<T>, data: unknown): { isValid: boolean; data?: T; errors?: string } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
      return { isValid: false, errors: errorMessages };
    }
    return { isValid: false, errors: 'Unknown validation error' };
  }
}

// =================================================================
// 🚦 SPECIFIC VALIDATION FUNCTIONS
// =================================================================

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date string
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page: number, limit: number) {
  const errors: string[] = [];
  
  if (page < 1) {
    errors.push('Page must be greater than 0');
  }
  
  if (limit < 1) {
    errors.push('Limit must be greater than 0');
  }
  
  if (limit > 100) {
    errors.push('Limit cannot exceed 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    normalized: {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
    },
  };
}

// =================================================================
// 🔒 SECURITY VALIDATION
// =================================================================

/**
 * Sanitize string input (basic XSS prevention)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>'"&]/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validate and sanitize search query
 */
export function validateSearchQuery(query: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!query || query.trim().length === 0) {
    return { isValid: false, sanitized: '', error: 'Search query is required' };
  }
  
  if (query.length > 100) {
    return { isValid: false, sanitized: '', error: 'Search query too long (max 100 characters)' };
  }
  
  const sanitized = sanitizeString(query);
  return { isValid: true, sanitized };
}

/**
 * Rate limiting validation (basic implementation)
 */
export function validateRateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  // This is a simplified rate limiting check
  // In production, you'd want to use Redis or a dedicated rate limiting service
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  
  // Mock implementation - replace with actual rate limiting
  return {
    allowed: true,
    remaining: maxRequests - 1,
    resetTime: now + windowMs,
  };
}

// =================================================================
// 📝 API RESPONSE VALIDATORS
// =================================================================

/**
 * Validate API success response format
 */
export function validateApiSuccessResponse(data: unknown): { isValid: boolean; errors?: string[] } {
  const requiredFields = ['success', 'data'];
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    errors.push('Response must be an object');
    return { isValid: false, errors };
  }
  
  const response = data as any;
  
  requiredFields.forEach(field => {
    if (!(field in response)) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  if (response.success !== true) {
    errors.push('Success response must have success: true');
  }
  
  return { isValid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
}

/**
 * Validate API error response format
 */
export function validateApiErrorResponse(data: unknown): { isValid: boolean; errors?: string[] } {
  const result = ContestErrorResponseSchema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return { isValid: false, errors };
  }
  
  return { isValid: true };
}
