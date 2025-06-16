/**
 * 🌱 Simple Seed Script
 *
 * Drop-in replacement for the original seed.ts that calls the new modular seeder.
 * This maintains compatibility with `npx prisma db seed` command.
 */

import { Logger } from '@nestjs/common';
import { TouriiSeeder } from './seed-new';

async function main() {
    Logger.log('🌱 Running Tourii database seeding...');
    await TouriiSeeder.seedEverything();
}

main().catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
});
