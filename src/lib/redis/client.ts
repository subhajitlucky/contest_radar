/**
 * 🚀 Ultimate Contest Radar - Redis Client Configuration
 * Local Redis setup for caching and real-time features
 */

import Redis from 'redis';
import { env } from '@/config/env';

// =================================================================
// 🔴 REDIS CLIENT CONFIGURATION
// =================================================================

/**
 * Redis client configuration
 */
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  database?: number;
  retryStrategy?: (times: number) => number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

// Default local Redis configuration
const redisConfig: RedisConfig = {
  host: env.get('REDIS_URL')?.replace('redis://', '').split(':')[0] || 'localhost',
  port: parseInt(env.get('REDIS_URL')?.split(':')[1] || '6379'),
  password: undefined, // No password for local development
  database: 0,
  
  // Retry strategy for connection issues
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    console.log(`🔄 Redis connection attempt ${times}, retrying in ${delay}ms`);
    return delay;
  },
  
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// =================================================================
// 🔧 REDIS CLIENT FACTORY
// =================================================================

/**
 * Create Redis client with error handling and logging
 */
function createRedisClient(): Redis.RedisClientType {
  const client = Redis.createClient({
    socket: {
      host: redisConfig.host,
      port: redisConfig.port,
      reconnectStrategy: redisConfig.retryStrategy,
    },
    database: redisConfig.database,
    maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
  });

  // Connection event handlers
  client.on('connect', () => {
    console.log('🔴 Redis: Connecting to Redis server...');
  });

  client.on('ready', () => {
    console.log('✅ Redis: Connected and ready to use');
  });

  client.on('error', (err) => {
    console.error('❌ Redis Error:', err.message);
  });

  client.on('end', () => {
    console.log('🔴 Redis: Connection closed');
  });

  client.on('reconnecting', () => {
    console.log('🔄 Redis: Reconnecting...');
  });

  return client;
}

// =================================================================
// 🌐 REDIS CLIENT INSTANCES
// =================================================================

/**
 * Primary Redis client for caching
 */
export const redisClient = createRedisClient();

/**
 * Initialize Redis connection
 */
export async function initializeRedis(): Promise<void> {
  try {
    await redisClient.connect();
    console.log('🎉 Redis initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Redis:', error);
    throw error;
  }
}

/**
 * Gracefully disconnect Redis
 */
export async function disconnectRedis(): Promise<void> {
  try {
    await redisClient.quit();
    console.log('🔌 Redis disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting Redis:', error);
  }
}

/**
 * Check Redis connection health
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const result = await redisClient.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('❌ Redis health check failed:', error);
    return false;
  }
}

// =================================================================
// 🚀 DEFAULT EXPORTS
// =================================================================

export { redisClient as default };
