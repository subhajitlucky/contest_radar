/**
 * 🚀 Ultimate Contest Radar - Database Seeding System
 * Comprehensive seed data for platforms, contests, and initial setup
 */

import { PrismaClient } from '../../generated/prisma';
import fs from 'fs';
import path from 'path';

// =================================================================
// 🌱 SEED DATA INTERFACES
// =================================================================

interface SeedData {
  platforms: PlatformSeed[];
  contests: ContestSeed[];
  problems: ProblemSeed[];
  achievements: AchievementSeed[];
  systemConfig: SystemConfigSeed[];
}

interface PlatformSeed {
  name: string;
  displayName: string;
  website: string;
  logo: string;
  color: string;
  isActive: boolean;
  apiEnabled: boolean;
}

interface ContestSeed {
  platformName: string;
  externalId: string;
  name: string;
  description?: string;
  type: string;
  phase: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  participantCount?: number;
  contestUrl?: string;
  tags?: string[];
  isFeature: boolean;
}

interface ProblemSeed {
  platformName: string;
  externalId: string;
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  timeLimit?: number;
  memoryLimit?: number;
  problemUrl?: string;
  editorialUrl?: string;
  acceptanceRate?: number;
  submissionCount?: number;
  isPremium: boolean;
  isFeatured: boolean;
}

interface AchievementSeed {
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  requirementType: string;
  requirementValue: any;
  points: number;
  isActive: boolean;
}

interface SystemConfigSeed {
  key: string;
  value: any;
  description: string;
  category: string;
  isActive: boolean;
}

// =================================================================
// 🎯 SEED DATA DEFINITIONS
// =================================================================

const seedData: SeedData = {
  platforms: [
    {
      name: 'codeforces',
      displayName: 'Codeforces',
      website: 'https://codeforces.com',
      logo: '/icons/platforms/codeforces.png',
      color: '#1f78b4',
      isActive: true,
      apiEnabled: true,
    },
    {
      name: 'leetcode',
      displayName: 'LeetCode',
      website: 'https://leetcode.com',
      logo: '/icons/platforms/leetcode.png',
      color: '#ffa116',
      isActive: true,
      apiEnabled: true,
    },
    {
      name: 'atcoder',
      displayName: 'AtCoder',
      website: 'https://atcoder.jp',
      logo: '/icons/platforms/atcoder.png',
      color: '#ff9800',
      isActive: true,
      apiEnabled: true,
    },
    {
      name: 'codechef',
      displayName: 'CodeChef',
      website: 'https://www.codechef.com',
      logo: '/icons/platforms/codechef.png',
      color: '#5b4638',
      isActive: true,
      apiEnabled: false,
    },
    {
      name: 'geeksforgeeks',
      displayName: 'GeeksforGeeks',
      website: 'https://www.geeksforgeeks.org',
      logo: '/icons/platforms/geeksforgeeks.png',
      color: '#2f8d46',
      isActive: true,
      apiEnabled: false,
    },
  ],

  contests: [
    {
      platformName: 'codeforces',
      externalId: '1800',
      name: 'Codeforces Round #1800 (Div. 2)',
      description: 'Educational Codeforces Round for competitive programmers',
      type: 'rated',
      phase: 'upcoming',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      duration: 120,
      participantCount: 1500,
      contestUrl: 'https://codeforces.com/contest/1800',
      tags: ['algorithms', 'math'],
      isFeature: true,
    },
    {
      platformName: 'leetcode',
      externalId: 'weekly-400',
      name: 'LeetCode Weekly Contest 400',
      description: 'Weekly programming challenge on LeetCode',
      type: 'rated',
      phase: 'upcoming',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000), // 90 minutes later
      duration: 90,
      participantCount: 2500,
      contestUrl: 'https://leetcode.com/contest/weekly-contest-400',
      tags: ['algorithms', 'data-structures'],
      isFeature: true,
    },
  ],

  problems: [
    {
      platformName: 'codeforces',
      externalId: '1800a',
      title: 'Two Permutations',
      description: 'Given two permutations, find if they are equal...',
      difficulty: 'easy',
      tags: ['permutation', 'math'],
      timeLimit: 2000,
      memoryLimit: 256,
      problemUrl: 'https://codeforces.com/contest/1800/problem/A',
      acceptanceRate: 75.5,
      submissionCount: 15000,
      isPremium: false,
      isFeatured: true,
    },
    {
      platformName: 'leetcode',
      externalId: 'two-sum',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target...',
      difficulty: 'easy',
      tags: ['array', 'hash-table'],
      timeLimit: 1000,
      memoryLimit: 256,
      problemUrl: 'https://leetcode.com/problems/two-sum/',
      acceptanceRate: 52.3,
      submissionCount: 1500000,
      isPremium: false,
      isFeatured: true,
    },
    {
      platformName: 'atcoder',
      externalId: 'abc300_a',
      title: 'Excellent Number',
      description: 'Determine if a number is excellent...',
      difficulty: 'easy',
      tags: ['implementation', 'math'],
      timeLimit: 2000,
      memoryLimit: 1024,
      problemUrl: 'https://atcoder.jp/contests/abc300/tasks/abc300_a',
      acceptanceRate: 85.2,
      submissionCount: 5000,
      isPremium: false,
      isFeatured: false,
    },
  ],

  achievements: [
    {
      name: 'First Contest',
      description: 'Participate in your first programming contest',
      category: 'contest',
      icon: '🏆',
      color: '#FFD700',
      requirementType: 'contests_participated',
      requirementValue: 1,
      points: 100,
      isActive: true,
    },
    {
      name: 'Problem Solver',
      description: 'Solve your first problem',
      category: 'problem',
      icon: '🧠',
      color: '#4CAF50',
      requirementType: 'problems_solved',
      requirementValue: 1,
      points: 50,
      isActive: true,
    },
    {
      name: 'Contest Enthusiast',
      description: 'Participate in 10 contests',
      category: 'contest',
      icon: '🔥',
      color: '#FF5722',
      requirementType: 'contests_participated',
      requirementValue: 10,
      points: 500,
      isActive: true,
    },
    {
      name: 'Daily Streak',
      description: 'Solve problems for 7 days in a row',
      category: 'streak',
      icon: '⚡',
      color: '#9C27B0',
      requirementType: 'daily_streak',
      requirementValue: 7,
      points: 300,
      isActive: true,
    },
    {
      name: 'Platform Master',
      description: 'Participate in contests on all platforms',
      category: 'social',
      icon: '🌟',
      color: '#E91E63',
      requirementType: 'platforms_connected',
      requirementValue: 5,
      points: 1000,
      isActive: true,
    },
  ],

  systemConfig: [
    // Feature Flags
    {
      key: 'ENABLE_USER_REGISTRATION',
      value: true,
      description: 'Allow new user registration',
      category: 'feature_flags',
      isActive: true,
    },
    {
      key: 'ENABLE_CONTEST_SYNC',
      value: true,
      description: 'Enable automatic contest synchronization',
      category: 'feature_flags',
      isActive: true,
    },
    {
      key: 'ENABLE_AI_RECOMMENDATIONS',
      value: false,
      description: 'Enable AI-powered contest recommendations',
      category: 'feature_flags',
      isActive: true,
    },

    // Contest Platforms
    {
      key: 'SYNC_INTERVAL_MINUTES',
      value: 60,
      description: 'How often to sync contest data (in minutes)',
      category: 'api_config',
      isActive: true,
    },
    {
      key: 'MAX_CONTEST_PARTICIPANTS',
      value: 10000,
      description: 'Maximum participants to track per contest',
      category: 'api_config',
      isActive: true,
    },

    // Notification Settings
    {
      key: 'DEFAULT_CONTEST_REMINDER_MINUTES',
      value: 10,
      description: 'Default reminder time before contest starts',
      category: 'notification_config',
      isActive: true,
    },
    {
      key: 'MAX_NOTIFICATIONS_PER_USER_PER_DAY',
      value: 50,
      description: 'Maximum notifications per user per day',
      category: 'notification_config',
      isActive: true,
    },

    // Cache Settings
    {
      key: 'CACHE_TTL_SECONDS',
      value: 300,
      description: 'Default cache TTL in seconds',
      category: 'cache_config',
      isActive: true,
    },
    {
      key: 'ENABLE_QUERY_CACHE',
      value: true,
      description: 'Enable database query caching',
      category: 'cache_config',
      isActive: true,
    },
  ],
};

// =================================================================
// 🔧 SEEDING SYSTEM
// =================================================================

class DatabaseSeeder {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Run all seeds
   */
  async seedAll(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    try {
      await this.seedPlatforms();
      await this.seedContests();
      await this.seedProblems();
      await this.seedAchievements();
      await this.seedSystemConfig();

      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  /**
   * Seed platforms
   */
  private async seedPlatforms(): Promise<void> {
    console.log('🌐 Seeding platforms...');

    for (const platform of seedData.platforms) {
      await this.prisma.platform.upsert({
        where: { name: platform.name },
        update: {
          displayName: platform.displayName,
          website: platform.website,
          logo: platform.logo,
          color: platform.color,
          isActive: platform.isActive,
          apiEnabled: platform.apiEnabled,
          updatedAt: new Date(),
        },
        create: platform,
      });
    }

    console.log(`✅ Seeded ${seedData.platforms.length} platforms`);
  }

  /**
   * Seed contests
   */
  private async seedContests(): Promise<void> {
    console.log('🏆 Seeding contests...');

    for (const contest of seedData.contests) {
      // Find platform
      const platform = await this.prisma.platform.findUnique({
        where: { name: contest.platformName },
      });

      if (!platform) {
        console.warn(`⚠️ Platform not found: ${contest.platformName}`);
        continue;
      }

      await this.prisma.contest.upsert({
        where: {
          platformId_externalId: {
            platformId: platform.id,
            externalId: contest.externalId,
          },
        },
        update: {
          name: contest.name,
          description: contest.description,
          type: contest.type,
          phase: contest.phase,
          startTime: contest.startTime,
          endTime: contest.endTime,
          duration: contest.duration,
          participantCount: contest.participantCount,
          contestUrl: contest.contestUrl,
          tags: contest.tags,
          isFeature: contest.isFeature,
          updatedAt: new Date(),
        },
        create: {
          platformId: platform.id,
          externalId: contest.externalId,
          name: contest.name,
          description: contest.description,
          type: contest.type,
          phase: contest.phase,
          startTime: contest.startTime,
          endTime: contest.endTime,
          duration: contest.duration,
          participantCount: contest.participantCount,
          contestUrl: contest.contestUrl,
          tags: contest.tags,
          isFeature: contest.isFeature,
        },
      });
    }

    console.log(`✅ Seeded ${seedData.contests.length} contests`);
  }

  /**
   * Seed problems
   */
  private async seedProblems(): Promise<void> {
    console.log('🧠 Seeding problems...');

    for (const problem of seedData.problems) {
      // Find platform
      const platform = await this.prisma.platform.findUnique({
        where: { name: problem.platformName },
      });

      if (!platform) {
        console.warn(`⚠️ Platform not found: ${problem.platformName}`);
        continue;
      }

      await this.prisma.problem.upsert({
        where: {
          platformId_externalId: {
            platformId: platform.id,
            externalId: problem.externalId,
          },
        },
        update: {
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          tags: problem.tags,
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
          problemUrl: problem.problemUrl,
          editorialUrl: problem.editorialUrl,
          acceptanceRate: problem.acceptanceRate,
          submissionCount: problem.submissionCount,
          isPremium: problem.isPremium,
          isFeatured: problem.isFeatured,
          updatedAt: new Date(),
        },
        create: {
          platformId: platform.id,
          externalId: problem.externalId,
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          tags: problem.tags,
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
          problemUrl: problem.problemUrl,
          editorialUrl: problem.editorialUrl,
          acceptanceRate: problem.acceptanceRate,
          submissionCount: problem.submissionCount,
          isPremium: problem.isPremium,
          isFeatured: problem.isFeatured,
        },
      });
    }

    console.log(`✅ Seeded ${seedData.problems.length} problems`);
  }

  /**
   * Seed achievements
   */
  private async seedAchievements(): Promise<void> {
    console.log('🏅 Seeding achievements...');

    for (const achievement of seedData.achievements) {
      await this.prisma.achievement.upsert({
        where: { name: achievement.name },
        update: {
          description: achievement.description,
          category: achievement.category,
          icon: achievement.icon,
          color: achievement.color,
          requirementType: achievement.requirementType,
          requirementValue: achievement.requirementValue,
          points: achievement.points,
          isActive: achievement.isActive,
          updatedAt: new Date(),
        },
        create: achievement,
      });
    }

    console.log(`✅ Seeded ${seedData.achievements.length} achievements`);
  }

  /**
   * Seed system configuration
   */
  private async seedSystemConfig(): Promise<void> {
    console.log('⚙️ Seeding system configuration...');

    for (const config of seedData.systemConfig) {
      await this.prisma.systemConfig.upsert({
        where: { key: config.key },
        update: {
          value: config.value,
          description: config.description,
          category: config.category,
          isActive: config.isActive,
          updatedAt: new Date(),
        },
        create: config,
      });
    }

    console.log(`✅ Seeded ${seedData.systemConfig.length} system configurations`);
  }

  /**
   * Reset and reseed database (development only)
   */
  async resetAndReseed(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot reset production database!');
    }

    console.log('⚠️ Resetting and reseeding database...');

    // Delete all data
    await this.prisma.userAchievement.deleteMany();
    await this.prisma.achievement.deleteMany();
    await this.prisma.problemSubmission.deleteMany();
    await this.prisma.problem.deleteMany();
    await this.prisma.contestRegistration.deleteMany();
    await this.prisma.contest.deleteMany();
    await this.prisma.userPlatform.deleteMany();
    await this.prisma.platform.deleteMany();
    await this.prisma.notification.deleteMany();
    await this.prisma.systemConfig.deleteMany();
    await this.prisma.user.deleteMany();

    console.log('🧹 Database cleared');

    // Reseed
    await this.seedAll();
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// =================================================================
// 🖥️ COMMAND LINE INTERFACE
// =================================================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const seeder = new DatabaseSeeder();

  try {
    switch (command) {
      case 'all':
        await seeder.seedAll();
        break;

      case 'platforms':
        await seeder.seedAll(); // Will seed all, but platforms first
        break;

      case 'contests':
        await seeder.seedAll(); // Will seed all
        break;

      case 'problems':
        await seeder.seedAll(); // Will seed all
        break;

      case 'achievements':
        await seeder.seedAll(); // Will seed all
        break;

      case 'reset':
        if (process.env.NODE_ENV === 'production') {
          console.error('❌ Cannot reset production database!');
          process.exit(1);
        }
        console.log('⚠️ This will delete all data and reseed! Are you sure? (y/N)');
        const input = process.stdin.readLine();
        if (input?.toLowerCase() === 'y') {
          await seeder.resetAndReseed();
        }
        break;

      default:
        console.log(`
🌱 Ultimate Contest Radar - Database Seeding System

Usage: npm run seed <command>

Commands:
  all         - Seed all data (platforms, contests, problems, achievements, config)
  platforms   - Seed platform data
  contests    - Seed contest data
  problems    - Seed problem data
  achievements - Seed achievement data
  reset       - Reset and reseed database (development only!)

Examples:
  npm run seed all
  npm run seed platforms
  npm run seed reset
        `);
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await seeder.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { DatabaseSeeder, SeedData, seedData };
