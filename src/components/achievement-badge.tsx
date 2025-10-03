import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface AchievementBadgeProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export const AchievementBadge = ({
  icon: Icon,
  label,
  className,
}: AchievementBadgeProps) => {
  return (
    <div
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-secondary px-3 text-xs font-semibold text-muted-foreground',
        className
      )}
    >
      <Icon className="h-4 w-4 text-primary" />
      <span>{label}</span>
    </div>
  );
};
