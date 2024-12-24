import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import WorkoutList from '../../../components/workouts/WorkoutList';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export const metadata: Metadata = {
  title: 'Workout History | Fitness Fusion',
  description: 'View your workout history and track your progress',
};

export default async function WorkoutHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Workout History</h1>
          <button
            onClick={() => window.location.href = '/workouts/log'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Log New Workout
          </button>
        </div>
        <WorkoutList />
      </div>
    </DashboardLayout>
  );
}
