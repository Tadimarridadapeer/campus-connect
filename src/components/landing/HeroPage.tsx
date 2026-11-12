"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Users,
  BookOpen,
  CreditCard,
  FileText,
  Award,
  Bell,
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight,
  Lock,
  Layers,
  Clock,
  Laptop,
  Compass,
  BarChart3,
  School,
  Database,
  ExternalLink,
} from "lucide-react";

export const HeroPage: React.FC = () => {
  const { allInstitutions, students, teachers, classes, login } = useEdu();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("principal@greenfield.demo");
  const [activeTab, setActiveTab] = useState<"overview" | "timetable" | "curriculum">("overview");

  const openAuthWithEmail = (email: string) => {
    setAuthEmail(email);
    setAuthModalOpen(true);
  };

  const demoPersonas: {
    role: UserRole;
    name: string;
    email: string;
    campus: string;
    desc: string;
    icon: string;
    avatar: string;
    highlights: string[];
  }[] = [
    {
      role: "super_admin",
      name: "Dr. Vikramaditya Rao",
      email: "admin@eduvanta.demo",
      campus: "Global Headquarters",
      desc: "Super Admin with multi-institution oversight, tenant configuration, and cross-campus analytics.",
      icon: "⚡",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      highlights: ["3 Campuses Switcher", "Tenant Logical Isolation", "Global Analytics"],
    },
    {
      role: "principal",
      name: "Mrs. Sunita Venkatraman",
      email: "principal@greenfield.demo",
      campus: "Greenfield Int. School",
      desc: "Principal & Institutional Admin managing campus admissions, staff rosters, financials, and exams.",
      icon: "🏫",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      highlights: ["Admission Registry", "Fee Collection Hub", "Staff Management"],
    },
    {
      role: "coordinator",
      name: "Mr. Ramesh Kulkarni",
      email: "coordinator@greenfield.demo",
      campus: "Greenfield Int. School",
      desc: "Academic Coordinator overseeing syllabus completion, timetables, and examination matrices.",
      icon: "📋",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      highlights: ["Curriculum Schedules", "Conflict-Free Timetables", "Exam Schemes"],
    },
    {
      role: "teacher",
      name: "Dr. Arvind Swaminathan",
      email: "teacher@greenfield.demo",
      campus: "Greenfield Int. School",
      desc: "Senior Faculty marking daily attendance, entering teaching logs, issuing homework, and grading.",
      icon: "👨‍🏫",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      highlights: ["Daily Teaching Logs", "Roll Call (P/L/LV/A)", "Marks Entry Matrix"],
    },
    {
      role: "student",
      name: "Aarav Sharma (Class 8A)",
      email: "student@greenfield.demo",
      campus: "Greenfield Int. School",
      desc: "Class 8A student accessing daily timetables, homework submissions, and official report cards.",
      icon: "🎒",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      highlights: ["Class Timetable", "Assignment Turn-in", "CBSE Report Card"],
    },
    {
      role: "parent",
      name: "Mr. Rajesh Sharma",
      email: "parent@greenfield.demo",
      campus: "Greenfield Int. School",
      desc: "Parent monitoring ward's real-time attendance, monthly fee dues, receipts, and academic feedback.",
      icon: "👨‍👧‍👦",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      highlights: ["Attendance Tracking", "Demo Online Fee Pay", "Teacher Remarks"],
    },
  ];

  const modules = [
    {
      title: "Student 360° Management",
      icon: Users,
      desc: "Comprehensive admission lifecycle with 14-field student dossier, blood groups, medical notes, printable ID cards, and automated bulk promotion.",
      tag: "Lifecycle",
    },
    {
      title: "Conflict-Free Timetabling",
      icon: Calendar,
      desc: "Automated schedule builder that actively flags teacher double-booking and room clashes in real-time across classes and departments.",
      tag: "Scheduling",
    },
    {
      title: "Attendance Intelligence",
      icon: CheckCircle2,
      desc: "One-click daily attendance marking (Present, Absent, Late, Leave), automatic percentage calculation, and parent notification triggers.",
      tag: "Tracking",
    },
    {
      title: "Curriculum & Teaching Logs",
      icon: BookOpen,
      desc: "Differentiating chapter-wise syllabus tracker with topic completion status, learning objectives, and teacher daily classroom logs.",
      tag: "Differentiator",
      highlight: true,
    },
    {
      title: "Examinations & Auto Reports",
      icon: Award,
      desc: "Flexible exam scheduling with automated marks entry matrices, CBSE 9-point & UGC 10-point GPA scales, and printable report cards with ranks.",
      tag: "Assessment",
    },
    {
      title: "Multi-Head Fee Engine",
      icon: CreditCard,
      desc: "Class-wise fee structures (Tuition, Admission, Transport, Lab), student ledgers, demo payment gateway, and serial-numbered printable receipts.",
      tag: "Finance",
    },
    {
      title: "Assignments & Turn-In",
      icon: FileText,
      desc: "Teachers create homework with attachments; students turn in submissions with simulated file uploads; complete grading and rubric feedback.",
      tag: "Homework",
    },
    {
      title: "Certificates & Notice Board",
      icon: Building2,
      desc: "One-click generation of Bonafide, Study, Transfer (TC), and Character certificates with official borders, serials, and printable layouts.",
      tag: "Administration",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202124] flex flex-col font-sans selection:bg-[#4667D5] selection:text-white">
      {/* Sticky Enterprise Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#202124] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#202124]">
                  EDUVANTA
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#EEF2FC] text-[#4667D5] border border-[#D6E0FA]">
                  Enterprise ERP
                </span>
              </div>
              <p className="text-[10px] text-[#6B7280] hidden sm:block">
                Complete Education Management Ecosystem
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#4B5563]">
            <a href="#institutions" className="hover:text-[#202124] transition-colors">
              Campuses
            </a>
            <a href="#modules" className="hover:text-[#202124] transition-colors">
              Modules
            </a>
            <a href="#curriculum" className="hover:text-[#202124] transition-colors">
              Teaching Logs
            </a>
            <a href="#credentials" className="hover:text-[#202124] transition-colors">
              Demo Personas
            </a>
            <a href="#security" className="hover:text-[#202124] transition-colors">
              Security
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="#credentials"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151] hover:text-[#202124] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-lg transition-colors"
            >
              <KeyIcon className="w-3.5 h-3.5 text-[#4667D5]" />
              Demo Credentials
            </a>
            <Button
              onClick={() => openAuthWithEmail("principal@greenfield.demo")}
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="shadow-sm"
            >
              Sign In to Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E8EAED] bg-radial-[at_top] from-white via-[#F7F8FA] to-[#EFF2F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Version Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8EAED] shadow-2xs text-xs font-medium text-[#374151] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#25845A] animate-pulse" />
              <span>Multi-Tenant ERP v2.4</span>
              <span className="text-[#D1D5DB]">•</span>
              <span className="text-[#4667D5] font-semibold">Production Ready Demonstration</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#202124] leading-[1.15]">
              Digitize Your Entire Educational Ecosystem
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mx-auto">
              Replace fragmented registers, paper notebooks, and spreadsheets with an interconnected,
              enterprise cloud ERP. Purpose-built for CBSE/ICSE schools, polytechnics, and autonomous colleges.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => openAuthWithEmail("principal@greenfield.demo")}
                size="lg"
                className="w-full sm:w-auto px-8 shadow-md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Sign In to Institution Portal
              </Button>
              <a
                href="#credentials"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-[#374151] bg-white border border-[#D1D5DB] hover:bg-[#F9FAFB] shadow-2xs transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#4667D5]" />
                Explore 6 Demo Personas
              </a>
            </div>

            {/* Compliance Badges */}
            <div className="mt-8 flex items-center justify-center flex-wrap gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#25845A]" />
                CBSE & ICSE Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-4 h-4 text-[#25845A]" />
                UGC Higher Ed CBCS
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Database className="w-4 h-4 text-[#4667D5]" />
                Zero Data-Bleed Tenant Isolation
              </span>
            </div>
          </div>

          {/* Key Metrics Banner */}
          <div className="mt-12 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-[#E8EAED] shadow-sm">
            <div className="text-center p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#202124]">3</p>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">Sample Campuses</p>
            </div>
            <div className="text-center p-3 border-l border-[#F3F4F6]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#4667D5]">32</p>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">Active Student Records</p>
            </div>
            <div className="text-center p-3 border-l border-[#F3F4F6]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#25845A]">100%</p>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">Conflict-Free Timetables</p>
            </div>
            <div className="text-center p-3 border-l border-[#F3F4F6]">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#202124]">14</p>
              <p className="text-xs text-[#6B7280] font-medium mt-0.5">Connected ERP Modules</p>
            </div>
          </div>

          {/* Live ERP Interactive Preview Mockup */}
          <div className="mt-12 max-w-5xl mx-auto rounded-2xl border border-[#D1D5DB] bg-white shadow-2xl overflow-hidden">
            {/* Browser Header Bar */}
            <div className="bg-[#1E2024] px-4 py-3 flex items-center justify-between text-xs text-white border-b border-[#2D3139]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <div className="ml-3 px-3 py-1 rounded bg-[#2D3139] text-[#9CA3AF] text-[11px] font-mono flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#10B981]" />
                  https://eduvanta.demo/portal/greenfield-international
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#9CA3AF] hidden sm:inline">
                  Tenant: Greenfield International School (CBSE)
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#4667D5] text-white rounded font-semibold">
                  LIVE DEMO
                </span>
              </div>
            </div>

            {/* Inner Dashboard Preview */}
            <div className="p-6 bg-[#F7F8FA]">
              {/* Preview Tabs */}
              <div className="flex items-center justify-between mb-4 border-b border-[#E8EAED] pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeTab === "overview"
                        ? "bg-[#202124] text-white"
                        : "text-[#6B7280] hover:bg-white"
                    }`}
                  >
                    Campus Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("timetable")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeTab === "timetable"
                        ? "bg-[#202124] text-white"
                        : "text-[#6B7280] hover:bg-white"
                    }`}
                  >
                    Class 8A Timetable
                  </button>
                  <button
                    onClick={() => setActiveTab("curriculum")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeTab === "curriculum"
                        ? "bg-[#202124] text-white"
                        : "text-[#6B7280] hover:bg-white"
                    }`}
                  >
                    Teaching Logs Tracker
                  </button>
                </div>

                <button
                  onClick={() => openAuthWithEmail("principal@greenfield.demo")}
                  className="text-xs font-semibold text-[#4667D5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Enter full application <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] shadow-2xs">
                      <span className="text-[11px] text-[#6B7280] font-medium">Total Enrollment</span>
                      <p className="text-xl font-bold text-[#202124] mt-0.5">32 Students</p>
                      <span className="text-[10px] text-[#25845A] font-semibold">100% Registered</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] shadow-2xs">
                      <span className="text-[11px] text-[#6B7280] font-medium">Faculty Strength</span>
                      <p className="text-xl font-bold text-[#202124] mt-0.5">10 Teachers</p>
                      <span className="text-[10px] text-[#4667D5] font-semibold">All Assigned</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] shadow-2xs">
                      <span className="text-[11px] text-[#6B7280] font-medium">Today's Attendance</span>
                      <p className="text-xl font-bold text-[#25845A] mt-0.5">94.6%</p>
                      <span className="text-[10px] text-[#6B7280]">Target &gt; 75% CBSE</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] shadow-2xs">
                      <span className="text-[11px] text-[#6B7280] font-medium">Fee Collection</span>
                      <p className="text-xl font-bold text-[#202124] mt-0.5">₹38,40,000</p>
                      <span className="text-[10px] text-[#25845A] font-semibold">₹36.3L Realized</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs">
                      <h4 className="text-xs font-bold text-[#202124] flex items-center justify-between mb-2">
                        <span>Recent Campus Announcements</span>
                        <Badge variant="primary" size="sm">Urgent</Badge>
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded bg-[#F9FAFB] border border-[#F3F4F6]">
                          <p className="font-semibold text-[#202124]">Annual Science & Robotics Exhibition 2026</p>
                          <p className="text-[11px] text-[#6B7280]">Projects must be submitted to Dr. Swaminathan by 20 Nov.</p>
                        </div>
                        <div className="p-2 rounded bg-[#F9FAFB] border border-[#F3F4F6]">
                          <p className="font-semibold text-[#202124]">Midterm Examination Schedule Published</p>
                          <p className="text-[11px] text-[#6B7280]">Admit cards downloadable via student and parent portals.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs">
                      <h4 className="text-xs font-bold text-[#202124] flex items-center justify-between mb-2">
                        <span>Live Academic Year Progress</span>
                        <span className="text-[11px] text-[#4667D5] font-semibold">2026-2027</span>
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span className="text-[#374151]">Term 1 Syllabus Completed</span>
                            <span className="text-[#202124] font-bold">78%</span>
                          </div>
                          <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div className="h-full bg-[#4667D5] rounded-full" style={{ width: "78%" }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span className="text-[#374151]">Midterm Grading Matrix Complete</span>
                            <span className="text-[#202124] font-bold">100%</span>
                          </div>
                          <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                            <div className="h-full bg-[#25845A] rounded-full" style={{ width: "100%" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Timetable */}
              {activeTab === "timetable" && (
                <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Class 8 - Section A Weekly Schedule</h4>
                      <p className="text-[11px] text-[#6B7280]">Room 103 • Class Teacher: Dr. Arvind Swaminathan</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#25845A] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded">
                      Zero Clashes Detected
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg bg-[#EEF2FC] border border-[#D6E0FA]">
                      <span className="text-[10px] text-[#4667D5] font-bold">09:00 - 09:45</span>
                      <p className="font-bold text-[#202124] mt-0.5">Mathematics</p>
                      <p className="text-[10px] text-[#6B7280]">Dr. Arvind S.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0]">
                      <span className="text-[10px] text-[#25845A] font-bold">09:45 - 10:30</span>
                      <p className="font-bold text-[#202124] mt-0.5">Science</p>
                      <p className="text-[10px] text-[#6B7280]">Mrs. K. Meenakshi</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A]">
                      <span className="text-[10px] text-[#D97706] font-bold">10:30 - 11:15</span>
                      <p className="font-bold text-[#202124] mt-0.5">English Lit</p>
                      <p className="text-[10px] text-[#6B7280]">Mr. Rajesh K.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-100 border border-gray-200">
                      <span className="text-[10px] text-gray-500 font-bold">11:15 - 11:30</span>
                      <p className="font-bold text-gray-700 mt-0.5">Morning Break</p>
                      <p className="text-[10px] text-gray-500">Recess</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE]">
                      <span className="text-[10px] text-[#7C3AED] font-bold">11:30 - 12:15</span>
                      <p className="font-bold text-[#202124] mt-0.5">Social Studies</p>
                      <p className="text-[10px] text-[#6B7280]">Dr. A. Verma</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Curriculum */}
              {activeTab === "curriculum" && (
                <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Class 8 Mathematics Syllabus & Teaching Logs</h4>
                      <p className="text-[11px] text-[#6B7280]">Assigned Faculty: Dr. Arvind Swaminathan (Employee ID: GIS-TCH-001)</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-[#4667D5] text-white rounded font-semibold">
                      Differentiator Feature
                    </span>
                  </div>

                  <div className="divide-y divide-[#F3F4F6] text-xs">
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#202124]">Chapter 1: Rational Numbers</p>
                        <p className="text-[10px] text-[#6B7280]">Properties of rational numbers, representation on number line</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#25845A] bg-[#ECFDF5] px-2 py-0.5 rounded">
                        Completed
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#202124]">Chapter 2: Linear Equations in One Variable</p>
                        <p className="text-[10px] text-[#6B7280]">Solving equations with linear expressions on one side & both sides</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#4667D5] bg-[#EEF2FC] px-2 py-0.5 rounded">
                        In Progress (85%)
                      </span>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[#202124]">Chapter 3: Understanding Quadrilaterals</p>
                        <p className="text-[10px] text-[#6B7280]">Polygons, classification, sum of angle measures</p>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        Planned: 25 Nov
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Tenant Campus Showcase */}
      <section id="institutions" className="py-16 bg-white border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#4667D5] font-bold">
              Multi-Tenant Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] mt-1">
              One Engine, Multiple Institutions
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
              EDUVANTA logically isolates data, branding, grading scales, and academic schedules
              per institution while giving the Super Admin unified governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allInstitutions.map((inst) => (
              <div
                key={inst.id}
                className="bg-[#F7F8FA] border border-[#E8EAED] hover:border-[#4667D5] rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{inst.logo}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white text-[#374151] border border-[#E8EAED]">
                      {inst.type === "school" ? "K-12 School" : "Autonomous College"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#202124]">{inst.name}</h3>
                  <p className="text-xs text-[#4667D5] font-medium mt-0.5">{inst.tagline}</p>
                  <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                    {inst.address}, {inst.city}, {inst.state} - {inst.pincode}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#E8EAED] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Affiliation Code:</span>
                      <span className="font-mono font-medium text-[#202124]">{inst.affiliationNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Grading Standard:</span>
                      <span className="font-semibold text-[#202124]">{inst.settings.gradingType} System</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Academic Year:</span>
                      <span className="font-medium text-[#202124]">{inst.academicYear}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8EAED]">
                  <Button
                    onClick={() => openAuthWithEmail(
                      inst.id === "inst-greenfield"
                        ? "principal@greenfield.demo"
                        : "admin@eduvanta.demo"
                    )}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    icon={<ExternalLink className="w-3.5 h-3.5" />}
                    iconPosition="right"
                  >
                    Launch Campus Portal
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Core ERP Modules Grid */}
      <section id="modules" className="py-16 bg-[#F7F8FA] border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#4667D5] font-bold">
              Complete Functional Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] mt-1">
              8 Enterprise Modules Built For Real Campuses
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
              Every workflow works with active dummy records. Zero static mockups. All data is
              interconnected across student records, timetables, exams, fees, and syllabus logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl bg-white border transition-all hover:shadow-md flex flex-col justify-between ${
                    m.highlight ? "border-[#4667D5] ring-1 ring-[#4667D5]" : "border-[#E8EAED]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] flex items-center justify-center text-[#4667D5]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EEF2FC] text-[#4667D5]">
                        {m.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#202124]">{m.title}</h3>
                    <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                    <span className="text-[10px] text-[#25845A] font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Fully Functional
                    </span>
                    <button
                      onClick={() => openAuthWithEmail("principal@greenfield.demo")}
                      className="text-[11px] font-semibold text-[#4667D5] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      Try <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Differentiator Spotlight: Curriculum & Daily Teaching Logs */}
      <section id="curriculum" className="py-16 bg-white border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#202124] rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-[#A5B4FC] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Key Differentiating Capability
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Curriculum Progression & Daily Classroom Teaching Logs
              </h3>
              <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
                Most school systems stop at student rosters. EDUVANTA bridges administration and academic
                delivery. Track chapter-by-chapter curriculum milestones with learning objectives, planned vs.
                actual completion dates, and daily faculty logs with homework assigned.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold text-white">Chapter-Wise Tracking</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Not Started, In Progress, Completed status</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="font-semibold text-white">Daily Faculty Logbook</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">Date, class, period, topics covered & homework</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => openAuthWithEmail("teacher@greenfield.demo")}
                  size="md"
                  className="bg-white text-[#202124] hover:bg-gray-100"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Log In As Teacher to Try Logbook
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="text-[11px] text-[#A5B4FC] uppercase tracking-wider font-sans font-bold flex items-center justify-between">
                <span>Today's Verified Log Entry</span>
                <span className="text-[#34D399]">VERIFIED</span>
              </div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1.5 text-[11px]">
                <p><span className="text-gray-400">Class:</span> Class 8A</p>
                <p><span className="text-gray-400">Subject:</span> Mathematics (Dr. Arvind Swaminathan)</p>
                <p><span className="text-gray-400">Chapter:</span> Linear Equations in One Variable</p>
                <p><span className="text-gray-400">Topics:</span> Solving equations with variables on both sides</p>
                <p><span className="text-gray-400">Homework:</span> Exercise 2.3 Questions 1 to 8</p>
              </div>
              <p className="text-[10px] text-gray-400 font-sans">
                Automatically visible to class parents, coordinators, and students upon submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Personas & Auth Section */}
      <section id="credentials" className="py-16 bg-[#F7F8FA] border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#4667D5] font-bold">
              Instant Live Evaluation
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] mt-1">
              Select A Demo Persona To Sign In
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
              Authentication is required to enter any campus portal. Choose any of the 6 roles below
              to test their dedicated user experience, permissions, and dashboards.
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Standard Demo Password for all accounts: <strong className="font-mono">Demo@123</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoPersonas.map((persona) => (
              <div
                key={persona.email}
                className="bg-white border border-[#E8EAED] hover:border-[#4667D5] rounded-2xl p-5 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#E8EAED]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#202124]">{persona.name}</h4>
                        <span className="text-[10px] font-semibold text-[#4667D5] uppercase tracking-wider">
                          {persona.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl shrink-0">{persona.icon}</span>
                  </div>

                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {persona.desc}
                  </p>

                  <div className="mt-3 pt-3 border-t border-[#F3F4F6] space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-[#F7F8FA] border border-[#E8EAED] font-mono text-[11px] space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Email:</span>
                        <span className="text-[#202124] font-semibold">{persona.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B7280]">Password:</span>
                        <span className="text-[#25845A] font-semibold">Demo@123</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {persona.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8EAED]">
                  <Button
                    onClick={() => openAuthWithEmail(persona.email)}
                    size="sm"
                    className="w-full text-xs"
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    iconPosition="right"
                  >
                    Sign In As {persona.name.split(" ")[0]}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Enterprise Architecture */}
      <section id="security" className="py-16 bg-white border-b border-[#E8EAED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider text-[#4667D5] font-bold">
              Enterprise Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] mt-1">
              Built For Mission-Critical School Operations
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
              Institutions manage confidential student records, medical notes, exam rankings, and financial ledgers.
              EDUVANTA is designed with zero-bleed multi-tenancy and granular RBAC.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E8EAED]">
              <ShieldCheck className="w-6 h-6 text-[#25845A] mb-3" />
              <h4 className="text-sm font-bold text-[#202124]">Logical Tenant Isolation</h4>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Greenfield International, Bright Future, and Horizon College records remain completely isolated.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E8EAED]">
              <Lock className="w-6 h-6 text-[#4667D5] mb-3" />
              <h4 className="text-sm font-bold text-[#202124]">Granular RBAC Access</h4>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Students and parents are restricted to their own ward's attendance, assignments, and report cards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E8EAED]">
              <Database className="w-6 h-6 text-[#D97706] mb-3" />
              <h4 className="text-sm font-bold text-[#202124]">Local Browser Persistence</h4>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Every action you take in the live demo persists automatically to localStorage for smooth multi-page testing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#E8EAED]">
              <Award className="w-6 h-6 text-[#7C3AED] mb-3" />
              <h4 className="text-sm font-bold text-[#202124]">Official Document Serials</h4>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                Bonafide certificates, transfer certificates, and fee receipts generate sequential verification codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#E8EAED]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#202124] text-white flex items-center justify-center font-bold text-base">
                E
              </div>
              <div>
                <span className="font-bold text-base text-[#202124]">EDUVANTA</span>
                <p className="text-[11px] text-[#6B7280]">
                  Next-Generation Multi-Tenant Education Management ERP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => openAuthWithEmail("principal@greenfield.demo")}
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Sign In to Portal
              </Button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] gap-4">
            <p>© 2026 EDUVANTA ERP Ecosystem. Built for live evaluations and product demonstrations.</p>
            <div className="flex items-center gap-4">
              <span>Next.js 16 App Router</span>
              <span>•</span>
              <span>React 19 & TypeScript</span>
              <span>•</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialEmail={authEmail}
      />
    </div>
  );
};

function KeyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx={7.5} cy={15.5} r={5.5} />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );
}
