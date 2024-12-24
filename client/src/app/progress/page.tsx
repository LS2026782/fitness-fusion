import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WorkoutVolumeStats from '../../components/charts/WorkoutVolumeStats';
import ExerciseProgressChart from '../../components/charts/ExerciseProgressChart';

export const metadata: Metadata = {
  title: 'Progress Dashboard | Fitness Fusion',
  description: 'Track your fitness progress and workout statistics',
};

export default async function ProgressPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Get user's most frequent exercises
  const topExercises = await prisma.workoutExercise.groupBy({
    by: ['exerciseId'],
    where: {
      workout: {
        userId: session.user.id,
      },
    },
    _count: {
      exerciseId: true,
    },
    orderBy: {
      _count: {
        exerciseId: 'desc',
      },
    },
    take: 3,
  });

  const exerciseDetails = await Promise.all(
    topExercises.map(async (exercise) => {
      const details = await prisma.exercise.findUnique({
        where: { id: exercise.exerciseId },
      });
      return details;
    })
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Progress Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your workout progress and view detailed statistics
          </p>
        </div>

        <div className="space-y-8">
          {/* Overall workout statistics */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Workout Statistics</h2>
            <WorkoutVolumeStats period="30" />
          </section>

          {/* Top exercises progress */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Top Exercise Progress</h2>
            <div className="space-y-6">
              {exerciseDetails.map((exercise) => 
                exercise && (
                  <ExerciseProgressChart
                    key={exercise.id}
                    exerciseId={exercise.id}
                    exerciseName={exercise.name}
                    metric="weight"
                    period="30"
                  />
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
