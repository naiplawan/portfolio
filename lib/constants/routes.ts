/**
 * Application route constants
 * Centralized route definitions for type safety and consistency
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  BLOG: '/blog',
  BLOG_MANAGE: '/blog/manage',
  CONTACT: '/contact',
  BOOKING: '/booking',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
