import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
