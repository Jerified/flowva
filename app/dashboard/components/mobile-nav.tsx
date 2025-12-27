"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/dashboard", icon: "solar:home-smile-linear" },
  { name: "Discover", href: "/dashboard/discover", icon: "solar:compass-linear" },
  { name: "Library", href: "/dashboard/library", icon: "solar:library-linear" },
  { name: "Tech Stack", href: "/dashboard/stack", icon: "solar:layers-minimalistic-linear" },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: "solar:card-linear" },
  { name: "Rewards Hub", href: "/dashboard/earn-rewards", icon: "solar:gift-linear" },
  { name: "Settings", href: "/dashboard/settings", icon: "solar:settings-linear" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E7EB] backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#9013FE] to-[#FF8687] flex items-center justify-center text-white font-bold font-mono text-xl shadow-lg">
              F
            </div>
            <span className="text-lg font-bold tracking-tight text-[#111827]">Flowva</span>
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:bg-[#F5EBFF] hover:border-[#9013FE]/30 transition-colors"
          >
            <Icon icon={isOpen ? "solar:close-square-linear" : "solar:hamburger-menu-linear"} width={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-[280px] bg-white border-l border-[#E5E7EB] z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-6 space-y-8">
                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-10 w-10 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center text-[#111827] hover:bg-[#F5EBFF] hover:border-[#9013FE]/30 transition-colors"
                  >
                    <Icon icon="solar:close-square-linear" width={24} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "text-[#9013FE] bg-[#F5EBFF] shadow-sm"
                            : "text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]"
                        )}
                      >
                        <Icon 
                          icon={item.icon} 
                          className={cn(
                            "text-lg transition-colors",
                            isActive ? "text-[#9013FE]" : "text-[#9CA3AF]"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* User Profile */}
                <div className="border-t border-[#E5E7EB] pt-6">
                  <div className="flex items-center gap-3 rounded-xl p-3 bg-[#F9FAFB]">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#9013FE] to-[#FF8687] flex items-center justify-center text-white font-bold text-xs shadow-md">
                      JM
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-[#111827]">Jeremiah</p>
                      <p className="truncate text-xs text-[#6B7280]">Basic Plan</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
