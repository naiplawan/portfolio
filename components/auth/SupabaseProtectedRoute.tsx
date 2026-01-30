'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSupabaseAuth } from '@/lib/hooks/use-auth';

interface SupabaseProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Supabase Protected Route Component
 *
 * Replaces the demo ProtectedRoute with production-ready Supabase authentication
 * Redirects to login if user is not authenticated
 */
export default function SupabaseProtectedRoute({ children, fallback }: SupabaseProtectedRouteProps) {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page instead of showing form inline
      router.push('/blog/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Show fallback or redirect
    if (fallback) {
      return <>{fallback}</>;
    }

    // Return null while redirecting
    return null;
  }

  return <>{children}</>;
}

/**
 * Higher-order component version for protecting components
 */
export function withSupabaseAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & SupabaseProtectedRouteProps> {
  return function AuthenticatedComponent(props: P & SupabaseProtectedRouteProps) {
    return (
      <SupabaseProtectedRoute>
        <Component {...props} />
      </SupabaseProtectedRoute>
    );
  };
}
