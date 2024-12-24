'use client';

import { motion } from 'framer-motion';
import {
  HeartIcon,
  BeakerIcon,
  MoonIcon,
  ClockIcon,
  FireIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import FeatureCard from '../components/dashboard/FeatureCard';

const features = [
  {
    title: 'Fitness Tracking',
    description: 'Log workouts, track progress, and achieve your fitness goals',
    icon: <FireIcon className="w-full h-full" />,
    href: '/workouts/log',
    gradient: 'bg-gradient-to-br from-orange-500 to-pink-500',
  },
  {
    title: 'Nutrition',
    description: 'Track meals, calories, and maintain a balanced diet',
    icon: <HeartIcon className="w-full h-full" />,
    href: '/nutrition',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
  },
  {
    title: 'Hydration',
    description: 'Monitor water intake and stay hydrated throughout the day',
    icon: <BeakerIcon className="w-full h-full" />,
    href: '/hydration',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
  },
  {
    title: 'Sleep',
    description: 'Track sleep patterns and improve your rest quality',
    icon: <MoonIcon className="w-full h-full" />,
    href: '/sleep',
    gradient: 'bg-gradient-to-br from-indigo-500 to-purple-500',
  },
  {
    title: 'Medication',
    description: 'Manage medications and never miss a dose',
    icon: <ClockIcon className="w-full h-full" />,
    href: '/medication',
    gradient: 'bg-gradient-to-br from-red-500 to-rose-500',
  },
  {
    title: 'Analytics',
    description: 'View detailed insights and progress reports',
    icon: <ChartBarIcon className="w-full h-full" />,
    href: '/progress',
    gradient: 'bg-gradient-to-br from-yellow-500 to-amber-500',
  },
];

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-12 relative"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="relative">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome to Fitness Fusion
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Your all-in-one platform for tracking fitness, nutrition, hydration, sleep, and
            medication
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
