import { type Metadata } from 'next';
import RegisterForm from '../../components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register | Fitness Fusion',
  description: 'Create your Fitness Fusion account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
