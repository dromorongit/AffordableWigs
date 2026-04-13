import { cn } from '@/utils';
import { ReactNode } from 'react';

interface LuxuryCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  background?: 'default' | 'dark';
  onClick?: () => void;
}

/**
 * LuxuryCard Component
 * Premium card styling with hover effects for product and service displays
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
    md: 'p-6',
    lg: 'p-8',
  };

  const backgroundClasses = {
    default: 'bg-white',
    dark: 'bg-[#1a1a1a]',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        'border border-gray-200',
        backgroundClasses[background],
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
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