'use client';

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  signUp: (email: string, password: string, metadata?: { fullName?: string }) => Promise<{ success: boolean; error?: AuthError }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { fullName?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: AuthError }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Supabase Auth Provider
 *
 * Replaces the demo AuthContext with production-ready Supabase authentication
 * Provides authentication state and methods to all child components
 */
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  // Use ref to store supabase client (avoids SSR issues)
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const [mounted, setMounted] = useState(false);

  // Ensure component only runs on client
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Only initialize on client side
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }

    const supabase = supabaseRef.current;
    if (!supabase) return;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error getting session:', err);
        setError(err as AuthError);
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

        // Refresh on sign in/sign out
        if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, router]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);

    const { data: _, error } = await supabaseRef.current!.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error);
      return { success: false, error };
    }

    return { success: true };
  };

  const signUp = async (email: string, password: string, metadata?: { fullName?: string }) => {
    setError(null);
    setLoading(true);

    const { data, error } = await supabaseRef.current!.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    setLoading(false);

    if (error) {
      setError(error);
      return { success: false, error };
    }

    // Create profile record
    if (data.user) {
      await supabaseRef.current
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: metadata?.fullName || null,
        });
    }

    return { success: true };
  };

  const signOut = async () => {
    setLoading(true);

    await supabaseRef.current!.auth.signOut();

    setLoading(false);
    router.push('/blog');
  };

  const updateProfile = async (updates: { fullName?: string; avatarUrl?: string }) => {
    if (!user) {
      return { success: false, error: { name: 'AuthError', message: 'No authenticated user' } as AuthError };
    }

    setError(null);

    // Update user metadata
    const { error: metadataError } = await supabaseRef.current!.auth.updateUser({
      data: updates,
    });

    if (metadataError) {
      setError(metadataError);
      return { success: false, error: metadataError };
    }

    // Update profiles table
    const { error: profileError } = await supabaseRef.current
      .from('profiles')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      setError(profileError);
      return { success: false, error: profileError };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use Supabase Auth context
 *
 * @throws Error if used outside of SupabaseAuthProvider
 */
export function useSupabaseAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuthContext must be used within SupabaseAuthProvider');
  }
  return context;
}
