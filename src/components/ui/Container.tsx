import { cn } from '@/utils';

/**
 * Container Component
 * Provides consistent max-width and padding throughout the site
 */
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'full' | 'narrow' | 'wide';
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  const sizeClasses = {
    default: 'max-w-[1280px]',
    full: 'max-w-full',
    narrow: 'max-w-[800px]',
    wide: 'max-w-[1440px]',
  };

  return (
    <div className={cn(
      'mx-auto w-full px-6',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}

export default Container;