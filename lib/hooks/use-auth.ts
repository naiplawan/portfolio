'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Query keys for auth-related queries
 */
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
} as const;

/**
 * Hook for Supabase authentication
 *
 * Provides authentication state and methods
 * Handles session persistence and refresh
 */
export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const supabase = createClient();

  // Initialize auth state
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Invalidate queries on auth state change
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  /**
   * Sign in with email and password
   */
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Signed in successfully');
      return { success: true, data };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Sign in failed: ${authError.message}`);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Sign up with email and password
   */
  const signUp = useCallback(async (email: string, password: string, metadata?: { fullName?: string }) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: metadata?.fullName || null,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      toast.success('Account created successfully');
      return { success: true, data };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Sign up failed: ${authError.message}`);
      return { success: false, error: authError };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      // Clear all queries
      queryClient.clear();

      toast.success('Signed out successfully');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Sign out failed: ${authError.message}`);
    } finally {
      setLoading(false);
    }
  }, [supabase, queryClient]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (updates: { fullName?: string; avatarUrl?: string }) => {
    if (!user) {
      toast.error('No authenticated user');
      return { success: false };
    }

    try {
      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: updates,
      });

      if (metadataError) throw metadataError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(`Profile update failed: ${authError.message}`);
      return { success: false, error: authError };
    }
  }, [supabase, user]);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };
}

/**
 * Query hook for fetching current user
 * Alternative to useSupabaseAuth for read-only access
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

/**
 * Query hook for fetching current session
 * Alternative to useSupabaseAuth for read-only access
 */
export function useCurrentSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
