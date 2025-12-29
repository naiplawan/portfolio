export function createAuthToken() {
  return {
    token: 'simple-auth-token',
    expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
}

export function validateAuthData(authData: string): boolean {
  try {
    const { expiry } = JSON.parse(authData);
    return Date.now() < expiry;
  } catch {
    return false;
  }
}

export const AUTH_KEY = 'portfolio_auth';