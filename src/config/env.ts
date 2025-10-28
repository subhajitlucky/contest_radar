/**
 * Environment Variables Configuration
 * Ultimate Contest Radar - 2025 Edition
 */

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';

  // Database
  DATABASE_URL: string;
  PLANETSCALE_DATABASE_URL?: string;
  NEON_DATABASE_URL?: string;
  TEST_DATABASE_URL?: string;

  // Authentication
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  JWT_SECRET: string;

  // OAuth Providers
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;

  // External APIs
  CODEFORCES_API_KEY?: string;
  CODEFORCES_API_SECRET?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  ATCODER_API_KEY?: string;
  LEETCODE_API_KEY?: string;

  // Real-time Features
  REDIS_URL?: string;
  SOCKET_IO_SECRET?: string;

  // File Storage
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION?: string;
  AWS_S3_BUCKET?: string;

  // Email
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  EMAIL_FROM?: string;
  EMAIL_SUPPORT?: string;

  // Analytics
  POSTHOG_API_KEY?: string;
  SENTRY_DSN?: string;
  ANALYTICS_ID?: string;

  // AI & ML
  PINECONE_API_KEY?: string;
  VECTOR_DB_URL?: string;
  ML_MODEL_ENDPOINT?: string;

  // Performance Monitoring
  DATADOG_API_KEY?: string;
  NEW_RELIC_LICENSE_KEY?: string;

  // Security
  BCRYPT_ROUNDS?: string;
  SESSION_SECRET?: string;
  CORS_ORIGIN?: string;

  // Feature Flags
  ENABLE_AI_FEATURES?: string;
  ENABLE_REAL_TIME?: string;
  ENABLE_BROWSER_EXTENSION?: string;
  ENABLE_ANALYTICS?: string;
  ENABLE_NOTIFICATIONS?: string;
  ENABLE_PWA?: string;
  ENABLE_CODEFORCES?: string;
  ENABLE_ATCODER?: string;
  ENABLE_LEETCODE?: string;
  ENABLE_CODECHEF?: string;
  ENABLE_GEEKSFORGEEKS?: string;
  ENABLE_AI_RECOMMENDATIONS?: string;
  ENABLE_PERFORMANCE_ANALYTICS?: string;
  ENABLE_SOCIAL_FEATURES?: string;
  ENABLE_MENTORSHIP?: string;

  // Rate Limiting
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW?: string;

  // Cache
  CACHE_TTL?: string;
  CACHE_PREFIX?: string;
  ENABLE_REDIS_CACHE?: string;

  // WebSocket
  WS_PORT?: string;
  WS_ORIGIN?: string;

  // Browser Extension
  EXTENSION_ID?: string;
  EXTENSION_SECRET?: string;

  // Deployment
  VERCEL_URL?: string;
  DEPLOYMENT_REGION?: string;

  // Monitoring
  HEALTH_CHECK_URL?: string;
  UPTIME_ROBOT_API_KEY?: string;

  // CDN
  CDN_URL?: string;
  CDN_SECRET?: string;

  // Development
  ENABLE_DEBUG_MODE?: string;
  ENABLE_QUERY_LOGGING?: string;
  ENABLE_PERFORMANCE_MONITORING?: string;
}

class Environment {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    const config: Partial<EnvironmentConfig> = {
      NODE_ENV: process.env.NODE_ENV as EnvironmentConfig['NODE_ENV'] || 'development',

      // Required environment variables
      DATABASE_URL: this.getRequired('DATABASE_URL'),
      NEXTAUTH_URL: this.getRequired('NEXTAUTH_URL'),
      NEXTAUTH_SECRET: this.getRequired('NEXTAUTH_SECRET'),
      JWT_SECRET: this.getRequired('JWT_SECRET'),

      // Database URLs
      PLANETSCALE_DATABASE_URL: process.env.PLANETSCALE_DATABASE_URL,
      NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,
      TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,

      // OAuth
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

      // APIs
      CODEFORCES_API_KEY: process.env.CODEFORCES_API_KEY,
      CODEFORCES_API_SECRET: process.env.CODEFORCES_API_SECRET,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      ATCODER_API_KEY: process.env.ATCODER_API_KEY,
      LEETCODE_API_KEY: process.env.LEETCODE_API_KEY,

      // Redis & Real-time
      REDIS_URL: process.env.REDIS_URL,
      SOCKET_IO_SECRET: process.env.SOCKET_IO_SECRET,

      // Email
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@contest-radar.com',
      EMAIL_SUPPORT: process.env.EMAIL_SUPPORT || 'support@contest-radar.com',

      // Monitoring
      POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
      ANALYTICS_ID: process.env.ANALYTICS_ID,

      // AI & ML
      PINECONE_API_KEY: process.env.PINECONE_API_KEY,
      VECTOR_DB_URL: process.env.VECTOR_DB_URL,
      ML_MODEL_ENDPOINT: process.env.ML_MODEL_ENDPOINT,

      // Performance
      DATADOG_API_KEY: process.env.DATADOG_API_KEY,
      NEW_RELIC_LICENSE_KEY: process.env.NEW_RELIC_LICENSE_KEY,

      // Security
      BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || '12',
      SESSION_SECRET: process.env.SESSION_SECRET,
      CORS_ORIGIN: process.env.CORS_ORIGIN,

      // Feature Flags
      ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES || 'true',
      ENABLE_REAL_TIME: process.env.ENABLE_REAL_TIME || 'true',
      ENABLE_BROWSER_EXTENSION: process.env.ENABLE_BROWSER_EXTENSION || 'true',
      ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS || 'true',
      ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS || 'true',
      ENABLE_PWA: process.env.ENABLE_PWA || 'true',
      ENABLE_CODEFORCES: process.env.ENABLE_CODEFORCES || 'true',
      ENABLE_ATCODER: process.env.ENABLE_ATCODER || 'true',
      ENABLE_LEETCODE: process.env.ENABLE_LEETCODE || 'true',
      ENABLE_CODECHEF: process.env.ENABLE_CODECHEF || 'true',
      ENABLE_GEEKSFORGEEKS: process.env.ENABLE_GEEKSFORGEEKS || 'true',
      ENABLE_AI_RECOMMENDATIONS: process.env.ENABLE_AI_RECOMMENDATIONS || 'true',
      ENABLE_PERFORMANCE_ANALYTICS: process.env.ENABLE_PERFORMANCE_ANALYTICS || 'true',
      ENABLE_SOCIAL_FEATURES: process.env.ENABLE_SOCIAL_FEATURES || 'true',
      ENABLE_MENTORSHIP: process.env.ENABLE_MENTORSHIP || 'true',

      // Performance
      RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || '100',
      RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '15',
      CACHE_TTL: process.env.CACHE_TTL || '3600',
      CACHE_PREFIX: process.env.CACHE_PREFIX || 'cr_',
      ENABLE_REDIS_CACHE: process.env.ENABLE_REDIS_CACHE || 'true',

      // WebSocket
      WS_PORT: process.env.WS_PORT || '3001',
      WS_ORIGIN: process.env.WS_ORIGIN,

      // Extension
      EXTENSION_ID: process.env.EXTENSION_ID,
      EXTENSION_SECRET: process.env.EXTENSION_SECRET,

      // Deployment
      VERCEL_URL: process.env.VERCEL_URL,
      DEPLOYMENT_REGION: process.env.DEPLOYMENT_REGION || 'us-east-1',

      // Monitoring
      HEALTH_CHECK_URL: process.env.HEALTH_CHECK_URL,
      UPTIME_ROBOT_API_KEY: process.env.UPTIME_ROBOT_API_KEY,

      // CDN
      CDN_URL: process.env.CDN_URL,
      CDN_SECRET: process.env.CDN_SECRET,

      // Development
      ENABLE_DEBUG_MODE: process.env.ENABLE_DEBUG_MODE || 'true',
      ENABLE_QUERY_LOGGING: process.env.ENABLE_QUERY_LOGGING || 'false',
      ENABLE_PERFORMANCE_MONITORING: process.env.ENABLE_PERFORMANCE_MONITORING || 'true',
    };

    return config as EnvironmentConfig;
  }

  private getRequired(key: keyof EnvironmentConfig): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  // Get configuration value
  get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.config[key];
  }

  // Get all configuration
  getAll(): EnvironmentConfig {
    return { ...this.config };
  }

  // Check if feature is enabled
  isFeatureEnabled(feature: keyof Pick<EnvironmentConfig, 'ENABLE_AI_FEATURES' | 'ENABLE_REAL_TIME' | 'ENABLE_BROWSER_EXTENSION' | 'ENABLE_ANALYTICS' | 'ENABLE_NOTIFICATIONS' | 'ENABLE_PWA' | 'ENABLE_CODEFORCES' | 'ENABLE_ATCODER' | 'ENABLE_LEETCODE' | 'ENABLE_CODECHEF' | 'ENABLE_GEEKSFORGEEKS' | 'ENABLE_AI_RECOMMENDATIONS' | 'ENABLE_PERFORMANCE_ANALYTICS' | 'ENABLE_SOCIAL_FEATURES' | 'ENABLE_MENTORSHIP'>): boolean {
    return this.config[feature] === 'true';
  }

  // Get numeric configuration with fallback
  getNumber(key: keyof EnvironmentConfig, fallback: number): number {
    const value = this.config[key];
    const parsed = value ? parseInt(value, 10) : NaN;
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  // Get boolean configuration
  getBoolean(key: keyof EnvironmentConfig, fallback = false): boolean {
    const value = this.config[key];
    return value ? value === 'true' : fallback;
  }

  // Check if environment is development
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  // Check if environment is production
  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  // Check if environment is test
  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }

  // Get database URL based on environment and priority
  getDatabaseUrl(): string {
    // Priority: Production DBs > Test DB > Local DB
    if (this.isProduction() && this.config.PLANETSCALE_DATABASE_URL) {
      return this.config.PLANETSCALE_DATABASE_URL;
    }
    if (this.isProduction() && this.config.NEON_DATABASE_URL) {
      return this.config.NEON_DATABASE_URL;
    }
    if (this.isTest() && this.config.TEST_DATABASE_URL) {
      return this.config.TEST_DATABASE_URL;
    }
    return this.config.DATABASE_URL;
  }

  // Get analytics database URL
  getAnalyticsDatabaseUrl(): string {
    if (this.isProduction() && this.config.NEON_DATABASE_URL) {
      return this.config.NEON_DATABASE_URL;
    }
    // Fallback to local PostgreSQL for analytics
    return this.config.DATABASE_URL;
  }

  // Validate environment configuration
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required variables
    const requiredVars = ['DATABASE_URL', 'NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'JWT_SECRET'] as const;
    requiredVars.forEach((varName) => {
      if (!this.config[varName]) {
        errors.push(`Missing required environment variable: ${varName}`);
      }
    });

    // Validate URL formats
    if (this.config.NEXTAUTH_URL && !this.isValidUrl(this.config.NEXTAUTH_URL)) {
      errors.push('NEXTAUTH_URL must be a valid URL');
    }

    // Validate port numbers
    if (this.config.WS_PORT && !this.isValidPort(this.config.WS_PORT)) {
      errors.push('WS_PORT must be a valid port number');
    }

    // Check database URLs if provided
    if (this.config.PLANETSCALE_DATABASE_URL && !this.isValidUrl(this.config.PLANETSCALE_DATABASE_URL)) {
      errors.push('PLANETSCALE_DATABASE_URL must be a valid URL');
    }

    if (this.config.NEON_DATABASE_URL && !this.isValidUrl(this.config.NEON_DATABASE_URL)) {
      errors.push('NEON_DATABASE_URL must be a valid URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  private isValidPort(port: string): boolean {
    const portNum = parseInt(port, 10);
    return !Number.isNaN(portNum) && portNum > 0 && portNum <= 65535;
  }
}

// Export singleton instance
export const env = new Environment();

// Export validation helper
export const validateEnvironment = () => {
  const validation = env.validate();
  if (!validation.isValid) {
    console.error('Environment validation failed:', validation.errors);
    throw new Error(`Environment configuration invalid: ${validation.errors.join(', ')}`);
  }
  return validation;
};

// Export type for easy importing
export type Env = EnvironmentConfig;
