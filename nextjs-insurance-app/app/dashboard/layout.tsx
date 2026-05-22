import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNav />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
