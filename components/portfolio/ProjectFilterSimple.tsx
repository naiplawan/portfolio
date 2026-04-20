'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface ProjectFilterProps {
  categories: string[]
  selectedCategory: string
  onFilter: (category: string) => void
}

export default function ProjectFilter({ categories, selectedCategory, onFilter }: ProjectFilterProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => onFilter(category)}
          className="transition-all duration-200 hover:scale-105"
          size="sm"
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </motion.div>
  )
}