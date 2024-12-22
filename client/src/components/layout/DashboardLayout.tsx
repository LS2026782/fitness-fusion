'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="fixed top-0 z-50 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Fitness Fusion</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
