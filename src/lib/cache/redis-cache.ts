/**
 * 🚀 Ultimate Contest Radar - Redis Cache Utilities
 * High-performance caching layer for contest data and API responses
 */

import { redisClient } from '@/lib/redis/client';
import { env } from '@/config/env';

// =================================================================
// 🗂️ CACHE CONFIGURATION
// =================================================================

/**
 * Cache TTL configurations (in seconds)
 */
export const CACHE_TTL = {
  // Contest data (changes frequently)
  CONTESTS: 300, // 5 minutes
  CONTEST_DETAILS: 600, // 10 minutes
  
  // Problem data (less frequent updates)
  PROBLEMS: 1800, // 30 minutes
  PROBLEM_DETAILS: 3600, // 1 hour
  
  // User data (changes occasionally)
  USER_PROFILE: 900, // 15 minutes
  USER_STATS: 1800, // 30 minutes
  
  // Platform data (static for long periods)
  PLATFORMS: 86400, // 24 hours
  PLATFORM_CONFIG: 43200, // 12 hours
  
  // API responses (short-term)
  API_RESPONSE: 60, // 1 minute
  SEARCH_RESULTS: 300, // 5 minutes
  
  // Analytics data (medium-term)
  ANALYTICS: 1800, // 30 minutes
  USER_ACTIVITY: 600, // 10 minutes
  
  // Default TTL
  DEFAULT: 300, // 5 minutes
} as const;

/**
 * Cache key prefixes for organization
 */
export const CACHE_PREFIXES = {
  CONTESTS: 'cr:contests',
  PROBLEMS: 'cr:problems', 
  USERS: 'cr:users',
  PLATFORMS: 'cr:platforms',
  API: 'cr:api',
  ANALYTICS: 'cr:analytics',
  SESSIONS: 'cr:sessions',
  NOTIFICATIONS: 'cr:notifications',
} as const;

/**
 * Cache key factory
 */
export function createCacheKey(prefix: string, identifier: string | number): string {
  return `${prefix}:${identifier}`;
}

// =================================================================
// 💾 CACHE OPERATIONS
// =================================================================

/**
 * Set value in cache with TTL
 */
export async function setCache<T>(
  key: string, 
  value: T, 
  ttlSeconds: number = CACHE_TTL.DEFAULT
): Promise<boolean> {
  try {
    const serializedValue = JSON.stringify(value);
    await redisClient.setEx(key, ttlSeconds, serializedValue);
    return true;
  } catch (error) {
    console.error(`❌ Cache set error for key ${key}:`, error);
    return false;
  }
}

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const value = await redisClient.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`❌ Cache get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<boolean> {
  try {
    const result = await redisClient.del(key);
    return result > 0;
  } catch (error) {
    console.error(`❌ Cache delete error for key ${key}:`, error);
    return false;
  }
}

/**
 * Check if key exists in cache
 */
export async function existsCache(key: string): Promise<boolean> {
  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`❌ Cache exists error for key ${key}:`, error);
    return false;
  }
}

// =================================================================
// 🔄 CACHE UTILITIES
// =================================================================

/**
 * Delete multiple keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;
    
    const result = await redisClient.del(keys);
    return result;
  } catch (error) {
    console.error(`❌ Cache pattern delete error for pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Get all keys by pattern
 */
export async function getCacheKeys(pattern: string): Promise<string[]> {
  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error(`❌ Cache keys error for pattern ${pattern}:`, error);
    return [];
  }
}

/**
 * Clear all cache data (use with caution!)
 */
export async function clearAllCache(): Promise<boolean> {
  try {
    await redisClient.flushAll();
    console.log('🧹 All cache cleared');
    return true;
  } catch (error) {
    console.error('❌ Cache clear error:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<any> {
  try {
    const info = await redisClient.info();
    const stats = {
      connected: true,
      memory_used: '',
      keys_count: 0,
    };
    
    // Parse Redis INFO for basic stats
    const lines = info.split('\n');
    for (const line of lines) {
      if (line.startsWith('used_memory_human:')) {
        stats.memory_used = line.split(':')[1];
      }
      if (line.startsWith('db0:keys=')) {
        stats.keys_count = parseInt(line.split('=')[1].split(',')[0]);
      }
    }
    
    return stats;
  } catch (error) {
    console.error('❌ Cache stats error:', error);
    return { connected: false };
  }
}

// =================================================================
// 🎯 CONTEXT-SPECIFIC CACHE METHODS
// =================================================================

/**
 * Cache contest data
 */
export async function cacheContest(contestId: string, contestData: any): Promise<void> {
  const key = createCacheKey(CACHE_PREFIXES.CONTESTS, contestId);
  await setCache(key, contestData, CACHE_TTL.CONTESTS);
}

/**
 * Get cached contest data
 */
export async function getCachedContest(contestId: string): Promise<any> {
  const key = createCacheKey(CACHE_PREFIXES.CONTESTS, contestId);
  return await getCache(key);
}

/**
 * Cache user profile
 */
export async function cacheUserProfile(userId: string, profile: any): Promise<void> {
  const key = createCacheKey(CACHE_PREFIXES.USERS, `profile:${userId}`);
  await setCache(key, profile, CACHE_TTL.USER_PROFILE);
}

/**
 * Get cached user profile
 */
export async function getCachedUserProfile(userId: string): Promise<any> {
  const key = createCacheKey(CACHE_PREFIXES.USERS, `profile:${userId}`);
  return await getCache(key);
}

/**
 * Cache API response
 */
export async function cacheApiResponse(
  endpoint: string, 
  params: any, 
  response: any
): Promise<void> {
  const paramHash = JSON.stringify(params);
  const key = createCacheKey(CACHE_PREFIXES.API, `${endpoint}:${paramHash}`);
  await setCache(key, response, CACHE_TTL.API_RESPONSE);
}

/**
 * Get cached API response
 */
export async function getCachedApiResponse(endpoint: string, params: any): Promise<any> {
  const paramHash = JSON.stringify(params);
  const key = createCacheKey(CACHE_PREFIXES.API, `${endpoint}:${paramHash}`);
  return await getCache(key);
}

/**
 * Cache search results
 */
export async function cacheSearchResults(
  query: string, 
  filters: any, 
  results: any
): Promise<void> {
  const searchKey = `${query}:${JSON.stringify(filters)}`;
  const key = createCacheKey(CACHE_PREFIXES.API, `search:${searchKey}`);
  await setCache(key, results, CACHE_TTL.SEARCH_RESULTS);
}

/**
 * Get cached search results
 */
export async function getCachedSearchResults(query: string, filters: any): Promise<any> {
  const searchKey = `${query}:${JSON.stringify(filters)}`;
  const key = createCacheKey(CACHE_PREFIXES.API, `search:${searchKey}`);
  return await getCache(key);
}

// =================================================================
// 🧠 INTELLIGENT CACHING
// =================================================================

/**
 * Wrap expensive function calls with caching
 */
export async function cacheWithFallback<T>(
  key: string,
  fallback: () => Promise<T>,
  ttlSeconds: number = CACHE_TTL.DEFAULT,
  forceRefresh: boolean = false
): Promise<T> {
  // Try to get from cache first
  if (!forceRefresh) {
    const cached = await getCache<T>(key);
    if (cached) {
      console.log(`✅ Cache hit for key: ${key}`);
      return cached;
    }
  }
  
  console.log(`⚡ Cache miss for key: ${key}, executing fallback...`);
  
  // Execute fallback and cache result
  const result = await fallback();
  await setCache(key, result, ttlSeconds);
  
  return result;
}

// =================================================================
// 🔧 CACHE INVALIDATION HELPERS
// =================================================================

/**
 * Invalidate user-related cache when user data updates
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  const patterns = [
    createCacheKey(CACHE_PREFIXES.USERS, `profile:${userId}`),
    createCacheKey(CACHE_PREFIXES.USERS, `stats:${userId}`),
    createCacheKey(CACHE_PREFIXES.CONTESTS, `registrations:${userId}*`),
  ];
  
  for (const pattern of patterns) {
    await deleteCachePattern(pattern);
  }
}

/**
 * Invalidate contest-related cache when contest data updates
 */
export async function invalidateContestCache(contestId: string): Promise<void> {
  const key = createCacheKey(CACHE_PREFIXES.CONTESTS, contestId);
  await deleteCache(key);
  
  // Also invalidate related search results
  await deleteCachePattern(createCacheKey(CACHE_PREFIXES.API, `search:*${contestId}*`));
}

/**
 * Invalidate problem cache when problem data updates
 */
export async function invalidateProblemCache(problemId: string): Promise<void> {
  const key = createCacheKey(CACHE_PREFIXES.PROBLEMS, problemId);
  await deleteCache(key);
  
  // Invalidate related contest data if this problem is in contests
  await deleteCachePattern(createCacheKey(CACHE_PREFIXES.CONTESTS, `*problem:${problemId}*`));
}
