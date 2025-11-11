'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/learn', label: 'Aprender', icon: BookOpen },
  { href: '/practice', label: 'Practicar', icon: Target },
  { href: '/profile', label: 'Perfil', icon: User },
];

export default function FooterNavItems() {
  const pathname = usePathname();

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
              isActive && 'text-foreground'
            )}
          >
            {isActive ? (
              <div className="flex h-[48px] w-full flex-col items-center justify-center gap-1 rounded-2xl bg-primary text-background">
                <item.icon className="h-6 w-6" strokeWidth={2.5} />
                <span className="text-xs font-bold">{item.label}</span>
              </div>
            ) : (
              <>
                <item.icon className="h-6 w-6" strokeWidth={2} />
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
