import { Sidebar } from "./components/sidebar";
import { MobileNav } from "./components/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-900 font-sans selection:bg-[#F5EBFF] selection:text-[#9013FE]">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto min-h-screen">
        <div className="pt-20 lg:pt-8 px-4 lg:px-8 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
}
