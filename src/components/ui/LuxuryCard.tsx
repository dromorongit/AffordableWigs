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
 * LuxuryCard Component - Redesigned for Premium Modern Look
 * Elegant, subtle cards with refined styling - no more boxy borders
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
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8',
  };

  // Softer, more elegant backgrounds
  const backgroundClasses = {
    default: 'bg-white',
    dark: 'bg-[#111111]',
    cream: 'bg-[#f9f7f2]',
  };


  return (
    <div
      className={cn(
        // More elegant styling - no heavy borders
        'rounded-[4px] overflow-hidden',
        'border border-gray-100',
        backgroundClasses[background],
        // Refined hover - subtle lift with shadow, not dramatic
        hover && 'transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-0.5',
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