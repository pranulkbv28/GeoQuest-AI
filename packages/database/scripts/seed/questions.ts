import 'dotenv/config';

import { db, QuestionSource, QuestionStatus, QuestionType } from '../../src/prisma.ts';

type QuestionSeed = {
  categorySlug: string;
  countryISOCode?: string;

  question: string;
  questionImageUrl?: string;
  options: string[];
  answer: string;

  explanation?: string;
};

const questionSeedData: QuestionSeed[] = [
  {
    categorySlug: 'countries-and-continents',
    countryISOCode: 'JPN',
    question: 'What is the capital of Japan?',
    options: ['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'],
    answer: 'Tokyo',
    explanation: 'Tokyo has served as Japan’s capital since the Meiji Restoration in 1868.',
  },
  {
    categorySlug: 'countries-and-continents',
    countryISOCode: 'BRA',
    question: 'Which continent is Brazil located in?',
    options: ['South America', 'North America', 'Europe', 'Africa'],
    answer: 'South America',
    explanation: 'Brazil is the largest country in South America by both area and population.',
  },
  {
    categorySlug: 'countries-and-continents',
    countryISOCode: 'AUS',
    question: 'Australia is both a country and which of the following?',
    options: ['A continent', 'An island nation only', 'A peninsula', 'An archipelago'],
    answer: 'A continent',
    explanation: 'Australia is the smallest continent and also an independent country.',
  },
  {
    categorySlug: 'countries-and-continents',
    countryISOCode: 'EGY',
    question: 'Egypt is primarily located on which continent?',
    options: ['Africa', 'Asia', 'Europe', 'South America'],
    answer: 'Africa',
    explanation:
      'Most of Egypt lies in northeastern Africa, while the Sinai Peninsula extends into Asia.',
  },
  {
    categorySlug: 'countries-and-continents',
    countryISOCode: 'TUR',
    question: 'Turkey is commonly described as being located on which two continents?',
    options: [
      'Europe and Asia',
      'Asia and Africa',
      'Europe and Africa',
      'North America and Europe',
    ],
    answer: 'Europe and Asia',
    explanation:
      'Turkey is a transcontinental country, with territory in both southeastern Europe and western Asia.',
  },
  {
    categorySlug: 'physical-features',
    countryISOCode: 'EGY',
    question: 'Which river flows through Egypt?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Danube River'],
    answer: 'Nile River',
    explanation:
      'The Nile is the longest river in Africa and has sustained Egyptian civilization for thousands of years.',
  },
  {
    categorySlug: 'physical-features',
    countryISOCode: 'NPL',
    question: 'Which mountain range is home to Mount Everest?',
    options: ['Andes', 'Rocky Mountains', 'Himalayas', 'Alps'],
    answer: 'Himalayas',
    explanation: 'Mount Everest lies in the Himalayas on the border between Nepal and China.',
  },
  {
    categorySlug: 'physical-features',
    countryISOCode: 'AUS',
    question: 'Which major desert covers much of central Australia?',
    options: ['Sahara Desert', 'Gobi Desert', 'Great Victoria Desert', 'Kalahari Desert'],
    answer: 'Great Victoria Desert',
    explanation:
      "The Great Victoria Desert is Australia's largest desert and spans Western and South Australia.",
  },
  {
    categorySlug: 'physical-features',
    countryISOCode: 'BRA',
    question: 'Which rainforest covers a large portion of northern Brazil?',
    options: [
      'Congo Rainforest',
      'Amazon Rainforest',
      'Daintree Rainforest',
      'Valdivian Rainforest',
    ],
    answer: 'Amazon Rainforest',
    explanation:
      'Brazil contains around 60% of the Amazon Rainforest, the largest tropical rainforest in the world.',
  },
  {
    categorySlug: 'physical-features',
    countryISOCode: 'CAN',
    question: 'Which large freshwater lake is shared by Canada and the United States?',
    options: ['Lake Baikal', 'Lake Victoria', 'Lake Superior', 'Lake Titicaca'],
    answer: 'Lake Superior',
    explanation:
      'Lake Superior is the largest of the Great Lakes by surface area and is shared by Canada and the United States.',
  },
  {
    categorySlug: 'culture-and-society',
    countryISOCode: 'JPN',
    question:
      'Which traditional Japanese garment is commonly worn during festivals and special occasions?',
    options: ['Kimono', 'Hanbok', 'Cheongsam', 'Sari'],
    answer: 'Kimono',
    explanation:
      'The kimono is Japan’s traditional garment and is commonly worn during ceremonies, festivals, and other special occasions.',
  },
  {
    categorySlug: 'culture-and-society',
    countryISOCode: 'IND',
    question: 'Which festival is widely known as the Festival of Lights in India?',
    options: ['Diwali', 'Holi', 'Navratri', 'Pongal'],
    answer: 'Diwali',
    explanation:
      'Diwali celebrates the victory of light over darkness and is one of India’s most widely celebrated festivals.',
  },
  {
    categorySlug: 'culture-and-society',
    countryISOCode: 'BRA',
    question: 'Brazil is famous for hosting which annual cultural celebration?',
    options: ['Rio Carnival', 'Oktoberfest', 'La Tomatina', 'Day of the Dead'],
    answer: 'Rio Carnival',
    explanation:
      "Rio Carnival is one of the world's largest festivals, attracting millions of participants and visitors each year.",
  },
  {
    categorySlug: 'culture-and-society',
    countryISOCode: 'FRA',
    question: 'Which language is the official language of France?',
    options: ['French', 'English', 'German', 'Spanish'],
    answer: 'French',
    explanation:
      'French is the official language of France and is spoken by the vast majority of its population.',
  },
  {
    categorySlug: 'culture-and-society',
    countryISOCode: 'NZL',
    question: 'The Māori people are the indigenous people of which country?',
    options: ['New Zealand', 'Australia', 'Canada', 'Fiji'],
    answer: 'New Zealand',
    explanation:
      "The Māori are the indigenous Polynesian people of New Zealand and are an integral part of the country's culture and identity.",
  },
  {
    categorySlug: 'current-events',
    countryISOCode: 'UKR',
    question: 'Ukraine is located on which continent?',
    options: ['Europe', 'Asia', 'Africa', 'North America'],
    answer: 'Europe',
    explanation:
      'Ukraine is located in Eastern Europe and has been at the center of major international attention in recent years.',
  },
  {
    categorySlug: 'current-events',
    countryISOCode: 'ARE',
    question: 'Which city in the United Arab Emirates hosted Expo 2020, held during 2021–2022?',
    options: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
    answer: 'Dubai',
    explanation:
      'Expo 2020 Dubai was postponed because of the COVID-19 pandemic and took place from October 2021 to March 2022.',
  },
  {
    categorySlug: 'current-events',
    countryISOCode: 'IND',
    question:
      'India successfully landed the Chandrayaan-3 mission near which celestial body in 2023?',
    options: ['The Moon', 'Mars', 'Venus', 'Mercury'],
    answer: 'The Moon',
    explanation:
      'Chandrayaan-3 made India the first country to successfully land near the Moon’s south polar region.',
  },
  {
    categorySlug: 'current-events',
    countryISOCode: 'QAT',
    question: 'Which major international sporting event did Qatar host in 2022?',
    options: ['FIFA World Cup', 'Olympic Games', 'Cricket World Cup', 'Rugby World Cup'],
    answer: 'FIFA World Cup',
    explanation: 'Qatar became the first Middle Eastern nation to host the FIFA World Cup in 2022.',
  },
  {
    categorySlug: 'current-events',
    countryISOCode: 'BRA',
    question: 'Which city hosted the G20 Leaders’ Summit in Brazil in 2024?',
    options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'],
    answer: 'Rio de Janeiro',
    explanation: 'Brazil hosted the 2024 G20 Leaders’ Summit in Rio de Janeiro.',
  },
  {
    categorySlug: 'visual-landmarks',
    countryISOCode: 'IND',
    question: 'Where is this landmark located?',
    questionImageUrl: '',
    options: ['India', 'Pakistan', 'Nepal', 'Bangladesh'],
    answer: 'India',
    explanation:
      'The Taj Mahal is located in Agra, India, and was commissioned by Emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
  },
  {
    categorySlug: 'visual-landmarks',
    countryISOCode: 'FRA',
    question: 'What is the name of this landmark?',
    questionImageUrl: '',
    options: ['Eiffel Tower', 'Big Ben', 'Leaning Tower of Pisa', 'Arc de Triomphe'],
    answer: 'Eiffel Tower',
    explanation:
      'The Eiffel Tower was completed in 1889 for the Exposition Universelle (World’s Fair) held in Paris.',
  },
  {
    categorySlug: 'visual-landmarks',
    countryISOCode: 'ITA',
    question: 'Which city is home to this landmark?',
    questionImageUrl: '',
    options: ['Rome', 'Venice', 'Florence', 'Pisa'],
    answer: 'Pisa',
    explanation:
      'The Leaning Tower of Pisa is the freestanding bell tower of Pisa Cathedral and is famous for its unintended tilt.',
  },
  {
    categorySlug: 'visual-landmarks',
    countryISOCode: 'USA',
    question: 'What is the name of this monument?',
    questionImageUrl: '',
    options: ['Statue of Liberty', 'Lincoln Memorial', 'Mount Rushmore', 'Washington Monument'],
    answer: 'Statue of Liberty',
    explanation:
      'The Statue of Liberty was a gift from France to the United States in 1886 and symbolizes freedom and democracy.',
  },
  {
    categorySlug: 'visual-landmarks',
    countryISOCode: 'BRA',
    question: 'Which landmark overlooking Rio de Janeiro is shown in the image?',
    questionImageUrl: '',
    options: ['Christ the Redeemer', 'Sugarloaf Mountain', 'Copacabana Fort', 'Maracanã Stadium'],
    answer: 'Christ the Redeemer',
    explanation:
      'Christ the Redeemer stands atop Corcovado Mountain and is one of the New Seven Wonders of the World.',
  },
];

async function main() {
  console.log('🌱 Seeding questions...');

  console.log('🗑️ Clearing questions...');

  await db.question.deleteMany({});

  const categories = await db.category.findMany();

  const categoryMap = new Map(categories.map((category) => [category.categorySlug, category.id]));

  const countries = await db.country.findMany();

  const countryMap = new Map(countries.map((country) => [country.isoCode, country.id]));

  const questions = questionSeedData.map((question) => {
    const categoryId = categoryMap.get(question.categorySlug);

    if (!categoryId) {
      throw new Error(`Unknown category slug: "${question.categorySlug}"`);
    }

    let countryId: string | null = null;

    if (question.countryISOCode) {
      countryId = countryMap.get(question.countryISOCode) ?? null;

      if (!countryId) {
        throw new Error(`Unknown country: "${question.countryISOCode}"`);
      }
    }

    if (!question.options.includes(question.answer)) {
      throw new Error(
        `Answer "${question.answer}" is not present in the options for "${question.question}".`,
      );
    }

    return {
      categoryId,
      countryId,
      question: question.question,
      options: question.options,
      answer: question.answer,
      explanation: question.explanation ?? null,
      questionType: QuestionType.MULTIPLE_CHOICE,
      source: QuestionSource.MANUAL,
      status: QuestionStatus.PUBLISHED,
    };
  });

  const seededQuestions = await db.question.createMany({
    data: questions,
  });

  console.log(`✅ Inserted ${seededQuestions.count} new questions`);

  const totalQuestions = await db.question.count();

  console.log(`📦 Total questions: ${totalQuestions}`);

  console.log('🎉 Question seed completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
