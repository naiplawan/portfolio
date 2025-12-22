'use client';

import { useState, useRef, useCallback, useEffect, Children, ButtonHTMLAttributes, MouseEventHandler, MouseEvent, ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Enhanced button with ripple effect
export function RippleButton({
  children,
  className,
  onClick,
  disabled = false,
  variant = 'primary',
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    onClick?.(e);
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded-lg px-4 py-2 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantClasses[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={handleClick}
      disabled={disabled}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          animate={{
            width: 200,
            height: 200,
            x: -100,
            y: -100,
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Magnetic button that follows cursor slightly
export function MagneticButton({
  children,
  className,
  onClick,
  disabled = false,
  strength = 0.3,
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  strength?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative rounded-lg px-4 py-2 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

// Stagger reveal animation for lists
export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: initialDelay + index * staggerDelay,
            duration: 0.5,
            ease: 'easeOut',
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}

// Hover card with 3D tilt effect
export function TiltCard({
  children,
  className,
  tiltStrength = 10,
}: HTMLAttributes<HTMLDivElement> & {
  tiltStrength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateY = ((e.clientX - centerX) / rect.width) * tiltStrength;
    const rotateX = -((e.clientY - centerY) / rect.height) * tiltStrength;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={cn('transition-transform duration-200 ease-out', className)}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 50 }}
    >
      {children}
    </motion.div>
  );
}

// Text scramble effect for dynamic text
export function ScrambleText({
  text,
  className,
  scrambleSpeed = 50,
}: {
  text: string;
  className?: string;
  scrambleSpeed?: number;
}) {
  const [displayedText, setDisplayedText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback((newText: string) => {
    setIsScrambling(true);
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iterations = 0;
    const maxIterations = 10;

    const interval = setInterval(() => {
      setDisplayedText(() => {
        return newText
          .split('')
          .map((_, index) => {
            if (index < iterations) {
              return newText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
      });

      iterations += 1 / 3;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayedText(newText);
        setIsScrambling(false);
      }
    }, scrambleSpeed);
  }, [scrambleSpeed]);

  useEffect(() => {
    scramble(text);
  }, [text, scramble]);

  return (
    <span className={cn(isScrambling && 'animate-pulse', className)}>
      {displayedText}
    </span>
  );
}

// Floating animation
export function FloatingAnimation({
  children,
  duration = 3,
  intensity = 10,
  className,
}: HTMLAttributes<HTMLDivElement> & {
  duration?: number;
  intensity?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -intensity, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Glow on hover effect (temporarily disabled due to TypeScript conflicts)
// export function GlowOnHover({
//   children,
//   className,
//   glowColor = 'rgba(59, 130, 246, 0.5)',
//   ...props
// }: React.HTMLAttributes<HTMLDivElement> & {
//   glowColor?: string;
// }) {
//   return (
//     <motion.div
//       className={cn('relative', className)}
//       whileHover={{
//         boxShadow: `0 0 30px ${glowColor}`,
//       }}
//       transition={{
//         duration: 0.3,
//       }}
//       {...props}
//     >
//       {children}
//     </motion.div>
//   );
// }

// Progress bar with smooth animation
export function SmoothProgressBar({
  value,
  max = 100,
  className,
  color = 'bg-primary',
  ...props
}: {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('w-full bg-muted rounded-full h-2 overflow-hidden', className)} {...props}>
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}

// Number counter animation
export function AnimatedCounter({
  value,
  duration = 2,
  className,
  ...props
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * value);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  return (
    <span className={className} {...props}>
      {count.toLocaleString()}
    </span>
  );
}