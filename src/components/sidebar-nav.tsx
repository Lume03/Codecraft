'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Target, User, CodeXml, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const mainNavItems = [
  { href: '/learn', label: 'Aprender', icon: BookOpen },
  { href: '/practice', label: 'Practicar', icon: Target },
  { href: '/profile', label: 'Perfil', icon: User },
];

const bottomNavItems = [
    { href: '/settings', label: 'Ajustes', icon: Settings },
];

const NavItem = ({ item, isActive }: { item: typeof mainNavItems[0], isActive: boolean }) => (
    <Link href={item.href} legacyBehavior passHref>
      <a className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-secondary text-primary'
      )}>
        <item.icon className="h-5 w-5" strokeWidth={2} />
        <span className="text-base font-semibold">{item.label}</span>
      </a>
    </Link>
);


export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center px-4">
             <Link href="/learn" className="flex items-center gap-2 font-bold text-foreground">
                <CodeXml className="h-7 w-7 text-primary" />
                <span className="text-xl">RavenCode</span>
            </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2 px-4">
            {mainNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return <NavItem key={item.href} item={item} isActive={isActive} />;
            })}
        </nav>

        {/* Bottom Navigation */}
         <div className="mt-auto flex flex-col p-4">
            <Separator className="mb-4" />
             {bottomNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return <NavItem key={item.href} item={item} isActive={isActive} />;
            })}
        </div>
    </div>
  );
}
