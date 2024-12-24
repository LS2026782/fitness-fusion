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
    const exerciseId = searchParams.get('exerciseId');
    const metric = searchParams.get('metric') || 'weight'; // weight, reps, duration, distance
    const period = searchParams.get('period') || '30'; // days

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      );
    }

    // Get workouts within the specified period
    const workouts = await prisma.workoutSession.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000),
        },
        exercises: {
          some: {
            exerciseId,
          },
        },
      },
      select: {
        date: true,
        exercises: {
          where: {
            exerciseId,
          },
          select: {
            sets: true,
            reps: true,
            weight: true,
            duration: true,
            distance: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Process data based on the requested metric
    const progressData = workouts.map((workout) => {
      const exercise = workout.exercises[0];
      let value = null;

      switch (metric) {
        case 'weight':
          value = exercise.weight;
          break;
        case 'reps':
          value = exercise.reps;
          break;
        case 'duration':
          value = exercise.duration;
          break;
        case 'distance':
          value = exercise.distance;
          break;
      }

      return {
        date: workout.date,
        value,
        sets: exercise.sets,
      };
    });

    // Calculate additional statistics
    const values = progressData
      .map((data) => data.value)
      .filter((value): value is number => value !== null);

    const stats = {
      max: values.length > 0 ? Math.max(...values) : null,
      min: values.length > 0 ? Math.min(...values) : null,
      average: values.length > 0 
        ? values.reduce((a, b) => a + b, 0) / values.length 
        : null,
      totalSets: progressData.reduce((sum, data) => sum + data.sets, 0),
    };

    return NextResponse.json({
      progress: progressData,
      stats,
    });
  } catch (error) {
    console.error('Failed to fetch exercise progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise progress' },
      { status: 500 }
    );
  }
}
