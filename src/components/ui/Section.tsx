import { cn } from '@/utils';

/**
 * Section Component
 * Provides consistent vertical padding and background options
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'cream' | 'dark' | 'white' | 'gold-light';
  padding?: 'default' | 'none' | 'small' | 'large';
}

export function Section({ 
  children, 
  className, 
  background = 'default',
  padding = 'default' 
}: SectionProps) {
  const backgroundClasses = {
    default: 'bg-white',
    cream: 'bg-[#f5f3ef]',
    dark: 'bg-[#0a0a0a]',
    white: 'bg-white',
    'gold-light': 'bg-[#faf5e6]',
  };

  const paddingClasses = {
    default: 'py-16 md:py-24',
    none: 'py-0',
    small: 'py-8 md:py-12',
    large: 'py-24 md:py-32',
  };

  return (
    <section className={cn(
      'w-full',
      backgroundClasses[background],
      paddingClasses[padding],
      className
    )}>
      {children}
    </section>
  );
}

export default Section;