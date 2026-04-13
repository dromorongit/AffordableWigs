import { cn } from '@/utils';

/**
 * SectionHeading Component
 * Provides consistent heading styling for sections
 */
interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  alignment?: 'left' | 'center' | 'right';
  hasLine?: boolean;
  gold?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  className,
  alignment = 'center',
  hasLine = false,
  gold = false,
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-12', alignmentClasses[alignment], className)}>
      <h2 className={cn(
        'text-3xl md:text-4xl font-semibold tracking-tight',
        gold ? 'text-[#d4a853]' : 'text-[#0a0a0a]'
      )}>
        {title}
      </h2>
      {hasLine && (
        <div className={cn(
          'w-16 h-0.5 bg-[#d4a853] mt-4',
          alignment === 'center' && 'mx-auto',
          alignment === 'right' && 'ml-auto',
        )} />
      )}
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-[#525252] max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;