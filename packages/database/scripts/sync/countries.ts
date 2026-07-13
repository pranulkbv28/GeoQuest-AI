import 'dotenv/config';
import { db } from '../../src/prisma.ts';

type Country = { name: string; alpha3Code: string };
type CountriesData = Country[];

async function main() {
  const response = await fetch(`https://countries.dev/countries?fields=name,alpha3Code`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const countriesData = (await response.json()) as CountriesData;

  if (!Array.isArray(countriesData)) {
    throw new Error('Unexpected response shape: expected an array of countries');
  }

  const upsertPromises = countriesData.map((country) => {
    return db.country.upsert({
      where: { isoCode: country.alpha3Code },
      update: { name: country.name },
      create: {
        name: country.name,
        isoCode: country.alpha3Code,
      },
    });
  });

  const results = await Promise.allSettled(upsertPromises);

  let successCount = 0;
  let failureCount = 0;

  results.forEach((result, index) => {
    if (!countriesData[index]) {
      throw new Error('Unexpected response shape: expected a country object');
    }

    const countryName = countriesData[index].name;

    if (result.status === 'fulfilled') {
      successCount++;
    } else {
      failureCount++;
      const message =
        result.reason instanceof Error ? result.reason.message : String(result.reason);

      console.error(`Failed to upsert ${countryName}: ${message}`);
    }
  });

  console.log(`--- Seeding Summary ---`);
  console.log(`Successes: ${successCount}`);
  console.log(`Failures: ${failureCount}`);

  console.log(`🔍 Successfully upserted ${successCount} countries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
