import { cn } from '@/lib/utils/cn';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
