import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'success' | 'outline' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Badge Component
 * Small label for highlighting status, categories, or promotions
 */
export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    gold: 'bg-[#d4a853] text-[#0a0a0a]',
    success: 'bg-green-100 text-green-800',
    outline: 'bg-transparent border border-gray-300 text-gray-700',
    dark: 'bg-[#0a0a0a] text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full uppercase tracking-wider',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
}

export default Badge;