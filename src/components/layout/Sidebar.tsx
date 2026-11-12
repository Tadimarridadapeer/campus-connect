"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckSquare,
  FileCheck2,
  CreditCard,
  ClipboardList,
  BookMarked,
  Award,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useEdu } from "@/context/EduContext";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/common/BrandLogo";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const pathname = usePathname();
  const { currentUser, currentInstitution } = useEdu();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Build navigation items based on role
  const getNavItems = () => {
    switch (role) {
      case "teacher":
        return [
          { name: "Teacher Portal", href: "/", icon: LayoutDashboard },
          { name: "My Students", href: "/students", icon: Users },
          { name: "Mark Attendance", href: "/attendance", icon: CheckSquare },
          { name: "My Timetable", href: "/timetable", icon: Calendar },
          { name: "Exams & Marks", href: "/examinations", icon: FileCheck2 },
          { name: "Assignments", href: "/assignments", icon: ClipboardList },
          { name: "Curriculum & Logs", href: "/curriculum", icon: BookMarked },
          { name: "Announcements", href: "/announcements", icon: Bell },
        ];
      case "student":
        return [
          { name: "Student Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Class Timetable", href: "/timetable", icon: Calendar },
          { name: "My Attendance", href: "/attendance", icon: CheckSquare },
          { name: "Exams & Report Card", href: "/examinations", icon: FileCheck2 },
          { name: "Assignments", href: "/assignments", icon: ClipboardList },
          { name: "Daily Lessons", href: "/curriculum", icon: BookMarked },
          { name: "Fee Status & Receipts", href: "/fees", icon: CreditCard },
          { name: "Certificates & ID", href: "/certificates", icon: Award },
          { name: "School Notices", href: "/announcements", icon: Bell },
        ];
      case "parent":
        return [
          { name: "Parent Overview", href: "/", icon: LayoutDashboard },
          { name: "Ward Attendance", href: "/attendance", icon: CheckSquare },
          { name: "Academic Results", href: "/examinations", icon: FileCheck2 },
          { name: "Assignments", href: "/assignments", icon: ClipboardList },
          { name: "Daily Lessons Taught", href: "/curriculum", icon: BookMarked },
          { name: "Fee Payment & Dues", href: "/fees", icon: CreditCard },
          { name: "Certificates", href: "/certificates", icon: Award },
          { name: "Announcements", href: "/announcements", icon: Bell },
        ];
      default:
        // Super Admin, Principal, Coordinator
        return [
          { name: "Overview Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Student Directory", href: "/students", icon: Users },
          { name: "Teacher Directory", href: "/teachers", icon: GraduationCap },
          { name: "Academic Structure", href: "/academics", icon: BookOpen },
          { name: "Timetable Management", href: "/timetable", icon: Calendar },
          { name: "Attendance Central", href: "/attendance", icon: CheckSquare },
          { name: "Exams & Results", href: "/examinations", icon: FileCheck2 },
          { name: "Fees & Finance", href: "/fees", icon: CreditCard },
          { name: "Assignments", href: "/assignments", icon: ClipboardList },
          { name: "Curriculum Tracking", href: "/curriculum", icon: BookMarked },
          { name: "Certificates & ID Cards", href: "/certificates", icon: Award },
          { name: "Notice Board", href: "/announcements", icon: Bell },
          { name: "Analytics & Reports", href: "/reports", icon: BarChart3 },
          { name: "Settings & Config", href: "/settings", icon: Settings },
        ];
    }
  };

  const navItems = getNavItems();

  const roleLabels: Record<string, { label: string; color: string }> = {
    super_admin: { label: "Super Admin", color: "bg-purple-100 text-purple-700" },
    principal: { label: "Principal / Admin", color: "bg-blue-100 text-blue-700" },
    coordinator: { label: "Coordinator", color: "bg-emerald-100 text-emerald-700" },
    teacher: { label: "Faculty Portal", color: "bg-amber-100 text-amber-700" },
    student: { label: "Student Portal", color: "bg-sky-100 text-sky-700" },
    parent: { label: "Parent Portal", color: "bg-rose-100 text-rose-700" },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-[#E8EAED] transition-all duration-200 select-none",
          collapsed ? "w-18" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand & Institution Info Header */}
        <div className="h-16 px-4 border-b border-[#E8EAED] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <BrandLogo size="sm" collapsed={collapsed} showTagline={!collapsed} />
          </div>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-[#9CA3AF] hover:text-[#202124] hover:bg-[#F3F4F6] transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Institution Badge when expanded */}
        {!collapsed && (
          <div className="px-3.5 pt-3 pb-1">
            <div className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] flex items-center gap-2.5">
              <span className="text-xl shrink-0">{currentInstitution.logo}</span>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#202124] truncate">
                  {currentInstitution.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] uppercase font-bold text-[#6B7280]">
                    {currentInstitution.type}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">•</span>
                  <span
                    className={cn(
                      "text-[9px] px-1.5 py-0.2 rounded font-semibold",
                      roleLabels[role]?.color || "bg-gray-100 text-gray-700"
                    )}
                  >
                    {roleLabels[role]?.label || role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative",
                  isActive
                    ? "bg-[#EEF2FC] text-[#4667D5] font-semibold"
                    : "text-[#4B5563] hover:text-[#202124] hover:bg-[#F7F8FA]"
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 shrink-0 transition-colors",
                    isActive
                      ? "text-[#4667D5]"
                      : "text-[#6B7280] group-hover:text-[#202124]"
                  )}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#4667D5] rounded-r-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-[#E8EAED] bg-[#FAFAFA]">
          {!collapsed ? (
            <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#25845A]" />
                Live Demo Mode
              </span>
              <span className="text-[10px] text-[#9CA3AF]">v1.0.0</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="w-2 h-2 rounded-full bg-[#25845A]" title="Live Demo" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
