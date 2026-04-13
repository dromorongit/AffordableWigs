import { cn } from '@/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

/**
 * Button Component
 * Premium button with multiple variants for different use cases
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
    const variantClasses = {
      primary: 'bg-[#0a0a0a] text-white border border-[#0a0a0a] hover:bg-[#1a1a1a] hover:border-[#1a1a1a]',
      secondary: 'bg-transparent text-[#0a0a0a] border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white',
      ghost: 'bg-transparent text-[#0a0a0a] border-none hover:text-[#d4a853]',
      gold: 'bg-[#d4a853] text-[#0a0a0a] border border-[#d4a853] hover:bg-[#e8c87a] hover:border-[#e8c87a]',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium uppercase tracking-wider transition-all duration-250',
          'focus:outline-none focus:ring-2 focus:ring-[#d4a853] focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
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