"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#111827] group-[.toaster]:border-[#E5E7EB] group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:gap-4",
          description: "group-[.toast]:text-[#6B7280]",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-[#9013FE] group-[.toast]:to-[#FF8687] group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:shadow-lg",
          cancelButton:
            "group-[.toast]:bg-[#F9FAFB] group-[.toast]:text-[#111827] group-[.toast]:border group-[.toast]:border-[#E5E7EB]",
        },
      }}
    />
  );
}
