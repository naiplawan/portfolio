'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface TiltCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onMouseMove'> {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  onClick?: () => void;
}

export function TiltCard({ children, className, intensity = 10, onClick }: TiltCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: y * intensity, y: -x * intensity });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn('cursor-pointer', className)}
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}
