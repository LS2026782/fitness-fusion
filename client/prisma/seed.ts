import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // Chest Exercises
  {
    name: 'Bench Press',
    description: 'Lie on a flat bench and press the weight up',
    category: 'strength',
    muscleGroup: 'chest',
    equipment: 'barbell, bench',
  },
  {
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and triceps',
    category: 'strength',
    muscleGroup: 'chest',
    equipment: 'none',
  },
  // Back Exercises
  {
    name: 'Pull-ups',
    description: 'Vertical pulling exercise for back and biceps',
    category: 'strength',
    muscleGroup: 'back',
    equipment: 'pull-up bar',
  },
  {
    name: 'Barbell Rows',
    description: 'Bent over rowing movement for back development',
    category: 'strength',
    muscleGroup: 'back',
    equipment: 'barbell',
  },
  // Legs Exercises
  {
    name: 'Squats',
    description: 'Fundamental lower body exercise',
    category: 'strength',
    muscleGroup: 'legs',
    equipment: 'barbell',
  },
  {
    name: 'Deadlifts',
    description: 'Compound exercise for posterior chain',
    category: 'strength',
    muscleGroup: 'legs',
    equipment: 'barbell',
  },
  // Shoulders Exercises
  {
    name: 'Overhead Press',
    description: 'Vertical pressing movement for shoulders',
    category: 'strength',
    muscleGroup: 'shoulders',
    equipment: 'barbell, dumbbells',
  },
  {
    name: 'Lateral Raises',
    description: 'Isolation exercise for lateral deltoids',
    category: 'strength',
    muscleGroup: 'shoulders',
    equipment: 'dumbbells',
  },
  // Arms Exercises
  {
    name: 'Bicep Curls',
    description: 'Isolation exercise for biceps',
    category: 'strength',
    muscleGroup: 'arms',
    equipment: 'dumbbells, barbell',
  },
  {
    name: 'Tricep Extensions',
    description: 'Isolation exercise for triceps',
    category: 'strength',
    muscleGroup: 'arms',
    equipment: 'dumbbells, cable machine',
  },
  // Core Exercises
  {
    name: 'Plank',
    description: 'Isometric core exercise',
    category: 'strength',
    muscleGroup: 'core',
    equipment: 'none',
  },
  {
    name: 'Crunches',
    description: 'Basic abdominal exercise',
    category: 'strength',
    muscleGroup: 'core',
    equipment: 'none',
  },
  // Cardio Exercises
  {
    name: 'Running',
    description: 'Basic cardiovascular exercise',
    category: 'cardio',
    muscleGroup: 'full_body',
    equipment: 'none',
  },
  {
    name: 'Cycling',
    description: 'Low-impact cardiovascular exercise',
    category: 'cardio',
    muscleGroup: 'full_body',
    equipment: 'bicycle or stationary bike',
  },
  // Flexibility Exercises
  {
    name: 'Standing Forward Bend',
    description: 'Basic hamstring and lower back stretch',
    category: 'flexibility',
    muscleGroup: 'full_body',
    equipment: 'none',
  },
  {
    name: 'Cat-Cow Stretch',
    description: 'Spinal mobility exercise',
    category: 'flexibility',
    muscleGroup: 'back',
    equipment: 'none',
  },
];

async function main() {
  console.log('Start seeding exercises...');

  // Clear existing exercises
  await prisma.exercise.deleteMany();

  // Create exercises in batches
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: exercise,
      create: exercise,
    });
    console.log(`Created exercise: ${exercise.name}`);
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
