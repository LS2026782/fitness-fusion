import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { format } from 'date-fns';

type Props = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const workout = await prisma.workoutSession.findUnique({
    where: { id: params.id },
  });

  return {
    title: `${workout?.name || 'Workout'} | Fitness Fusion`,
    description: 'View workout details and track your progress',
  };
}

export default async function WorkoutDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const workout = await prisma.workoutSession.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      exercises: {
        include: {
          exercise: true,
        },
      },
    },
  });

  if (!workout) {
    redirect('/workouts/history');
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {workout.name || 'Untitled Workout'}
              </h1>
              <p className="text-gray-500 mt-1">
                {format(new Date(workout.date), 'PPP')}
              </p>
            </div>
            {workout.duration && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {workout.duration} minutes
              </span>
            )}
          </div>
          {workout.notes && (
            <p className="mt-4 text-gray-600 whitespace-pre-wrap">
              {workout.notes}
            </p>
          )}
        </div>

        <div className="space-y-8">
          {workout.exercises.map(({ exercise, sets, reps, weight, duration, distance, notes }) => (
            <div
              key={exercise.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {exercise.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {exercise.muscleGroup} • {exercise.category}
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {sets} sets
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-4 gap-4 text-sm text-gray-500 mb-2">
                  <div>Set</div>
                  {reps !== null && <div>Reps</div>}
                  {weight !== null && <div>Weight (kg)</div>}
                  {duration !== null && <div>Duration (s)</div>}
                  {distance !== null && <div>Distance (m)</div>}
                </div>
                {[...Array(sets)].map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 text-sm py-2 border-t first:border-t-0"
                  >
                    <div>{index + 1}</div>
                    {reps !== null && <div>{reps}</div>}
                    {weight !== null && <div>{weight}</div>}
                    {duration !== null && <div>{duration}</div>}
                    {distance !== null && <div>{distance}</div>}
                  </div>
                ))}
              </div>

              {notes && (
                <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                  <p className="font-medium text-gray-900 mb-1">Notes:</p>
                  {notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
