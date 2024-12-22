import { type Metadata } from 'next';
import LoginForm from '../../components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | Fitness Fusion',
  description: 'Login to your Fitness Fusion account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
