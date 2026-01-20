'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

interface SkillBoxProps {
  title: string;
  description: string;
  imageSrc: string;
}

const SkillBox = ({ title, description, imageSrc }: SkillBoxProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex flex-col justify-between text-center items-center h-full p-6 sm:p-10">
          <div className="relative w-16 h-16 mb-4">
            <Image
              src={imageSrc}
              alt={`${title} technology logo representing ${description}`}
              fill
              className="object-contain"
              sizes="64px"
            />
          </div>
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SkillBox;
