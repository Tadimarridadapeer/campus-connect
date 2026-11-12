"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Baby,
  Check,
  CheckCheck,
  X,
  ExternalLink,
} from "lucide-react";
import { useEdu } from "@/context/EduContext";
import { UserRole } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenSearch,
}) => {
  const pathname = usePathname();
  const {
    currentUser,
    currentInstitution,
    allInstitutions,
    switchInstitution,
    logout,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    selectedChildId,
    setSelectedChildId,
    students,
    parents,
  } = useEdu();

  const [showInstMenu, setShowInstMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  if (!currentUser) return null;

  // Breadcrumbs text
  const getBreadcrumb = () => {
    if (pathname === "/") return "Overview Dashboard";
    const segment = pathname.split("/")[1];
    switch (segment) {
      case "students":
        return "Student Directory & Records";
      case "teachers":
        return "Teacher Directory & Profiles";
      case "academics":
        return "Academic Structure & Subjects";
      case "timetable":
        return "Timetable & Scheduling";
      case "attendance":
        return "Attendance Management";
      case "examinations":
        return "Examinations & Report Cards";
      case "fees":
        return "Fees & Financial Management";
      case "assignments":
        return "Assignments & Assessments";
      case "curriculum":
        return "Curriculum & Daily Teaching Logs";
      case "certificates":
        return "Certificates & Document Issuance";
      case "announcements":
        return "Notice Board & Communications";
      case "reports":
        return "Institutional Reports & Analytics";
      case "settings":
        return "Institution Customization & Settings";
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  // User's unread notifications
  const userNotifications = notifications.filter(
    (n) => n.targetRole === "all" || n.targetRole === currentUser.role
  );
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  // Linked children for parent role
  const currentParent = parents.find((p) => p.id === currentUser.parentId);
  const linkedChildren = students.filter((s) => currentParent?.childrenIds.includes(s.id));

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E8EAED] px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        {/* Left Section: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 rounded-lg text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-[#6B7280] font-normal">EDUVANTA</span>
            <span className="text-[#D1D5DB]">/</span>
            <span className="font-semibold text-[#202124]">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#9CA3AF] bg-[#F7F8FA] border border-[#E8EAED] hover:border-[#D1D5DB] rounded-lg transition-colors group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#4667D5]" />
              <span className="truncate">Search students, teachers, classes, exams...</span>
            </span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#6B7280] bg-white border border-[#E8EAED] rounded shadow-2xs">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Section: Action Controls */}
        <div className="flex items-center gap-2">
          {/* Linked Child Selector (If Parent Role) */}
          {currentUser.role === "parent" && linkedChildren.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF1F2] border border-[#FFE4E6] rounded-lg text-xs">
              <Baby className="w-3.5 h-3.5 text-[#E11D48]" />
              <span className="text-[#9F1239] font-medium">Child:</span>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#881337] outline-hidden cursor-pointer"
              >
                {linkedChildren.map((c) => (
                  <option key={c.id} value={c.id} className="text-[#202124]">
                    {c.fullName} ({c.className}-{c.sectionName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Institution Switcher (Super Admin & Admins) */}
          {(currentUser.role === "super_admin" || currentUser.role === "principal") && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowInstMenu(!showInstMenu);
                  setShowNotifMenu(false);
                  setShowProfileMenu(false);
                }}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#374151] bg-[#F7F8FA] border border-[#E8EAED] hover:bg-[#F0F2F5] rounded-lg transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#4667D5]" />
                <span className="max-w-[120px] truncate">{currentInstitution.name}</span>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
              </button>

              {showInstMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E8EAED] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-[#F3F4F6] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    Switch Institution
                  </div>
                  {allInstitutions.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => {
                        switchInstitution(inst.id);
                        setShowInstMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-base">{inst.logo}</span>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-[#202124] truncate">
                            {inst.name}
                          </p>
                          <span className="text-[10px] text-[#6B7280] uppercase">
                            {inst.type} • {inst.academicYear}
                          </span>
                        </div>
                      </div>
                      {inst.id === currentInstitution.id && (
                        <Check className="w-4 h-4 text-[#4667D5] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowInstMenu(false);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-lg text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D94B4B] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E8EAED] z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                <div className="p-3 border-b border-[#E8EAED] bg-[#FAFAFA] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#202124]">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D94B4B] text-white font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-[#4667D5] hover:underline flex items-center gap-1 font-medium"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#F3F4F6]">
                  {userNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#9CA3AF]">
                      No notifications available.
                    </div>
                  ) : (
                    userNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs hover:bg-[#F7F8FA] cursor-pointer transition-colors ${
                          !n.isRead ? "bg-[#F4F7FF]/50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-[#202124]">{n.title}</p>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#4667D5] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-[#6B7280] text-[11px] mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-[#9CA3AF] mt-1 block">
                          {n.createdAt}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowInstMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E8EAED]"
              />
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-semibold text-[#202124] block truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#6B7280] capitalize block">
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E8EAED] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-3 border-b border-[#F3F4F6]">
                  <p className="text-xs font-semibold text-[#202124]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#6B7280] truncate">{currentUser.email}</p>
                  <div className="mt-1.5">
                    <Badge variant="primary" size="sm">
                      {currentUser.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileModal(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#374151] hover:bg-[#F7F8FA] flex items-center gap-2.5 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#6B7280]" />
                    View Profile & Info
                  </button>
                  <a
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs text-[#374151] hover:bg-[#F7F8FA] flex items-center gap-2.5 transition-colors block"
                  >
                    <Shield className="w-4 h-4 text-[#6B7280]" />
                    Security & Preferences
                  </a>
                </div>

                <div className="border-t border-[#F3F4F6] pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#D94B4B] hover:bg-[#FEF2F2] flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out of Portal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="User Account Profile"
        size="md"
        footer={
          <Button variant="outline" size="sm" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#E8EAED]"
            />
            <div>
              <h4 className="text-base font-bold text-[#202124]">{currentUser.name}</h4>
              <p className="text-xs text-[#6B7280]">{currentUser.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {currentUser.role.toUpperCase()}
                </Badge>
                <span className="text-[11px] text-[#6B7280]">{currentUser.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F7F8FA] p-3 rounded-lg border border-[#E8EAED]">
            <div>
              <span className="text-[#6B7280] block text-[10px]">Institution:</span>
              <span className="font-semibold text-[#202124]">{currentInstitution.name}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[10px]">Affiliation / Code:</span>
              <span className="font-semibold text-[#202124]">{currentInstitution.code}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[10px]">Academic Year:</span>
              <span className="font-semibold text-[#202124]">{currentInstitution.academicYear}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[10px]">Session ID:</span>
              <span className="font-mono text-[10px] text-[#6B7280]">{currentUser.id}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
