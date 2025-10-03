import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { IOSSwitch } from '../ui/switch';

interface SettingsRowProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  trailing?:
    | { type: 'toggle'; checked: boolean; onCheckedChange: (checked: boolean) => void }
    | { type: 'chevron' }
    | { type: 'text'; value: string };
  href?: string;
}

export function SettingsRow({ icon: Icon, title, subtitle, trailing, href }: SettingsRowProps) {
  const content = (
    <div
      role={!trailing || trailing.type !== 'toggle' ? 'button' : undefined}
      tabIndex={!trailing || trailing.type !== 'toggle' ? 0 : undefined}
      aria-label={`Abrir ${title}`}
      className={cn(
        "group flex items-center gap-3 px-4 py-3 md:py-4 h-[72px] md:h-[76px]",
        href && "transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white/5"
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-xl border">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-[15px] font-medium leading-tight md:text-[16px]">{title}</p>
        <p className="mt-0.5 text-[13px] text-foreground/70">{subtitle}</p>
      </div>
      {trailing && (
        <div className="flex items-center">
          {trailing.type === 'toggle' && (
            <IOSSwitch checked={trailing.checked} onCheckedChange={trailing.onCheckedChange} />
          )}
          {trailing.type === 'chevron' && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
          {trailing.type === 'text' && (
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-muted-foreground">{trailing.value}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
