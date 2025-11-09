// Simple client-side rate limiting using localStorage

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

interface RateLimitData {
  attempts: number;
  resetTime: number;
}

export class RateLimiter {
  private key: string;
  private config: RateLimitConfig;

  constructor(key: string, config?: Partial<RateLimitConfig>) {
    this.key = `rate_limit_${key}`;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private getData(): RateLimitData {
    if (typeof window === 'undefined') {
      return { attempts: 0, resetTime: Date.now() + this.config.windowMs };
    }

    const stored = localStorage.getItem(this.key);
    if (!stored) {
      return { attempts: 0, resetTime: Date.now() + this.config.windowMs };
    }

    try {
      return JSON.parse(stored);
    } catch {
      return { attempts: 0, resetTime: Date.now() + this.config.windowMs };
    }
  }

  private setData(data: RateLimitData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  check(): { allowed: boolean; remaining: number; resetIn: number } {
    const data = this.getData();
    const now = Date.now();

    // Reset if window has passed
    if (now >= data.resetTime) {
      const newData: RateLimitData = {
        attempts: 0,
        resetTime: now + this.config.windowMs,
      };
      this.setData(newData);
      return {
        allowed: true,
        remaining: this.config.maxAttempts,
        resetIn: this.config.windowMs,
      };
    }

    // Check if limit exceeded
    if (data.attempts >= this.config.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: data.resetTime - now,
      };
    }

    return {
      allowed: true,
      remaining: this.config.maxAttempts - data.attempts,
      resetIn: data.resetTime - now,
    };
  }

  increment(): void {
    const data = this.getData();
    const now = Date.now();

    // Reset if window has passed
    if (now >= data.resetTime) {
      this.setData({
        attempts: 1,
        resetTime: now + this.config.windowMs,
      });
    } else {
      this.setData({
        ...data,
        attempts: data.attempts + 1,
      });
    }
  }

  reset(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.key);
  }

  getStatus(): { attempts: number; maxAttempts: number; resetIn: number } {
    const data = this.getData();
    const now = Date.now();

    return {
      attempts: now >= data.resetTime ? 0 : data.attempts,
      maxAttempts: this.config.maxAttempts,
      resetIn: Math.max(0, data.resetTime - now),
    };
  }
}

// Helper function to format time remaining
export function formatTimeRemaining(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remaining = hours > 1 ? `${hours} hours` : `${hours} hour`;
    return remaining;
  }
  if (minutes > 0) {
    const remaining = minutes > 1 ? `${minutes} minutes` : `${minutes} minute`;
    return remaining;
  }
  const remaining = seconds > 1 ? `${seconds} seconds` : `${seconds} second`;
  return remaining;
}

// Create a contact form rate limiter instance
export const contactFormLimiter = new RateLimiter('contact_form', {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
});
