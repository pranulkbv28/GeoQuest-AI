import 'dotenv/config';
import { db } from '../../src/prisma.ts';

const categories = [
  { name: 'Countries And Continents', categorySlug: 'countries-and-continents' },
  { name: 'Physical Features', categorySlug: 'physical-features' },
  { name: 'Culture And Society', categorySlug: 'culture-and-society' },
  { name: 'Visual Landmarks', categorySlug: 'visual-landmarks' },
  { name: 'Current Events', categorySlug: 'current-events' },
];

async function main() {
  console.log('🌱 Seeding categories...');

  let successCount = 0;
  let failureCount = 0;

  for (const category of categories) {
    try {
      await db.category.upsert({
        where: { categorySlug: category.categorySlug },
        update: { name: category.name },
        create: category,
      });

      console.log(`  ✓ ${category.name} (${category.categorySlug})`);
      successCount++;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`  ✗ Failed to upsert ${category.name}: ${message}`);
      failureCount++;
    }
  }

  const totalCategories = await db.category.count();

  console.log('--- Seeding Summary ---');
  console.log(`Processed: ${successCount} succeeded, ${failureCount} failed`);
  console.log(`📦 Total categories now in database: ${totalCategories}`);
  console.log('🎉 Category seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
