
# Fullstack Developer Portfolio

A modern, production-ready portfolio website built with Next.js, TypeScript, and cutting-edge web technologies. Features comprehensive performance optimizations, accessibility compliance, and professional design patterns.

## ✨ Key Features

### 🚀 Performance & Optimization
- **Core Web Vitals Monitoring** - Real-time performance tracking
- **Next.js Image Optimization** - WebP/AVIF format support
- **Advanced Caching** - Optimized resource loading
- **Bundle Optimization** - Code splitting and compression

### ♿ Accessibility & SEO
- **WCAG 2.1 AA Compliant** - Full accessibility support
- **Structured Data** - JSON-LD for enhanced search visibility
- **Dynamic Sitemap** - Auto-generated SEO optimization
- **Screen Reader Support** - Complete keyboard navigation

### 🔒 Security & Best Practices
- **Environment Variables** - Secure credential management
- **Security Headers** - CSP, XSS protection, and content restrictions
- **TypeScript Strict Mode** - Comprehensive type safety
- **Error Boundaries** - Graceful error handling

### 📱 Progressive Web App
- **PWA Manifest** - App-like experience
- **Mobile Optimization** - Touch-friendly responsive design
- **Offline Capabilities** - Enhanced mobile performance

### 🎨 Enhanced User Experience
- **Interactive Skills Display** - Proficiency levels with animated progress bars
- **Blog Section** - Search and filtering capabilities
- **Loading States** - Skeleton loaders and smooth transitions
- **Dark Mode Support** - Seamless theme switching with HSL color tokens
- **Premium Design System** - Tokenized colors, shadows, and animations
- **Glassmorphism Effects** - Modern frosted glass UI elements

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - Latest React features with concurrent rendering
- **TypeScript** - Type-safe development with strict mode
- **Tailwind CSS 4** - Modern utility-first CSS framework
- **shadcn/ui** - High-quality accessible component library
- **Framer Motion** - Advanced animations and micro-interactions
- **Lucide React** - Consistent icon system
- **CVA** - Class Variance Authority for component variants

### Performance & Monitoring
- **web-vitals** - Core Web Vitals tracking
- **Next.js Image** - Optimized image delivery
- **Performance API** - Real-time monitoring

### Backend & Integrations
- **EmailJS** - Secure contact form functionality
- **Structured Data** - JSON-LD for SEO enhancement
- **PWA Manifest** - Progressive Web App capabilities

### Development Tools
- **ESLint** - Advanced code linting with Next.js rules
- **TypeScript Strict Mode** - Comprehensive type checking
- **Error Boundaries** - Production-ready error handling
- **pnpm** - Fast, efficient package management

## 🎨 Design Features

### Premium Organic Design System
- **Color Palette:** Warm, earthy tones with terracotta primary, warm sand secondary, and sage green accents
- **Design Tokens:** HSL-based color system for consistent theming
- **Dark Mode:** Full support with automatic color adaptation
- **Glassmorphism:** Frosted glass effects with backdrop blur
- **Shadows:** Biomorphic shadow system with CSS variables
- **Animations:** Standardized durations and easing curves
- **Typography:** Plus Jakarta Sans (body), Outfit (display), JetBrains Mono (code)

### Component Architecture
- **Modular shadcn/ui:** Consistent, accessible components
- **Premium Variants:** Glass, elevated, and premium styling options
- **Responsive Grid:** CSS Grid and Flexbox layouts
- **Smooth Transitions:** Professional motion design with Framer Motion

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naiplawan/portfolio-react-page.git
   cd portfolio-react-page
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   # EmailJS Configuration (Required for contact form)
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   
   # Contact Information
   NEXT_PUBLIC_CONTACT_EMAIL=your.email@example.com
   NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
   NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourusername
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional: Google Analytics
   NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🏗️ Design System Architecture

### Component Variants System

The project uses Class Variance Authority (CVA) for type-safe component variants:

```tsx
// Button example
const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        premium: 'bio-button',  // Glassmorphism style
        outline: 'border border-input',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      }
    }
  }
)
```

### Utility Classes

Key utility classes defined in `app/globals.css`:

- `.bio-glass-card` - Glassmorphism card with backdrop blur
- `.bio-button` - Premium button with gradient and shadow
- `.bio-input` - Enhanced input with focus ring
- `.bio-gradient-text` - Primary-to-accent gradient text
- `.section-padding` - Responsive section spacing

### Custom Tailwind Configuration

Extended with design system tokens in `tailwind.config.js`:

```js
boxShadow: {
  'bio-soft': 'var(--bio-shadow-soft)',
  'bio-medium': 'var(--bio-shadow-medium)',
  'glow-md': '0 0 40px hsl(var(--primary) / 0.2)',
},
transitionDuration: {
  normal: 'var(--duration-normal)',
  slow: 'var(--duration-slow)',
}
```

## 📁 Project Structure

```
├── app/                           # Next.js App Router
│   ├── about/page.tsx            # About page with social links
│   ├── blog/page.tsx             # Blog with search and filtering
│   ├── contact/page.tsx          # Contact page with form
│   ├── projects/page.tsx         # Projects showcase
│   ├── robots.txt/route.ts       # SEO robots configuration
│   ├── sitemap.xml/route.ts      # Dynamic sitemap generation
│   ├── manifest.json/route.ts    # PWA manifest
│   ├── error.tsx                 # Global error boundary
│   ├── globals.css               # Global styles with CSS variables
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Home page with structured data
├── components/
│   ├── accessibility/            # Accessibility components
│   │   ├── skip-link.tsx        # Skip navigation link
│   │   ├── focus-trap.tsx       # Focus management
│   │   └── screen-reader-announcer.tsx
│   ├── seo/
│   │   └── structured-data.tsx   # JSON-LD structured data
│   ├── ui/                       # shadcn/ui components
│   │   ├── skeleton.tsx         # Loading skeletons
│   │   └── ...                  # Button, Card, Input, etc.
│   ├── portfolio/               # Custom portfolio components
│   │   ├── skeletons.tsx        # Component-specific loaders
│   │   └── ...                  # NavBar, Skills, etc.
│   ├── error-boundary.tsx       # Error handling component
│   ├── performance-monitor.tsx  # Performance tracking
│   └── page-transition.tsx      # Route transitions
├── lib/
│   ├── performance.ts           # Core Web Vitals monitoring
│   ├── github-api.ts           # GitHub integration
│   └── utils.ts                # Utility functions
├── public/
│   ├── icons/                  # PWA icons (various sizes)
│   ├── assets/                 # Images and media files
│   └── ...                     # Static assets
├── .env.local.example          # Environment variables template
└── tailwind.config.js          # Tailwind configuration
```

## 🎯 Components Overview

### Core Components
- **NavBar:** Responsive navigation with animated text transitions
- **Content-Section:** Hero section with typewriter effects and animated cards
- **AboutMe:** Comprehensive developer story with skill highlights
- **Skills-Section:** Categorized technology stack with interactive cards
- **Contact:** Full-featured contact form with validation

### UI Components (shadcn/ui)
- **Button**: default, premium, outline, secondary, ghost, link
- **Card**: default, glass, elevated variants
- **Input/Textarea**: default and premium variants with enhanced focus states
- **Badge, Separator, Label, Select, Progress**
- Consistent styling with Premium Organic theme
- Accessible and keyboard navigable

## 🎨 Premium Organic Theme

The portfolio uses a carefully crafted warm, earthy color palette with HSL tokens:

```css
/* Primary Colors */
--primary: 28 50% 45%;        /* Rich terracotta #C97C4C */
--secondary: 35 30% 72%;      /* Warm sand #D4B896 */
--accent: 105 20% 65%;        /* Muted sage #9DB89A */
--success: 145 55% 42%;       /* Sage green for success states */
--destructive: 0 65% 45%;     /* Red for errors */

/* Neutral Colors */
--background: 45 30% 97%;     /* Ultra warm cream */
--foreground: 25 15% 15%;     /* Near black */
--muted: 45 20% 90%;          /* Subtle backgrounds */
--card: 45 30% 96%;           /* Card backgrounds */
```

### Design Tokens

```css
/* Border Radius */
--radius: 1.25rem;             /* Consistent rounded corners */

/* Shadows */
--bio-shadow-soft: 0 20px 50px -12px rgba(201, 124, 76, 0.15);
--bio-shadow-medium: 0 25px 60px -15px rgba(201, 124, 76, 0.2);
--glass-shadow: 0 12px 40px rgba(201, 124, 76, 0.08);

/* Animation Durations */
--duration-normal: 300ms;      /* Standard transition */
--duration-slow: 600ms;        /* Slower animations */
```

## 📱 Responsive Design

- **Mobile-first:** Optimized for all screen sizes
- **Flexible Grid:** CSS Grid and Flexbox for complex layouts
- **Touch-friendly:** Large touch targets and smooth interactions
- **Performance:** Optimized images and lazy loading

## 🚀 Performance Features

### Core Web Vitals Monitoring
- Real-time LCP, INP, CLS, FCP, and TTFB tracking
- Performance budgets and alerts
- Navigation timing analysis
- Resource loading optimization

### Image Optimization
- Next.js Image component with WebP/AVIF support
- Responsive image sizes (640px to 3840px)
- Lazy loading and blur placeholder
- Automatic format selection

### Accessibility Compliance
- WCAG 2.1 AA standards
- Screen reader compatibility
- Keyboard navigation support
- Focus management and skip links
- Color contrast compliance

## 🚀 Deployment

### Production Build
```bash
# Build and test
pnpm build
pnpm start

# Deploy to Vercel
vercel --prod
```

### Environment Variables Setup
Ensure these variables are set in your deployment platform:
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_APP_URL`

### Post-Deployment Checklist
- [ ] Test contact form functionality
- [ ] Verify PWA installation
- [ ] Check Core Web Vitals scores
- [ ] Validate accessibility compliance
- [ ] Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Rachaphol Plookaom** - [GitHub](https://github.com/naiplawan)

---

*Built with ❤️ using Next.js, shadcn/ui, and modern web technologies*
