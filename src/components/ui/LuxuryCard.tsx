import { cn } from '@/utils';
import { ReactNode } from 'react';

interface LuxuryCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'default' | 'dark' | 'cream';
  onClick?: () => void;
}

/**
 * LuxuryCard Component - Modern Soft Style
 * Clean, borderless, shadow-based design
 */
export function LuxuryCard({
  children,
  className,
  hover = true,
  padding = 'md',
  background = 'default',
  onClick,
}: LuxuryCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  // Soft, elegant backgrounds
  const backgroundClasses = {
    default: 'bg-white',
    dark: 'bg-[#1a1a1a]',
    cream: 'bg-[#faf9f7]',
  };


  return (
    <div
      className={cn(
        // Modern soft styling - no heavy borders
        'rounded-lg overflow-hidden',
        'shadow-sm',
        backgroundClasses[background],
        // Subtle hover - soft lift with shadow
        hover && 'transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5',
        paddingClasses[padding],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default LuxuryCard;