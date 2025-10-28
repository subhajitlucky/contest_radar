/**
 * 🚀 Ultimate Contest Radar - Contest Validation Schemas
 * Comprehensive Zod schemas for contest data validation
 */

import { z } from 'zod';

// =================================================================
// 🏆 CONTEST VALIDATION SCHEMAS
// =================================================================

/**
 * Contest platform enum
 */
export const ContestPlatformSchema = z.enum([
  'codeforces',
  'leetcode', 
  'atcoder',
  'codechef',
  'geeksforgeeks',
  'hackerrank',
  'topcoder',
  'codeforces_gym',
]);

/**
 * Contest type enum
 */
export const ContestTypeSchema = z.enum([
  'rated',
  'unrated', 
  'practice',
  'educational',
  'virtual',
  'official',
]);

/**
 * Contest phase enum
 */
export const ContestPhaseSchema = z.enum([
  'upcoming',
  'coding',
  'system_test',
  'finished',
  'cancelled',
]);

/**
 * Contest difficulty enum
 */
export const ContestDifficultySchema = z.enum([
  'easy',
  'medium',
  'hard',
  'expert',
  'challenging',
]);

/**
 * Contest timing schema
 */
export const ContestTimingSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().int().positive(),
  freezeDuration: z.number().int().optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
});

/**
 * Contest statistics schema
 */
export const ContestStatisticsSchema = z.object({
  participantCount: z.number().int().nonnegative().optional(),
  maxRating: z.number().int().optional(),
  minRating: z.number().int().optional(),
  averageScore: z.number().float().optional(),
  problemsCount: z.number().int().positive().optional(),
}).partial();

/**
 * Base contest schema
 */
export const ContestBaseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  platform: ContestPlatformSchema,
  type: ContestTypeSchema,
  phase: ContestPhaseSchema,
  timing: ContestTimingSchema,
  contestUrl: z.string().url().optional(),
  statistics: ContestStatisticsSchema.optional(),
  tags: z.array(z.string()).optional(),
  difficulty: ContestDifficultySchema.optional(),
  isFeature: z.boolean().default(false),
  isVerified: z.boolean().default(false),
});

/**
 * Create contest schema (for POST requests)
 */
export const CreateContestSchema = ContestBaseSchema.extend({
  externalId: z.string().min(1),
});

/**
 * Update contest schema (for PATCH requests)
 */
export const UpdateContestSchema = ContestBaseSchema.partial().extend({
  id: z.string(),
});

/**
 * Contest query parameters schema
 */
export const ContestQuerySchema = z.object({
  page: z.string().transform((val) => parseInt(val)).pipe(
    z.number().int().positive().default(1)
  ),
  limit: z.string().transform((val) => parseInt(val)).pipe(
    z.number().int().positive().max(100).default(10)
  ),
  platform: ContestPlatformSchema.optional(),
  type: ContestTypeSchema.optional(),
  phase: ContestPhaseSchema.optional(),
  upcoming: z.string().transform((val) => val === 'true').optional(),
  featured: z.string().transform((val) => val === 'true').optional(),
  search: z.string().max(100).optional(),
  sortBy: z.enum(['startTime', 'name', 'participantCount', 'difficulty']).default('startTime'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Contest registration schema
 */
export const ContestRegistrationSchema = z.object({
  userId: z.string(),
  contestId: z.string(),
  registeredAt: z.string().datetime().default(() => new Date().toISOString()),
  participatedAt: z.string().datetime().optional(),
  rank: z.number().int().positive().optional(),
  score: z.number().int().nonnegative().optional(),
  problemsSolved: z.number().int().nonnegative().optional(),
  ratingChange: z.number().int().optional(),
  newRating: z.number().int().optional(),
});

/**
 * Contest problem schema
 */
export const ContestProblemSchema = z.object({
  id: z.string(),
  contestId: z.string(),
  problemId: z.string(),
  problemNumber: z.number().int().positive(),
  problemTitle: z.string(),
  problemDifficulty: ContestDifficultySchema,
  problemTags: z.array(z.string()),
  points: z.number().int().positive().optional(),
  editorialUrl: z.string().url().optional(),
  solutionUrl: z.string().url().optional(),
});

/**
 * Contest analytics schema
 */
export const ContestAnalyticsSchema = z.object({
  contestId: z.string(),
  totalParticipants: z.number().int().positive(),
  averageScore: z.number().float(),
  averageRank: z.number().float().optional(),
  scoreDistribution: z.record(z.string(), z.number()).optional(),
  problemDifficulty: z.record(z.string(), z.number()).optional(),
  submissionStats: z.record(z.string(), z.object({
    total: z.number().int(),
    accepted: z.number().int(),
    wrong: z.number().int(),
    timeLimit: z.number().int(),
    memoryLimit: z.number().int(),
  })).optional(),
  ratingChanges: z.record(z.string(), z.number()).optional(),
  crossPlatformData: z.record(z.string(), z.any()).optional(),
});

/**
 * Contest response schemas
 */
export const ContestResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    contests: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      platform: ContestPlatformSchema,
      type: ContestTypeSchema,
      phase: ContestPhaseSchema,
      timing: ContestTimingSchema,
      statistics: ContestStatisticsSchema.optional(),
      contestUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
      isFeature: z.boolean(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })),
    pagination: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      total: z.number().int(),
      totalPages: z.number().int(),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
    filters: z.object({
      applied: z.object({
        platform: ContestPlatformSchema.nullable(),
        type: ContestTypeSchema.nullable(),
        phase: ContestPhaseSchema.nullable(),
        upcoming: z.boolean(),
      }),
      available: z.object({
        platforms: z.array(ContestPlatformSchema),
        types: z.array(ContestTypeSchema),
        phases: z.array(ContestPhaseSchema),
      }),
    }),
    meta: z.object({
      timestamp: z.string().datetime(),
      responseTime: z.number().int(),
      cacheStatus: z.enum(['hit', 'miss', 'bypass']),
    }),
  }),
});

/**
 * Single contest response schema
 */
export const SingleContestResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    contest: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      platform: ContestPlatformSchema,
      type: ContestTypeSchema,
      phase: ContestPhaseSchema,
      timing: ContestTimingSchema,
      statistics: ContestStatisticsSchema.optional(),
      contestUrl: z.string().url().optional(),
      tags: z.array(z.string()).optional(),
      difficulty: ContestDifficultySchema.optional(),
      isFeature: z.boolean(),
      isVerified: z.boolean(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
    problems: z.array(ContestProblemSchema).optional(),
    analytics: ContestAnalyticsSchema.optional(),
    registrations: z.array(ContestRegistrationSchema).optional(),
  }),
});

/**
 * Contest error response schema
 */
export const ContestErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
    timestamp: z.string().datetime(),
  }),
});

// =================================================================
// 🔍 TYPE EXPORTS
// =================================================================

export type ContestPlatform = z.infer<typeof ContestPlatformSchema>;
export type ContestType = z.infer<typeof ContestTypeSchema>;
export type ContestPhase = z.infer<typeof ContestPhaseSchema>;
export type ContestDifficulty = z.infer<typeof ContestDifficultySchema>;
export type ContestTiming = z.infer<typeof ContestTimingSchema>;
export type ContestStatistics = z.infer<typeof ContestStatisticsSchema>;
export type CreateContest = z.infer<typeof CreateContestSchema>;
export type UpdateContest = z.infer<typeof UpdateContestSchema>;
export type ContestQuery = z.infer<typeof ContestQuerySchema>;
export type ContestRegistration = z.infer<typeof ContestRegistrationSchema>;
export type ContestProblem = z.infer<typeof ContestProblemSchema>;
export type ContestAnalytics = z.infer<typeof ContestAnalyticsSchema>;
export type ContestResponse = z.infer<typeof ContestResponseSchema>;
export type SingleContestResponse = z.infer<typeof SingleContestResponseSchema>;
export type ContestErrorResponse = z.infer<typeof ContestErrorResponseSchema>;
