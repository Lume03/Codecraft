'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Target, User, CodeXml, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { useTranslation } from '@/context/language-provider';

const NavItem = ({ item, isActive }: { item: { href: string; label: string; icon: React.ElementType; }, isActive: boolean }) => (
    <Link 
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-secondary text-primary'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <item.icon className="h-5 w-5" strokeWidth={2} />
      <span className="text-base font-semibold">{item.label}</span>
    </Link>
);


export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const mainNavItems = [
    { href: '/learn', label: t('learn'), icon: BookOpen },
    { href: '/practice', label: t('practice'), icon: Target },
    { href: '/profile', label: t('profile'), icon: User },
  ];
  
  const bottomNavItems = [
      { href: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col">
        {/* Logo */}
        <header className="flex h-20 items-center px-4">
             <Link href="/learn" className="flex items-center gap-2 font-bold text-foreground" aria-label={`Ir a la página de ${t('app_title')}`}>
                <CodeXml className="h-7 w-7 text-primary" />
                <span className="text-xl">{t('app_title')}</span>
            </Link>
        </header>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-2 px-4" aria-label="Navegación principal">
            {mainNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return <NavItem key={item.href} item={item} isActive={isActive} />;
            })}
        </nav>

        {/* Bottom Navigation */}
         <nav className="mt-auto flex flex-col p-4" aria-label="Navegación de cuenta">
            <Separator className="mb-4" />
             {bottomNavItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return <NavItem key={item.href} item={item} isActive={isActive} />;
            })}
        </nav>
    </div>
  );
}
