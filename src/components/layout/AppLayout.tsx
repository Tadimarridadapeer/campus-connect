"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { GlobalSearchModal } from "@/components/ui/GlobalSearchModal";
import { LoginView } from "@/components/auth/LoginView";
import { cn } from "@/lib/utils";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useEdu();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // If not logged in, render the login view
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-200",
          collapsed ? "lg:pl-18" : "lg:pl-64"
        )}
      >
        <Header
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
};
