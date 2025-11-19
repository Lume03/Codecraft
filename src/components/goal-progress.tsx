import type { LucideIcon } from 'lucide-react';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

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
  const isCompleted = progress >= 100;

  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg p-2 transition-colors",
      isCompleted ? "bg-green-500/10" : "hover:bg-secondary/50"
    )}>
      <div className={cn(
        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
        isCompleted ? "bg-green-500/20" : "bg-secondary"
      )}>
        <Icon className={cn("h-6 w-6", isCompleted ? "text-green-400" : "text-primary")} />
      </div>
      <div className="w-full flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">
          Racha actual: {currentValue} / {targetValue} días
        </p>
        <Progress
          value={progress}
          className="mt-1.5 h-1.5 bg-background [&>div]:bg-green-500"
        />
      </div>
    </div>
  );
};
