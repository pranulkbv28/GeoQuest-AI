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

  console.log('🗑️ Clearing categories...');

  await db.category.deleteMany({});

  let totalCategories = await db.category.count();

  console.log(`Total categories after deletion: ${totalCategories}`);

  const seededCategories = await db.category.createMany({
    data: categories,
  });

  console.log(`✅ Inserted ${seededCategories.count} new categories`);

  totalCategories = await db.category.count();

  console.log(`📦 Total categories after insertion: ${totalCategories}`);
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
