/**
 * 🚀 Ultimate Contest Radar - Database Migration Runner
 * Comprehensive migration system with rollback capabilities
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../../generated/prisma';

// =================================================================
// 📊 MIGRATION CONFIGURATION
// =================================================================

interface MigrationConfig {
  databaseUrl: string;
  migrationDir: string;
  seedDir: string;
  backupDir: string;
  environment: 'development' | 'production' | 'test';
}

interface Migration {
  id: string;
  name: string;
  timestamp: Date;
  sql: string;
  rollback?: string;
  dependencies?: string[];
}

interface MigrationStatus {
  applied: string[];
  pending: string[];
  failed: string[];
  total: number;
}

const config: MigrationConfig = {
  databaseUrl: process.env.DATABASE_URL || 'postgresql://contest_user:contest_password@localhost:5432/contest_radar',
  migrationDir: path.join(process.cwd(), 'prisma', 'migrations'),
  seedDir: path.join(process.cwd(), 'scripts', 'seeds'),
  backupDir: path.join(process.cwd(), 'scripts', 'backups'),
  environment: (process.env.NODE_ENV as any) || 'development',
};

// =================================================================
// 🔧 MIGRATION UTILITIES
// =================================================================

class DatabaseMigrationRunner {
  private prisma: PrismaClient;
  private migrationTable = '_migrations';

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
    });
  }

  /**
   * Initialize migration system
   */
  async initialize(): Promise<void> {
    console.log('🚀 Initializing migration system...');
    
    // Create migration tracking table
    await this.prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS ${this.migrationTable} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rollback_sql TEXT,
        checksum VARCHAR(64)
      );
    `;

    console.log('✅ Migration system initialized');
  }

  /**
   * Generate new migration
   */
  async generateMigration(name: string, sql: string, rollback?: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const migrationName = `${timestamp}_${name}`;
    const fileName = `${migrationName}.sql`;
    
    const migrationContent = `-- Migration: ${name}
-- Generated at: ${new Date().toISOString()}
-- Environment: ${config.environment}

-- Forward migration
${sql}

${rollback ? `-- Rollback migration
${rollback}` : '-- No rollback provided'}`;

    const filePath = path.join(config.migrationDir, fileName);
    fs.writeFileSync(filePath, migrationContent);

    console.log(`✅ Generated migration: ${fileName}`);
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<MigrationStatus> {
    // Get all migration files
    const migrationFiles = fs.readdirSync(config.migrationDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get applied migrations from database
    const appliedMigrations = await this.prisma.$queryRaw<{ name: string }[]>`
      SELECT name FROM ${this.migrationTable} ORDER BY applied_at;
    `;

    const appliedNames = appliedMigrations.map(m => m.name);
    const pending = migrationFiles.filter(file => !appliedNames.includes(file));
    const failed = []; // TODO: Track failed migrations

    return {
      applied: appliedNames,
      pending,
      failed,
      total: migrationFiles.length,
    };
  }

  /**
   * Apply pending migrations
   */
  async applyMigrations(): Promise<void> {
    const status = await this.getMigrationStatus();
    
    if (status.pending.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    console.log(`🔄 Applying ${status.pending.length} migrations...`);

    for (const migrationFile of status.pending) {
      try {
        await this.applyMigration(migrationFile);
      } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`);
        throw error;
      }
    }

    console.log('✅ All migrations applied successfully');
  }

  /**
   * Apply single migration
   */
  private async applyMigration(fileName: string): Promise<void> {
    const filePath = path.join(config.migrationDir, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Split forward and rollback SQL
    const parts = content.split('-- Rollback migration');
    const forwardSQL = parts[0].replace(/-- Forward migration[\s\S]*?--/, '').trim();
    const rollbackSQL = parts[1]?.trim();

    console.log(`📦 Applying migration: ${fileName}`);

    // Start transaction
    await this.prisma.$transaction(async (tx) => {
      // Apply migration
      await tx.$executeRawUnsafe(forwardSQL);
      
      // Record migration
      await tx.$executeRaw`
        INSERT INTO ${this.migrationTable} (name, rollback_sql)
        VALUES (${fileName}, ${rollbackSQL || null});
      `;
    });

    console.log(`✅ Migration applied: ${fileName}`);
  }

  /**
   * Rollback migration
   */
  async rollbackMigration(fileName: string): Promise<void> {
    // Get migration rollback SQL
    const result = await this.prisma.$queryRaw<{ rollback_sql: string | null }[]>`
      SELECT rollback_sql FROM ${this.migrationTable} WHERE name = ${fileName};
    `;

    if (result.length === 0) {
      throw new Error(`Migration not found: ${fileName}`);
    }

    const rollbackSQL = result[0].rollback_sql;
    if (!rollbackSQL) {
      throw new Error(`No rollback SQL for migration: ${fileName}`);
    }

    console.log(`↩️ Rolling back migration: ${fileName}`);

    // Execute rollback
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(rollbackSQL);
      await tx.$executeRaw`
        DELETE FROM ${this.migrationTable} WHERE name = ${fileName};
      `;
    });

    console.log(`✅ Migration rolled back: ${fileName}`);
  }

  /**
   * Reset database (dangerous!)
   */
  async resetDatabase(): Promise<void> {
    if (config.environment === 'production') {
      throw new Error('Cannot reset production database!');
    }

    console.log('⚠️ Resetting database...');

    // Get all applied migrations in reverse order
    const applied = await this.prisma.$queryRaw<{ name: string }[]>`
      SELECT name FROM ${this.migrationTable} ORDER BY applied_at DESC;
    `;

    // Rollback all migrations
    for (const migration of applied) {
      try {
        await this.rollbackMigration(migration.name);
      } catch (error) {
        console.error(`❌ Failed to rollback ${migration.name}:`, error);
      }
    }

    // Drop all tables except migration table
    await this.prisma.$executeRaw`
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename != '${this.migrationTable}')
        LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || r.tablename || ' CASCADE';
        END LOOP;
      END
      $$;
    `;

    console.log('✅ Database reset complete');
  }

  /**
   * Create database backup
   */
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup_${timestamp}.sql`;
    const backupPath = path.join(config.backupDir, backupFile);

    // Ensure backup directory exists
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
    }

    console.log('📦 Creating database backup...');

    // Use pg_dump for backup (requires PostgreSQL client tools)
    const command = `pg_dump "${config.databaseUrl}" > "${backupPath}"`;
    execSync(command, { stdio: 'pipe' });

    console.log(`✅ Backup created: ${backupFile}`);
    return backupFile;
  }

  /**
   * Show migration history
   */
  async showHistory(): Promise<void> {
    const migrations = await this.prisma.$queryRaw<{
      name: string;
      applied_at: Date;
    }[]>`
      SELECT name, applied_at FROM ${this.migrationTable} ORDER BY applied_at DESC;
    `;

    console.log('\n📋 Migration History:');
    console.log('='.repeat(50));
    
    migrations.forEach((migration, index) => {
      console.log(`${index + 1}. ${migration.name}`);
      console.log(`   Applied: ${migration.applied_at.toISOString()}`);
    });
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

  // Show help without database connection
  if (!command) {
    console.log(`
🚀 Ultimate Contest Radar - Migration System

Usage: npm run migration <command>

Commands:
  status     - Show migration status
  apply      - Apply pending migrations
  rollback   - Rollback specific migration
  reset      - Reset database (development only!)
  backup     - Create database backup
  history    - Show migration history
  generate   - Generate new migration

Examples:
  npm run migration status
  npm run migration apply
  npm run migration rollback 20241201_initial_schema
  npm run migration generate add_users_table "CREATE TABLE users..."
    `);
    return;
  }

  const runner = new DatabaseMigrationRunner();

  try {
    await runner.initialize();

    switch (command) {
      case 'status':
        const status = await runner.getMigrationStatus();
        console.log('\n📊 Migration Status:');
        console.log(`✅ Applied: ${status.applied.length}`);
        console.log(`⏳ Pending: ${status.pending.length}`);
        console.log(`❌ Failed: ${status.failed.length}`);
        console.log(`📦 Total: ${status.total}`);
        break;

      case 'apply':
        await runner.applyMigrations();
        break;

      case 'rollback':
        const fileName = args[1];
        if (!fileName) {
          console.error('❌ Please specify migration file name');
          process.exit(1);
        }
        await runner.rollbackMigration(fileName);
        break;

      case 'reset':
        if (config.environment === 'production') {
          console.error('❌ Cannot reset production database!');
          process.exit(1);
        }
        console.log('⚠️ This will delete all data! Are you sure? (y/N)');
        const input = process.stdin.readLine();
        if (input?.toLowerCase() === 'y') {
          await runner.resetDatabase();
        }
        break;

      case 'backup':
        await runner.createBackup();
        break;

      case 'history':
        await runner.showHistory();
        break;

      case 'generate':
        const name = args[1];
        const sql = args[2];
        if (!name || !sql) {
          console.error('❌ Usage: npm run migration:generate <name> "<sql>"');
          process.exit(1);
        }
        await runner.generateMigration(name, sql);
        break;

      default:
        console.log(`
🚀 Ultimate Contest Radar - Migration System

Usage: npm run migration <command>

Commands:
  status     - Show migration status
  apply      - Apply pending migrations
  rollback   - Rollback specific migration
  reset      - Reset database (development only!)
  backup     - Create database backup
  history    - Show migration history
  generate   - Generate new migration

Examples:
  npm run migration status
  npm run migration apply
  npm run migration rollback 20241201_initial_schema
  npm run migration generate add_users_table "CREATE TABLE users..."
        `);
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await runner.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { DatabaseMigrationRunner, Migration, MigrationStatus };
