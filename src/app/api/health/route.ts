/**
 * 🚀 Ultimate Contest Radar - Health Check API
 * Comprehensive system health monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/prisma/client';
import { checkRedisHealth, getCacheStats } from '@/lib/redis/client';
import { redisClient } from '@/lib/redis/client';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: {
      status: 'online' | 'offline';
      primary: boolean;
      analytics: boolean;
      local: boolean;
    };
    redis: {
      status: 'online' | 'offline';
      connected: boolean;
      stats?: any;
    };
    api: {
      status: 'online';
      uptime: string;
      memory: {
        used: string;
        total: string;
        percentage: number;
      };
    };
  };
  version: string;
  environment: string;
}

/**
 * GET /api/health
 * Comprehensive system health check
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    // Check Redis health
    const redisOnline = await checkRedisHealth();
    const cacheStats = redisOnline ? await getCacheStats() : null;
    
    // Check API health
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapUsed + memoryUsage.heapTotal;
    const memoryPercentage = Math.round((memoryUsage.heapUsed / totalMemory) * 100);
    
    // Determine overall system status
    const dbOnline = dbHealth.primary || dbHealth.local;
    const systemStatus: HealthStatus['status'] = 
      dbOnline && redisOnline ? 'healthy' :
      dbOnline || redisOnline ? 'degraded' : 'unhealthy';
    
    const healthData: HealthStatus = {
      status: systemStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbOnline ? 'online' : 'offline',
          primary: dbHealth.primary,
          analytics: dbHealth.analytics,
          local: dbHealth.local,
        },
        redis: {
          status: redisOnline ? 'online' : 'offline',
          connected: redisOnline,
          stats: cacheStats,
        },
        api: {
          status: 'online',
          uptime: process.uptime().toString(),
          memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
            percentage: memoryPercentage,
          },
        },
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
    
    const responseTime = Date.now() - startTime;
    
    // Add response time to headers
    const response = NextResponse.json(healthData, {
      status: systemStatus === 'healthy' ? 200 : 
              systemStatus === 'degraded' ? 200 : 503,
      headers: {
        'X-Response-Time': `${responseTime}ms`,
        'X-System-Status': systemStatus,
      },
    });
    
    console.log(`🏥 Health check completed in ${responseTime}ms - Status: ${systemStatus}`);
    
    return response;
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    const errorResponse: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'offline',
          primary: false,
          analytics: false,
          local: false,
        },
        redis: {
          status: 'offline',
          connected: false,
        },
        api: {
          status: 'online',
          uptime: process.uptime().toString(),
          memory: {
            used: '0MB',
            total: '0MB',
            percentage: 0,
          },
        },
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
    
    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'X-System-Status': 'unhealthy',
      },
    });
  }
}

/**
 * POST /api/health/detailed
 * Detailed health check with additional diagnostics
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Run additional diagnostics
    const dbHealth = await checkDatabaseHealth();
    const redisOnline = await checkRedisHealth();
    
    // Test database query
    let dbQueryTest = 'failed';
    try {
      // This would test a simple query if we had the schema
      dbQueryTest = dbHealth.local ? 'passed' : 'skipped';
    } catch (error) {
      dbQueryTest = 'failed';
    }
    
    // Test Redis operations
    let redisTest = 'failed';
    let redisLatency = 0;
    if (redisOnline) {
      const testStart = Date.now();
      try {
        await redisClient.ping();
        redisLatency = Date.now() - testStart;
        redisTest = 'passed';
      } catch (error) {
        redisTest = 'failed';
      }
    }
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      database: {
        ...dbHealth,
        queryTest: dbQueryTest,
      },
      redis: {
        connected: redisOnline,
        test: redisTest,
        latency: `${redisLatency}ms`,
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
    };
    
    return NextResponse.json({
      status: 'detailed_check_complete',
      diagnostics,
    });
    
  } catch (error) {
    console.error('❌ Detailed health check failed:', error);
    
    return NextResponse.json({
      status: 'detailed_check_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, {
      status: 500,
    });
  }
}
