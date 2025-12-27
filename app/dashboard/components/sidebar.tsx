"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: "solar:home-smile-linear" },
  { name: "Discover", href: "/dashboard/discover", icon: "solar:compass-linear" },
  { name: "Library", href: "/dashboard/library", icon: "solar:library-linear" },
  { name: "Tech Stack", href: "/dashboard/stack", icon: "solar:layers-minimalistic-linear" },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: "solar:card-linear" },
  { name: "Rewards Hub", href: "/dashboard/earn-rewards", icon: "solar:gift-linear" },
  { name: "Settings", href: "/dashboard/settings", icon: "solar:settings-linear" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed left-0 top-0 z-40 h-screen w-64 border-r border-[#E5E7EB] bg-white text-[#6B7280] lg:block">
      <div className="flex h-full flex-col px-4 py-8">
        {/* Logo */}
        <div className="mb-12 px-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#9013FE] to-[#FF8687] flex items-center justify-center text-white font-bold font-mono text-xl shadow-lg">
            F
          </div>
          <span className="text-xl font-bold tracking-tight text-[#111827]">Flowva</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-[#9013FE] bg-[#F5EBFF] shadow-sm"
                    : "hover:text-[#111827] hover:bg-[#F9FAFB]"
                )}
              >
                <Icon 
                  icon={item.icon} 
                  className={cn(
                    "text-lg transition-colors",
                    isActive ? "text-[#9013FE]" : "text-[#9CA3AF] group-hover:text-[#6B7280]"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-8 border-t border-[#E5E7EB] pt-6 px-2">
           <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#9013FE] to-[#FF8687] flex items-center justify-center text-white font-bold text-xs shadow-md">
                JM
              </div>
              <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#111827]">Jeremiah</p>
                  <p className="truncate text-xs text-[#6B7280]">Basic Plan</p>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
