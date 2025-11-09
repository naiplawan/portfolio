'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Number */}
          <div className="relative mb-8">
            <motion.h1
              className="text-[150px] sm:text-[200px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              404
            </motion.h1>
            <motion.div
              className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off into the digital void.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.back()}
              className="px-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Popular pages you might be looking for:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Projects', href: '/projects' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Blog', href: '/blog' },
              ].map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(link.href)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="w-64 h-64 relative opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
