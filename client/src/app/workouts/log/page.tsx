import { Metadata } from 'next';
import WorkoutLogger from '../../../components/workouts/WorkoutLogger';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Log Workout | Fitness Fusion',
  description: 'Track your workout progress with Fitness Fusion',
};

export default async function LogWorkoutPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Log Workout</h1>
        <WorkoutLogger />
      </div>
    </DashboardLayout>
  );
}
