import { FooterNav } from '@/components/footer-nav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-28">{children}</main>
      <FooterNav />
    </div>
  );
}
