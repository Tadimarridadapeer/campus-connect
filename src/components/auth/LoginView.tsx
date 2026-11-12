"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export const LoginView: React.FC = () => {
  const { login } = useEdu();
  const [email, setEmail] = useState("principal@greenfield.demo");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts: {
    role: UserRole;
    name: string;
    email: string;
    desc: string;
    icon: string;
  }[] = [
    {
      role: "super_admin",
      name: "Dr. Vikramaditya Rao",
      email: "admin@eduvanta.demo",
      desc: "Multi-institution oversight, tenant isolation & global stats",
      icon: "⚡",
    },
    {
      role: "principal",
      name: "Mrs. Sunita Venkatraman",
      email: "principal@greenfield.demo",
      desc: "Full school operations, admissions, staffing, financials",
      icon: "🏫",
    },
    {
      role: "coordinator",
      name: "Mr. Ramesh Kulkarni",
      email: "coordinator@greenfield.demo",
      desc: "Curriculum oversight, timetables, exam scheduling",
      icon: "📋",
    },
    {
      role: "teacher",
      name: "Dr. Arvind Swaminathan",
      email: "teacher@greenfield.demo",
      desc: "Attendance marking, daily logs, grading, assignments",
      icon: "👨‍🏫",
    },
    {
      role: "student",
      name: "Aarav Sharma (Class 8A)",
      email: "student@greenfield.demo",
      desc: "Student dashboard, timetable, submissions, report cards",
      icon: "🎒",
    },
    {
      role: "parent",
      name: "Mr. Rajesh Sharma",
      email: "parent@greenfield.demo",
      desc: "Ward attendance, progress tracking, fee dues & payments",
      icon: "👨‍👧‍👦",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const success = login(email);
      if (!success) {
        setError("Invalid email address. Please use one of the demo accounts.");
      }
      setLoading(false);
    }, 300);
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo@123");
    login(demoEmail);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#202124] text-white font-bold text-xl mb-3 shadow-md">
          E
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#202124]">
          EDUVANTA
        </h2>
        <p className="text-xs text-[#6B7280] mt-1 font-medium">
          Next-Generation Multi-Tenant Education Management ERP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-[#E8EAED] grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Login Form */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h3 className="text-base font-semibold text-[#202124]">
                  Sign in to your portal
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Enter credentials or pick a demo persona
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#B91C1C]">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] focus:ring-1 focus:ring-[#4667D5] outline-hidden"
                      placeholder="name@school.demo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] focus:ring-1 focus:ring-[#4667D5] outline-hidden"
                      placeholder="Demo@123"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#25845A]" />
                    Demo password: Demo@123
                  </span>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Enter Portal
                </Button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F3F4F6] text-[11px] text-[#6B7280]">
              <span className="font-semibold text-[#202124]">Live Demo Environment</span>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">
                All changes persist to local browser storage during your evaluation.
              </p>
            </div>
          </div>

          {/* Right: Quick Demo Persona Selector */}
          <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-[#E8EAED] md:pl-8 pt-6 md:pt-0">
            <h4 className="text-xs font-semibold text-[#202124] uppercase tracking-wider mb-2.5">
              1-Click Demo Personas
            </h4>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => handleQuickLogin(acc.email)}
                  className="w-full text-left p-2.5 rounded-lg border border-[#E8EAED] hover:border-[#4667D5] hover:bg-[#EEF2FC]/40 transition-all group flex items-start gap-2.5 cursor-pointer"
                >
                  <span className="text-xl shrink-0 mt-0.5">{acc.icon}</span>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#202124] group-hover:text-[#4667D5]">
                        {acc.name}
                      </span>
                      <span className="text-[10px] font-semibold text-[#6B7280] uppercase">
                        {acc.role.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4667D5] font-mono mt-0.5">
                      {acc.email}
                    </p>
                    <p className="text-[10px] text-[#6B7280] line-clamp-1 mt-0.5">
                      {acc.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
