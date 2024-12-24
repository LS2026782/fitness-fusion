import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get workouts with pagination
    const [workouts, total] = await Promise.all([
      prisma.workoutSession.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      }),
      prisma.workoutSession.count({
        where: {
          userId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      workouts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error('Failed to fetch workout history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout history' },
      { status: 500 }
    );
  }
}
