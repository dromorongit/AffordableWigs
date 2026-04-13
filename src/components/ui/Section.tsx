import { cn } from '@/utils';

/**
 * Section Component - Redesigned for Editorial Feel
 * More generous spacing, refined background options
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'default' | 'cream' | 'dark' | 'white' | 'ivory';
  padding?: 'default' | 'none' | 'small' | 'large' | 'xlarge';
}

export function Section({ 
  children, 
  className, 
  background = 'default',
  padding = 'default' 
}: SectionProps) {
  // Refined, warmer backgrounds
  const backgroundClasses = {
    default: 'bg-white',
    cream: 'bg-[#f9f7f2]',
    dark: 'bg-[#0a0a0a]',
    white: 'bg-white',
    ivory: 'bg-[#f5f2e8]',
  };

  // More generous padding for editorial feel
  const paddingClasses = {
    default: 'py-20 md:py-28',
    none: 'py-0',
    small: 'py-12 md:py-16',
    large: 'py-24 md:py-32',
    xlarge: 'py-32 md:py-40',
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