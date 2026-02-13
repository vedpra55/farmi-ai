import { Sidebar } from "@/components/dashboard/Sidebar";
import { BottomNav } from "@/components/dashboard/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:pl-64 min-h-screen pb-16 md:pb-0 transition-all duration-300">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  );
}
