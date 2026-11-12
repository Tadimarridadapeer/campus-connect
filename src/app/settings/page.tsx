"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Settings,
  Building2,
  Sliders,
  Shield,
  Palette,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const {
    currentInstitution,
    updateInstitutionSettings,
    resetAllData,
  } = useEdu();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"general" | "branding" | "academic" | "security">("general");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Form State
  const [name, setName] = useState(currentInstitution.name);
  const [code, setCode] = useState(currentInstitution.code);
  const [tagline, setTagline] = useState(currentInstitution.tagline);
  const [address, setAddress] = useState(currentInstitution.address);
  const [city, setCity] = useState(currentInstitution.city);
  const [state, setState] = useState(currentInstitution.state);
  const [phone, setPhone] = useState(currentInstitution.phone);
  const [email, setEmail] = useState(currentInstitution.email);
  const [affiliationNo, setAffiliationNo] = useState(currentInstitution.affiliationNo || "");
  const [academicYear, setAcademicYear] = useState(currentInstitution.academicYear);
  const [attendanceThreshold, setAttendanceThreshold] = useState(currentInstitution.settings.attendanceThreshold);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitutionSettings({
      name,
      code,
      tagline,
      address,
      city,
      state,
      phone,
      email,
      affiliationNo,
      academicYear,
      settings: {
        ...currentInstitution.settings,
        attendanceThreshold,
      },
    });

    toast("Institution Settings Saved", {
      type: "success",
      message: "Branding and institutional details updated successfully.",
    });
  };

  const handleConfirmReset = () => {
    resetAllData();
    setResetConfirmOpen(false);
    toast("Demo Data Reset Complete", {
      type: "info",
      message: "Initial dataset restored. All demo credentials and mock rosters are refreshed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Institution Customization &amp; Ecosystem Settings
            </h1>
            <Badge variant="primary" size="sm">
              Tenant ID: {currentInstitution.id}
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            White-label branding, academic session configuration, and administrative preferences
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setResetConfirmOpen(true)}
          icon={<RotateCcw className="w-3.5 h-3.5 text-[#D94B4B]" />}
          className="text-[#D94B4B] hover:bg-[#FEF2F2]"
        >
          Reset Demo Data
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "general"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Institution Profile
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "branding"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Palette className="w-4 h-4" />
          Branding &amp; Logos
        </button>

        <button
          onClick={() => setActiveTab("academic")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "academic"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Academic Parameters
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Shield className="w-4 h-4" />
          Role Permissions Matrix
        </button>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-xl border border-[#E8EAED] shadow-2xs space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Short Code / Acronym *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Tagline / Motto
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Official Phone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Official Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Affiliation Number
              </label>
              <input
                type="text"
                value={affiliationNo}
                onChange={(e) => setAffiliationNo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Campus Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8EAED] flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              Save Institution Profile
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Branding & Logos */}
      {activeTab === "branding" && (
        <div className="bg-white p-6 rounded-xl border border-[#E8EAED] shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-[#202124]">
            White-Label Visual Identity
          </h3>
          <p className="text-xs text-[#6B7280]">
            Customize primary institutional emblems, color themes, and document headers
          </p>

          <div className="flex items-center gap-4 p-4 bg-[#F7F8FA] rounded-xl border border-[#E8EAED]">
            <span className="text-4xl p-2 bg-white rounded-lg shadow-xs">{currentInstitution.logo}</span>
            <div>
              <p className="font-bold text-xs text-[#202124]">Emblem Symbol: {currentInstitution.logo}</p>
              <p className="text-[11px] text-[#6B7280]">Active logo rendered across printable certificates &amp; receipts</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#374151]">
              Primary Brand Accent Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-[#E8EAED]"
                style={{ backgroundColor: currentInstitution.settings.primaryColor }}
              />
              <span className="font-mono text-xs font-bold text-[#202124]">
                {currentInstitution.settings.primaryColor}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Academic Parameters */}
      {activeTab === "academic" && (
        <div className="bg-white p-6 rounded-xl border border-[#E8EAED] shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-[#202124]">
            Academic Operating Rules
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#374151] mb-1">
                Active Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-1.5 border border-[#E8EAED] rounded-lg font-mono font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#374151] mb-1">
                Minimum Board Attendance Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={95}
                value={attendanceThreshold}
                onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-[#E8EAED] rounded-lg font-mono font-semibold"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E8EAED] flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                updateInstitutionSettings({
                  academicYear,
                  settings: {
                    ...currentInstitution.settings,
                    attendanceThreshold,
                  },
                });
                toast("Academic Settings Updated", { type: "success" });
              }}
            >
              Update Parameters
            </Button>
          </div>
        </div>
      )}

      {/* Tab 4: Security & Permissions Matrix */}
      {activeTab === "security" && (
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E8EAED]">
            <h3 className="text-sm font-bold text-[#202124]">
              Role-Based Access Control (RBAC) Matrix
            </h3>
            <p className="text-xs text-[#6B7280]">
              Institutional boundary enforcement across roles
            </p>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                <tr>
                  <th className="py-2.5 px-4">Capability / Module</th>
                  <th className="py-2.5 px-3 text-center">Super Admin</th>
                  <th className="py-2.5 px-3 text-center">Principal</th>
                  <th className="py-2.5 px-3 text-center">Teacher</th>
                  <th className="py-2.5 px-3 text-center">Student</th>
                  <th className="py-2.5 px-3 text-center">Parent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {[
                  { name: "Tenant Switcher & Global Config", sa: true, pr: false, tc: false, st: false, pt: false },
                  { name: "Student Admissions & Records CRUD", sa: true, pr: true, tc: false, st: false, pt: false },
                  { name: "Faculty Staffing & Recruitment", sa: true, pr: true, tc: false, st: false, pt: false },
                  { name: "Daily Attendance Marking", sa: true, pr: true, tc: true, st: false, pt: false },
                  { name: "Marks Entry & Grade Tabulation", sa: true, pr: true, tc: true, st: false, pt: false },
                  { name: "Curriculum Tracking & Daily Logs", sa: true, pr: true, tc: true, st: true, pt: true },
                  { name: "Fee Payments & Ledger Management", sa: true, pr: true, tc: false, st: true, pt: true },
                  { name: "Certificate Issuance", sa: true, pr: true, tc: false, st: false, pt: false },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FDFDFE]">
                    <td className="py-2.5 px-4 font-semibold text-[#202124]">{row.name}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{row.sa ? "✅" : "—"}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{row.pr ? "✅" : "—"}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{row.tc ? "✅" : "—"}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{row.st ? "✅" : "—"}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{row.pt ? "✅" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Mock Data to Default Seed?"
        message="This will restore all demo institutions, students, teachers, fees, exam marks, and curriculum logs to their pristine initial demo seed. Any changes made in this session will be reverted."
        confirmText="Confirm Reset"
        variant="danger"
      />
    </div>
  );
}
