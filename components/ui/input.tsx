import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'flex h-10 w-full rounded-lg border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-input bg-background',
        premium: 'bio-input',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input, inputVariants };
