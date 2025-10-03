import type { LucideIcon } from 'lucide-react';
import { Progress } from './ui/progress';

interface GoalProgressProps {
  icon: LucideIcon;
  title: string;
  currentValue: number;
  targetValue: number;
}

export const GoalProgress = ({
  icon: Icon,
  title,
  currentValue,
  targetValue,
}: GoalProgressProps) => {
  const progress = Math.min((currentValue / targetValue) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="w-full flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">
          Racha actual: {currentValue} días
        </p>
        <Progress
          value={progress}
          className="mt-1 h-2 bg-background [&>div]:bg-success"
        />
      </div>
    </div>
  );
};
