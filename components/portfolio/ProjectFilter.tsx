'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface ProjectFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTechnology: string;
  onTechnologyChange: (tech: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  technologies: string[];
}

export default function ProjectFilter({
  searchQuery,
  onSearchChange,
  selectedTechnology,
  onTechnologyChange,
  selectedStatus,
  onStatusChange,
  technologies,
}: ProjectFilterProps) {
  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'live', label: 'Live' },
    { value: 'development', label: 'In Development' },
    { value: 'archived', label: 'Archived' },
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
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

        {/* Technology Filter */}
        <select
          value={selectedTechnology}
          onChange={(e) => onTechnologyChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter by technology"
        >
          <option value="all">All Technologies</option>
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter by project status"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters */}
      {(searchQuery || selectedTechnology !== 'all' || selectedStatus !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Search: "{searchQuery}"
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onTechnologyChange('all');
              onStatusChange('all');
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
