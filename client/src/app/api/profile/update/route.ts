import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  fitnessGoal: z.enum(['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness']).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'very_active']).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: result.error.errors },
        { status: 400 }
      );
    }

    const { name, height, weight, fitnessGoal, activityLevel } = result.data;

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        height,
        weight,
        fitnessGoal,
        activityLevel,
      },
      select: {
        id: true,
        name: true,
        email: true,
        height: true,
        weight: true,
        fitnessGoal: true,
        activityLevel: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
