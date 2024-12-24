import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { z } from 'zod';

const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  notes: z.string().optional(),
  exercises: z.array(
    z.object({
      exerciseId: z.string(),
      sets: z.array(
        z.object({
          reps: z.number().optional(),
          weight: z.number().optional(),
          duration: z.number().optional(),
          distance: z.number().optional(),
          notes: z.string().optional(),
        })
      ),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = workoutSchema.parse(body);

    const workout = await prisma.workoutSession.create({
      data: {
        name: validatedData.name,
        notes: validatedData.notes,
        userId: session.user.id,
        exercises: {
          create: validatedData.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            sets: exercise.sets.length,
            reps: exercise.sets[0]?.reps,
            weight: exercise.sets[0]?.weight,
            duration: exercise.sets[0]?.duration,
            distance: exercise.sets[0]?.distance,
            notes: exercise.sets[0]?.notes,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
    });

    return NextResponse.json(workout);
  } catch (error) {
    console.error('Failed to create workout:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid workout data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
}
