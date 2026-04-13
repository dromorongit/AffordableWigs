import { cn } from '@/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

/**
 * Button Component - Redesigned for Premium Modern Look
 * Sleek, elegant buttons with refined styling
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md',
    fullWidth = false,
    isLoading = false,
    className,
    disabled,
    ...props 
  }, ref) => {
    // Modern premium button styles - cleaner, less chunky
    const variantClasses = {
      // Primary: sleek black, no harsh borders
      primary: 'bg-[#0a0a0a] text-white border border-transparent hover:bg-[#1a1a1a] hover:shadow-lg',
      // Secondary: elegant outline, subtle fill on hover
      secondary: 'bg-transparent text-[#0a0a0a] border border-gray-300 hover:border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white',
      // Ghost: minimalist, refined
      ghost: 'bg-transparent text-[#0a0a0a] border-none hover:text-[#c9a84a]',
      // Gold: luxurious accent, warm gold
      gold: 'bg-[#c9a84a] text-white border border-transparent hover:bg-[#dbbf70] hover:shadow-gold',
    };

    // Refined sizing - more elegant proportions
    const sizeClasses = {
      sm: 'px-4 py-2 text-[0.75rem] tracking-[0.08em]',
      md: 'px-6 py-2.5 text-[0.8rem] tracking-[0.06em]',
      lg: 'px-8 py-3.5 text-[0.85rem] tracking-[0.05em]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          // Base: elegant, minimal, smooth
          'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-[#c9a84a] focus:ring-offset-2 focus:ring-offset-white',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          // Remove uppercase for more editorial feel - use tracking instead
          'uppercase',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;