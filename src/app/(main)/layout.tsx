import { SidebarNav } from '@/components/sidebar-nav';
import { FooterNav } from '@/components/footer-nav';
import { Suspense } from 'react';
import { SidebarNavSkeleton } from '@/components/sidebar-nav-skeleton';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar para Desktop (oculta en móvil) */}
      <aside className="fixed bottom-0 left-0 top-0 z-20 hidden h-full w-60 flex-col border-r bg-card md:flex">
        <Suspense fallback={<SidebarNavSkeleton />}>
          <SidebarNav />
        </Suspense>
      </aside>

      {/* Contenido Principal */}
      <div className="flex flex-1 flex-col md:pl-60">
        <main className="flex-1 pb-28 md:pb-0">
            {children}
        </main>
      </div>

      {/* FooterNav existente (solo visible en móvil) */}
      <div className="md:hidden">
        <FooterNav />
      </div>
    </div>
  );
}
