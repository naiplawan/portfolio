/** Site-wide CSP; the Keystatic admin also shows GitHub avatars. */
const contentSecurityPolicy = (extraImgSrc = '') =>
  [
    "default-src 'self'",
    // Note: unsafe-inline is kept for compatibility with Next.js dev mode and libraries
    // For production, consider implementing nonce-based CSP via middleware
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://vercel.live",
    // unsafe-inline for styles is required by Tailwind CSS and some UI libraries
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Removed http: - only allow HTTPS images
    `img-src 'self' data: blob: https://opengraph.githubassets.com https://github.com${extraImgSrc}`,
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://api.github.com https://*.vercel-insights.com https://vercel.live https://api.emailjs.com",
    "frame-src 'self' https://vercel.live",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://api.emailjs.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Keystatic's GitHub mode signs in through 127.0.0.1 under `next dev`
  allowedDevOrigins: ['127.0.0.1'],

  // Curated projects are read from content/projects/ at render time (ISR on /projects)
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
      },
    ],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Screenshots moved into per-project folders managed by Keystatic
  async redirects() {
    return [
      ['/assets/projects/perd-wai.png', '/assets/projects/perd-wai/image.png'],
      ['/assets/projects/layer-3d.png', '/assets/projects/layer-3d/image.png'],
      ['/assets/projects/cafe-nme.webp', '/assets/projects/cafe-nme/image.webp'],
      ['/assets/byte-track.png', '/assets/projects/bytetrack/image.png'],
    ].map(([source, destination]) => ({ source, destination, permanent: true }))
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          { key: 'Content-Security-Policy', value: contentSecurityPolicy() },
        ],
      },
      {
        source: '/keystatic/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy(' https://avatars.githubusercontent.com'),
          },
        ],
      },
    ];
  },
};

export default nextConfig;