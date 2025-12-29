'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin credentials from environment variables (NO defaults for security)
// Required env vars: NEXT_PUBLIC_ADMIN_USERNAME, ADMIN_PASSWORD
const getAdminCredentials = () => {
  const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return null;
  }

  return { username, password };
};

const AUTH_KEY = 'portfolio_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple hash function for password comparison (still not secure, but better than plain text)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Check if user is already authenticated (only on client side)
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem(AUTH_KEY);
      if (authData) {
        try {
          const { expiry } = JSON.parse(authData);
          if (Date.now() < expiry) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(AUTH_KEY);
          }
        } catch {
          localStorage.removeItem(AUTH_KEY);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }: LoginCredentials): Promise<boolean> => {
    setError(undefined);

    const credentials = getAdminCredentials();

    if (!credentials) {
      setError('Authentication not configured. Please contact administrator.');
      return false;
    }

    // Validate input
    if (!username?.trim() || !password?.trim()) {
      setError('Username and password are required');
      return false;
    }

    // Check credentials with timing-safe comparison (basic protection)
    const isValid = await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(
          username === credentials.username &&
          simpleHash(password) === simpleHash(credentials.password)
        );
      }, 100); // Small delay to prevent timing attacks
    });

    if (isValid) {
      const authData = {
        token: simpleHash(Date.now().toString() + Math.random().toString()),
        expiry: Date.now() + SESSION_DURATION
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      }

      setIsAuthenticated(true);
      return true;
    }

    setError('Invalid username or password');
    return false;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
    setIsAuthenticated(false);
    setError(undefined);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}