import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import AuthProvider from '../components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fitness Fusion',
  description: 'Your all-in-one fitness tracking solution',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-900 text-white`}>
        <AuthProvider>
          <nav className="fixed top-0 z-50 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/">
                      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Fitness Fusion
                      </h1>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/dashboard"
                      className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800">
                    <BellIcon className="h-6 w-6" />
                  </button>
                  <Link
                    href="/profile"
                    className="flex items-center text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="pt-16">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
