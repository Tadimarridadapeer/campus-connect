"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { UserRole } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, KeyRound, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialEmail?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole,
  initialEmail,
}) => {
  const { login } = useEdu();
  const [email, setEmail] = useState(initialEmail || "principal@greenfield.demo");
  const [password, setPassword] = useState("Demo@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoSelector, setShowDemoSelector] = useState(false);

  // Sync initial props when opened
  React.useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setPassword("Demo@123");
      setError("");
    }
  }, [initialEmail, isOpen]);

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
      desc: "Super Admin — Multi-campus governance & institution switcher",
      icon: "⚡",
    },
    {
      role: "principal",
      name: "Mrs. Sunita Venkatraman",
      email: "principal@greenfield.demo",
      desc: "Principal — School administration, admissions & financials",
      icon: "🏫",
    },
    {
      role: "coordinator",
      name: "Mr. Ramesh Kulkarni",
      email: "coordinator@greenfield.demo",
      desc: "Coordinator — Academic syllabus, exam schedules & timetable",
      icon: "📋",
    },
    {
      role: "teacher",
      name: "Dr. Arvind Swaminathan",
      email: "teacher@greenfield.demo",
      desc: "Faculty — Attendance marking, daily logs, grading & homework",
      icon: "👨‍🏫",
    },
    {
      role: "student",
      name: "Aarav Sharma",
      email: "student@greenfield.demo",
      desc: "Student — Timetable, homework submission & report cards",
      icon: "🎒",
    },
    {
      role: "parent",
      name: "Mr. Rajesh Sharma",
      email: "parent@greenfield.demo",
      desc: "Parent — Ward attendance, online fee payments & reports",
      icon: "👨‍👧‍👦",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Authentication failed. Please verify credentials.");
      }
    }, 250);
  };

  const handleSelectDemo = (accEmail: string) => {
    setEmail(accEmail);
    setPassword("Demo@123");
    setError("");
    setShowDemoSelector(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to EDUVANTA Portal"
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-[#F7F8FA] border border-[#E8EAED] rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[#202124] text-white flex items-center justify-center font-bold text-base shrink-0">
            E
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[#202124] truncate">
              Institutional ERP Access
            </h4>
            <p className="text-[11px] text-[#6B7280]">
              Sign in with institutional credentials or choose a demo persona
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#B91C1C] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] focus:ring-1 focus:ring-[#4667D5] outline-hidden text-[#202124]"
                placeholder="user@institution.demo"
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
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] focus:ring-1 focus:ring-[#4667D5] outline-hidden text-[#202124]"
                placeholder="Demo@123"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#6B7280] mt-1.5">
              <span className="flex items-center gap-1 text-[#25845A]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Demo password: <strong className="font-mono">Demo@123</strong>
              </span>
            </div>
          </div>

          {/* Quick Demo Selector Toggle */}
          <div className="border border-[#E8EAED] rounded-lg p-2.5 bg-[#FAFAFA]">
            <button
              type="button"
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="w-full flex items-center justify-between text-xs font-medium text-[#4667D5] hover:underline cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                {showDemoSelector ? "Hide quick demo accounts" : "Need demo credentials? Click here to pick"}
              </span>
              <span className="text-[10px] bg-white border border-[#D6E0FA] px-1.5 py-0.5 rounded text-[#4667D5]">
                {demoAccounts.length} Personas
              </span>
            </button>

            {showDemoSelector && (
              <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectDemo(acc.email)}
                    className={`w-full text-left p-2 rounded-md border text-xs flex items-center justify-between transition-colors ${
                      email.toLowerCase() === acc.email.toLowerCase()
                        ? "border-[#4667D5] bg-[#EEF2FC]/70 text-[#202124]"
                        : "border-[#E8EAED] hover:bg-white text-[#374151]"
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-base shrink-0">{acc.icon}</span>
                      <div className="overflow-hidden">
                        <p className="font-semibold truncate">{acc.name}</p>
                        <p className="text-[10px] text-[#6B7280] font-mono truncate">{acc.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-[#374151] uppercase shrink-0 font-medium ml-2">
                      {acc.role.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Authenticate & Open Portal
          </Button>
        </form>

        <p className="text-[10px] text-center text-[#9CA3AF] pt-1">
          EDUVANTA Education Management ERP • Role-based access control enabled
        </p>
      </div>
    </Modal>
  );
};
