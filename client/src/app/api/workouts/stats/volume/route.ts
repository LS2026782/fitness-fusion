import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get workouts with exercises
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Calculate volume per muscle group
    const volumeByMuscleGroup = workouts.reduce((acc, workout) => {
      workout.exercises.forEach(({ exercise, sets, weight }) => {
        const muscleGroup = exercise.muscleGroup;
        if (!acc[muscleGroup]) {
          acc[muscleGroup] = {
            totalSets: 0,
            totalVolume: 0, // volume = sets * weight
            exerciseCount: new Set(),
          };
        }
        acc[muscleGroup].totalSets += sets;
        acc[muscleGroup].totalVolume += sets * (weight ?? 0);
        acc[muscleGroup].exerciseCount.add(exercise.id);
      });
      return acc;
    }, {} as Record<string, { totalSets: number; totalVolume: number; exerciseCount: Set<string> }>);

    // Convert volume data for response
    const muscleGroupStats = Object.entries(volumeByMuscleGroup).map(
      ([muscleGroup, stats]) => ({
        muscleGroup,
        totalSets: stats.totalSets,
        totalVolume: stats.totalVolume,
        uniqueExercises: stats.exerciseCount.size,
      })
    );

    // Calculate daily workout frequency
    const workoutsByDate = workouts.reduce((acc, workout) => {
      const date = workout.date.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate overall statistics
    const totalWorkouts = workouts.length;
    const totalExercises = Object.values(volumeByMuscleGroup).reduce(
      (sum, { exerciseCount }) => sum + exerciseCount.size,
      0
    );
    const totalSets = Object.values(volumeByMuscleGroup).reduce(
      (sum, { totalSets }) => sum + totalSets,
      0
    );
    const totalVolume = Object.values(volumeByMuscleGroup).reduce(
      (sum, { totalVolume }) => sum + totalVolume,
      0
    );

    // Calculate workout frequency
    const daysInPeriod = parseInt(period);
    const workoutFrequency = totalWorkouts / daysInPeriod;

    return NextResponse.json({
      muscleGroups: muscleGroupStats,
      workoutFrequency: {
        daily: workoutsByDate,
        average: workoutFrequency,
      },
      summary: {
        totalWorkouts,
        totalExercises,
        totalSets,
        totalVolume,
        averageVolumePerWorkout: totalVolume / totalWorkouts,
      },
    });
  } catch (error) {
    console.error('Failed to fetch workout volume stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout volume stats' },
      { status: 500 }
    );
  }
}
