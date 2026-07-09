import 'dotenv/config';
import { prisma } from '../src/lib/db';
import { PracticeGroup } from '@prisma/client';

const practiceTopics = [
  // APTITUDE
  { name: 'Number System', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Percentages', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Profit & Loss', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Simple & Compound Interest', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Time & Work', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Speed Distance Time', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Ratio & Proportion', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Averages', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Mixtures & Alligations', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Ages', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Probability', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Permutation & Combination', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Geometry & Mensuration', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Number Series', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },
  { name: 'Data Interpretation', group: PracticeGroup.APTITUDE, icon: '🔢', color: '#FFF3E0' },

  // LOGICAL_REASONING
  { name: 'Blood Relations', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Seating Arrangement', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Direction Sense', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Coding-Decoding', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Syllogisms', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Analogies', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Odd One Out', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Series Completion', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Logical Deduction', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Input-Output', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Puzzles', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Calendar & Clocks', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },
  { name: 'Ranking & Order', group: PracticeGroup.LOGICAL_REASONING, icon: '🧠', color: '#E8F4FD' },

  // VERBAL_REASONING
  { name: 'Reading Comprehension', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'Synonyms & Antonyms', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'Fill in the Blanks', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'Sentence Correction', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'Para Jumbles', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'Idioms & Phrases', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'One Word Substitution', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },
  { name: 'Error Spotting', group: PracticeGroup.VERBAL_REASONING, icon: '📝', color: '#F3E5F5' },

  // NONVERBAL_REASONING
  { name: 'Pattern Recognition', group: PracticeGroup.NONVERBAL_REASONING, icon: '🔷', color: '#E8F5E9' },
  { name: 'Mirror Images', group: PracticeGroup.NONVERBAL_REASONING, icon: '🔷', color: '#E8F5E9' },
  { name: 'Paper Folding', group: PracticeGroup.NONVERBAL_REASONING, icon: '🔷', color: '#E8F5E9' },
  { name: 'Figure Matrix', group: PracticeGroup.NONVERBAL_REASONING, icon: '🔷', color: '#E8F5E9' },
  { name: 'Embedded Figures', group: PracticeGroup.NONVERBAL_REASONING, icon: '🔷', color: '#E8F5E9' },
  { name: 'Cubes & Dice', group: PracticeGroup.NONVERBAL_REASONING, icon: '🔷', color: '#E8F5E9' }
];

async function main() {
  console.log('Clearing existing practice topics...');
  await prisma.examTopic.deleteMany();
  await prisma.practiceAttempt.deleteMany();
  await prisma.practiceQuestion.deleteMany();
  await prisma.practiceSet.deleteMany();
  await prisma.practiceTopic.deleteMany();

  console.log('Seeding practice topics...');
  for (const t of practiceTopics) {
    const slug = t.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    await prisma.practiceTopic.create({
      data: {
        name: t.name,
        slug,
        group: t.group,
        icon: t.icon,
        color: t.color
      }
    });
  }

  console.log('Practice topics seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
