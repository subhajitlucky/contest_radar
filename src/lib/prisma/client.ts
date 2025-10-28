/**
 * 🚀 Ultimate Contest Radar - Prisma Client Configuration
 * Enterprise-grade database connection with multi-database support
 */

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { env } from '@/config/env';

// =================================================================
// 🗄️ DATABASE CONNECTION CONFIGURATION
// =================================================================

/**
 * Database connection types
 */
export type DatabaseType = 'primary' | 'analytics' | 'local';

/**
 * Database connection configuration
 */
interface DatabaseConfig {
  name: DatabaseType;
  url: string;
  provider: 'mysql' | 'postgresql';
  enableAccelerate?: boolean;
  connectionPool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

// Database configurations
const databaseConfigs: Record<DatabaseType, DatabaseConfig> = {
  primary: {
    name: 'primary',
    url: env.getDatabaseUrl(),
    provider: 'mysql', // PlanetScale for primary operations
    enableAccelerate: env.isProduction(),
    connectionPool: {
      max: 20,
      min: 5,
      acquire: 60000,
      idle: 300000,
    },
  },
  analytics: {
    name: 'analytics',
    url: env.getAnalyticsDatabaseUrl(),
    provider: 'postgresql', // Neon for analytics
    enableAccelerate: env.isProduction(),
    connectionPool: {
      max: 15,
      min: 3,
      acquire: 60000,
      idle: 300000,
    },
  },
  local: {
    name: 'local',
    url: env.getDatabaseUrl(),
    provider: 'postgresql',
    enableAccelerate: false,
    connectionPool: {
      max: 10,
      min: 2,
      acquire: 60000,
      idle: 300000,
    },
  },
};

// =================================================================
// 🔧 PRISMA CLIENT FACTORY
// =================================================================

/**
 * Create a Prisma client with optimized configuration
 */
function createPrismaClient(config: DatabaseConfig): PrismaClient {
  const baseConfig = {
    datasources: {
      db: {
        url: config.url,
      },
    },
    
    // Connection pool configuration
    pool: config.connectionPool ? {
      enabled: true,
      connectionLimit: config.connectionPool.max,
      acquireTimeout: config.connectionPool.acquire,
      timeout: config.connectionPool.idle,
    } : undefined,

    // Query configuration
    log: env.getBoolean('ENABLE_QUERY_LOGGING', false) 
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
        ]
      : [{ emit: 'event', level: 'error' }],

    // Performance optimizations
    errorFormat: 'pretty',
    
    // Transaction configuration
    transactionOptions: {
      maxWait: config.connectionPool?.acquire || 60000,
      timeout: config.connectionPool?.idle || 300000,
    },
  };

  // Create base client
  let client = new PrismaClient(baseConfig);

  // Add Accelerate extension for production/serverless
  if (config.enableAccelerate) {
    client = client.$extends(withAccelerate());
  }

  return client;
}

// =================================================================
// 🌐 DATABASE CLIENT INSTANCES
// =================================================================

/**
 * Primary database client (PlanetScale MySQL)
 * Used for: User management, contests, real-time operations
 */
export const primaryDb = createPrismaClient(databaseConfigs.primary);

/**
 * Analytics database client (Neon PostgreSQL)
 * Used for: Analytics, complex queries, AI insights
 */
export const analyticsDb = createPrismaClient(databaseConfigs.analytics);

/**
 * Local database client (Development)
 * Used for: Local development and testing
 */
export const localDb = createPrismaClient(databaseConfigs.local);

// =================================================================
// 🎯 DATABASE SELECTOR
// =================================================================

/**
 * Get database client based on operation type
 */
export function getDatabaseClient(type: DatabaseType = 'primary'): PrismaClient {
  switch (type) {
    case 'primary':
      return primaryDb;
    case 'analytics':
      return analyticsDb;
    case 'local':
      return localDb;
    default:
      return primaryDb;
  }
}

/**
 * Get appropriate database for specific operations
 */
export function getDatabaseForOperation(operation: string): PrismaClient {
  // Analytics-heavy operations
  const analyticsOperations = [
    'analytics',
    'statistics',
    'insights',
    'reports',
    'aggregation',
    'ai_recommendations',
    'user_analytics',
    'contest_analytics',
  ];

  // Real-time operations
  const realtimeOperations = [
    'user',
    'session',
    'notification',
    'contest_registration',
    'problem_submission',
  ];

  // Contest operations
  const contestOperations = [
    'contest',
    'contest_problem',
    'platform',
    'user_platform',
  ];

  if (analyticsOperations.some(op => operation.includes(op))) {
    return analyticsDb;
  }

  if (realtimeOperations.some(op => operation.includes(op))) {
    return primaryDb;
  }

  if (contestOperations.some(op => operation.includes(op))) {
    return primaryDb;
  }

  // Default to primary for unknown operations
  return primaryDb;
}

// =================================================================
// 🔄 CONNECTION MANAGEMENT
// =================================================================

/**
 * Database connection status
 */
export interface ConnectionStatus {
  primary: boolean;
  analytics: boolean;
  local: boolean;
}

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<ConnectionStatus> {
  const status: ConnectionStatus = {
    primary: false,
    analytics: false,
    local: false,
  };

  try {
    await primaryDb.$queryRaw`SELECT 1`;
    status.primary = true;
  } catch (error) {
    console.error('Primary database health check failed:', error);
  }

  try {
    await analyticsDb.$queryRaw`SELECT 1`;
    status.analytics = true;
  } catch (error) {
    console.error('Analytics database health check failed:', error);
  }

  try {
    await localDb.$queryRaw`SELECT 1`;
    status.local = true;
  } catch (error) {
    console.error('Local database health check failed:', error);
  }

  return status;
}

/**
 * Graceful database shutdown
 */
export async function disconnectDatabases(): Promise<void> {
  console.log('🔌 Disconnecting from databases...');
  
  await Promise.allSettled([
    primaryDb.$disconnect(),
    analyticsDb.$disconnect(),
    localDb.$disconnect(),
  ]);

  console.log('✅ Database connections closed');
}

// =================================================================
// 🎛️ EVENT HANDLERS
// =================================================================

// Query logging for development
if (env.getBoolean('ENABLE_QUERY_LOGGING', false)) {
  primaryDb.$on('query', (e: any) => {
    console.log('🗄️ Primary DB Query:', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });

  analyticsDb.$on('query', (e: any) => {
    console.log('📊 Analytics DB Query:', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

// Error logging
[primaryDb, analyticsDb, localDb].forEach((client) => {
  client.$on('error', (e: any) => {
    console.error('🗄️ Database Error:', e);
  });
});

// =================================================================
// 🚀 DEFAULT EXPORTS
// =================================================================

// Primary database instance for most operations
export { primaryDb as default };
