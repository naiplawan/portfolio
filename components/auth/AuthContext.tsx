'use client';

/**
 * SECURITY WARNING: THIS IS NOT PRODUCTION-GRADE AUTHENTICATION
 *
 * This authentication implementation is CLIENT-SIDE ONLY and provides only
 * basic UI protection. It is NOT secure against determined attackers because:
 *
 * 1. Passwords are verified in the browser (bypassable)
 * 2. Session tokens are stored in localStorage (bypassable)
 * 3. Anyone can inspect the code to find credentials
 * 4. No server-side validation occurs
 *
 * For production use, implement proper server-side authentication using:
 * - NextAuth.js (https://next-auth.js.org)
 * - Clerk, Auth0, or similar authentication services
 * - Custom backend with JWT and proper password hashing (bcrypt/argon2)
 *
 * This implementation is suitable ONLY for:
 * - Personal portfolios with non-sensitive content
 * - Demo/prototype applications
 * - Basic deterrence of casual users
 */

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

// Use Web Crypto API for proper SHA-256 hashing (better than simple hash, but still client-side)
async function secureHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Timing-safe comparison for strings
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  if (a.length !== b.length) {
    return false;
  }

  const encoder = new TextEncoder();
  const bufferA = encoder.encode(a);
  const bufferB = encoder.encode(b);

  let result = 0;
  for (let i = 0; i < bufferA.length; i++) {
    result |= bufferA[i] ^ bufferB[i];
  }

  return result === 0;
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

    // Hash both passwords and compare using timing-safe comparison
    const inputPasswordHash = await secureHash(password);
    const storedPasswordHash = await secureHash(credentials.password);
    const passwordMatch = await timingSafeEqual(inputPasswordHash, storedPasswordHash);

    const isValid = username === credentials.username && passwordMatch;

    if (isValid) {
      // Generate a random session token using Web Crypto API
      const tokenData = new Uint8Array(32);
      crypto.getRandomValues(tokenData);
      const token = Array.from(tokenData)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const authData = {
        token,
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