import { cn } from '@/lib/utils/cn';

export interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sage' | 'beige' | 'terracotta';
}

export function ClayCard({ children, className, variant = 'default', ...props }: ClayCardProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {},
    sage: {
      background: 'linear-gradient(145deg, #e8f0e8, #d8e0d8)',
    },
    beige: {
      background: 'linear-gradient(145deg, #faf0e8, #f0e8dc)',
    },
    terracotta: {
      background: 'linear-gradient(145deg, #f5e8e0, #ebd8cc)',
    },
  };

  return (
    <div
      className={cn(
        'clay-card p-6',
        className
      )}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </div>
  );
}
