'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  gradient: string;
}

const FeatureCard = ({ title, description, icon, href, gradient }: FeatureCardProps) => {
  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ 
          scale: 1.03,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden rounded-xl ${gradient} p-6 h-[220px] cursor-pointer
          transition-shadow duration-300 ease-in-out
          hover:shadow-2xl
          before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_0%,transparent_100%)]
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1/2 after:bg-gradient-to-t after:from-black/30 after:to-transparent
        `}
      >
        <div className="absolute top-4 right-4 text-white/90 w-10 h-10 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
          {icon}
        </div>
        <div className="relative z-10 mt-12">
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default FeatureCard;
