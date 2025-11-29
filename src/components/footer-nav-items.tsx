'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/language-provider';

export default function FooterNavItems() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/learn', label: t('learn'), icon: BookOpen },
    { href: '/practice', label: t('practice'), icon: Target },
    { href: '/profile', label: t('profile'), icon: User },
  ];

  return (
    <nav className="mx-auto grid h-full max-w-md grid-cols-3 items-center gap-2 px-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground',
              isActive && 'text-primary'
            )}
          >
            <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[11px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
