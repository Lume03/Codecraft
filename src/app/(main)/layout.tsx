import { SidebarNav } from '@/components/sidebar-nav';
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
      <main className="flex flex-1 flex-col md:pl-60" role="main">
        {children}
      </main>
    </div>
  );
}
