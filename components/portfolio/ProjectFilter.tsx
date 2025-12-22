'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface ProjectFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTechnology: string;
  onTechnologyChange: (tech: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  technologies: string[];
  years: number[];
  allTags: string[];
}

export default function ProjectFilter({
  searchQuery,
  onSearchChange,
  selectedTechnology,
  onTechnologyChange,
  selectedStatus,
  onStatusChange,
  selectedYear,
  onYearChange,
  selectedCategory,
  onCategoryChange,
  selectedTags,
  onTagsChange,
  technologies,
  years,
  allTags,
}: ProjectFilterProps) {
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'live', label: 'Live' },
    { value: 'development', label: 'In Development' },
    { value: 'archived', label: 'Archived' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'wellness', label: 'Wellness' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-12"
    >
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Projects</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search Input */}
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search projects by name or description"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger aria-label="Filter by project category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger aria-label="Filter by project status">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Technology Filter */}
        <Select value={selectedTechnology} onValueChange={onTechnologyChange}>
          <SelectTrigger aria-label="Filter by technology">
            <SelectValue placeholder="All Technologies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select
          value={selectedYear}
          onValueChange={(value) => onYearChange(value)}
        >
          <SelectTrigger aria-label="Filter by year">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select defaultValue="recent">
          <SelectTrigger aria-label="Sort projects">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags Filter */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Tags</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  onTagsChange(selectedTags.filter(t => t !== tag));
                } else {
                  onTagsChange([...selectedTags, tag]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
          {allTags.length > 12 && (
            <span className="px-3 py-1.5 rounded-full text-sm text-gray-500 bg-gray-50 dark:bg-gray-800">
              +{allTags.length - 12} more
            </span>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedTechnology !== 'all' || selectedStatus !== 'all' || selectedYear !== 'all' || selectedCategory !== 'all' || selectedTags.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Search: "{searchQuery}"
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
              Category: {selectedCategory}
            </span>
          )}
          {selectedTechnology !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Tech: {selectedTechnology}
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              Status: {selectedStatus}
            </span>
          )}
          {selectedYear !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200">
              Year: {selectedYear}
            </span>
          )}
          {selectedTags.length > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              Tags: {selectedTags.length}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onTechnologyChange('all');
              onStatusChange('all');
              onYearChange('all');
              onCategoryChange('all');
              onTagsChange([]);
            }}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </motion.div>
  );
}
