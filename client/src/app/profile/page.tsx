import { type Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/profile/ProfileForm';

export const metadata: Metadata = {
  title: 'Profile | Fitness Fusion',
  description: 'Manage your Fitness Fusion profile',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
          <div className="bg-gray-800 shadow rounded-lg">
            <ProfileForm user={session.user} />
          </div>
        </div>
      </div>
    </div>
  );
}
