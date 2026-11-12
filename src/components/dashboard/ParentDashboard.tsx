"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  Baby,
  CheckCircle,
  CreditCard,
  Award,
  BookOpen,
  ClipboardList,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export const ParentDashboard: React.FC = () => {
  const {
    currentUser,
    parents,
    students,
    selectedChildId,
    setSelectedChildId,
    attendance,
    examResults,
    dailyLogs,
    studentFees,
    recordFeePayment,
    teachers,
  } = useEdu();
  const { toast } = useToast();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(20000);
  const [payMethod, setPayMethod] = useState<"UPI" | "Net Banking" | "Debit Card">("UPI");
  const [payProcessing, setPayProcessing] = useState(false);
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);

  // Current Parent Profile
  const parent =
    parents.find((p) => p.id === currentUser?.parentId) || parents[0];

  // Linked children
  const linkedChildren = students.filter((s) => parent.childrenIds.includes(s.id));

  // Active child
  const child =
    students.find((s) => s.id === selectedChildId) || linkedChildren[0] || students[0];

  // Child fee record
  const feeRecord = studentFees.find((f) => f.studentId === child.id);

  // Child attendance
  const childAttendance = attendance.filter((a) => a.studentId === child.id);
  const totalDays = childAttendance.length;
  const presentDays = childAttendance.filter(
    (a) => a.status === "present" || a.status === "late"
  ).length;
  const attendanceRate = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : "94.2";

  // Child exam results
  const childResults = examResults.filter((r) => r.studentId === child.id);

  // Today's lessons for child's class
  const childLessons = dailyLogs.filter(
    (l) => l.classId === child.classId && l.sectionId === child.sectionId
  );

  // Class teacher
  const classTeacher =
    teachers.find(
      (t) =>
        t.isClassTeacherOf?.classId === child.classId &&
        t.isClassTeacherOf?.sectionId === child.sectionId
    ) || teachers[0];

  // Handle Demo Payment
  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    setPayProcessing(true);

    setTimeout(() => {
      const receiptNo = recordFeePayment(
        child.id,
        payAmount,
        payMethod,
        "School Fee Installment",
        "Paid via Parent Portal Demo Simulation"
      );
      setPayProcessing(false);
      setPaymentModalOpen(false);
      toast("Payment Successful!", {
        type: "success",
        message: `₹${payAmount.toLocaleString("en-IN")} received. Official Receipt #${receiptNo} generated.`,
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Multi-Child Switcher Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#6B7280] font-medium">
            Parent Portal • {parent.name}
          </span>
          <h1 className="text-xl font-bold text-[#202124] tracking-tight mt-0.5">
            Ward Progress &amp; School Activity
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Tracking {linkedChildren.length} registered child(ren) at Greenfield
          </p>
        </div>

        {/* Child Selector Tabs */}
        {linkedChildren.length > 1 && (
          <div className="flex items-center gap-2 p-1 bg-[#F7F8FA] rounded-xl border border-[#E8EAED]">
            {linkedChildren.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  c.id === child.id
                    ? "bg-white text-[#202124] shadow-xs border border-[#E8EAED]"
                    : "text-[#6B7280] hover:text-[#202124]"
                }`}
              >
                <img
                  src={c.avatar}
                  alt={c.fullName}
                  className="w-6 h-6 rounded-full object-cover border border-[#E8EAED]"
                />
                <div className="text-left">
                  <span className="block leading-tight">{c.fullName}</span>
                  <span className="text-[10px] text-[#6B7280] font-normal block leading-tight">
                    {c.className}-{c.sectionName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Child Info & Quick Contact Card */}
      <div className="bg-gradient-to-r from-[#202124] to-[#2D3748] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={child.avatar}
            alt={child.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{child.fullName}</h2>
              <Badge variant="primary" size="sm" className="bg-white/10 text-white border-white/20">
                {child.className} - Section {child.sectionName}
              </Badge>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Admission No: {child.admissionNo} • Roll #{child.rollNo} • Blood Group: {child.bloodGroup}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Class Teacher: {classTeacher.name} ({classTeacher.phone})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={() => setTeacherModalOpen(true)}
            icon={<Phone className="w-3.5 h-3.5" />}
          >
            Contact Teacher
          </Button>

          {feeRecord && feeRecord.dueAmount > 0 && (
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                setPayAmount(feeRecord.dueAmount);
                setPaymentModalOpen(true);
              }}
              icon={<CreditCard className="w-3.5 h-3.5" />}
            >
              Pay Dues (₹{feeRecord.dueAmount.toLocaleString("en-IN")})
            </Button>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Overall Attendance
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#25845A] flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">
              {attendanceRate}%
            </span>
            <Badge variant="success" size="sm">
              Regular
            </Badge>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Present in school today
          </p>
        </div>

        {/* Mid-term performance */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Academic Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FC] text-[#4667D5] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">91.8%</span>
            <Badge variant="primary" size="sm">
              Grade A1
            </Badge>
          </div>
          <p className="text-[11px] text-[#25845A] font-medium mt-1">
            Excellent academic standing
          </p>
        </div>

        {/* Homework Tracking */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Homework Assigned
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D69B36] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">
              {childLessons.filter((l) => !!l.homeworkAssigned).length}
            </span>
            <span className="text-xs text-[#6B7280]">tasks today</span>
          </div>
          <p className="text-[11px] text-[#4667D5] font-medium mt-1">
            Math Ex 2.3 &amp; Science
          </p>
        </div>

        {/* Fee Due */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Pending Fee Due
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FDF2F2] text-[#D94B4B] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#202124]">
              ₹{feeRecord?.dueAmount.toLocaleString("en-IN") || 0}
            </span>
            <Badge
              variant={feeRecord?.dueAmount === 0 ? "success" : "warning"}
              size="sm"
            >
              {feeRecord?.dueAmount === 0 ? "CLEAR" : "DUE"}
            </Badge>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Due by {feeRecord?.dueDate || "15/12/2026"}
          </p>
        </div>
      </div>

      {/* Grid: What Was Taught Today & Examination Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Classroom Teaching Log (Parent Transparency Feature) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Today&apos;s Classroom Lessons Taught
              </h3>
              <p className="text-xs text-[#6B7280]">
                Official daily lesson logs and assigned homework for {child.className}
              </p>
            </div>
            <a
              href="/curriculum"
              className="text-xs text-[#4667D5] font-semibold hover:underline flex items-center gap-1"
            >
              Curriculum Tracker <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {childLessons.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] py-6 text-center">
                No teaching logs recorded yet today.
              </p>
            ) : (
              childLessons.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-lg border border-[#E8EAED] bg-[#FAFAFA] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#202124]">
                      {l.subjectName}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      Faculty: {l.teacherName}
                    </span>
                  </div>
                  <p className="text-xs text-[#374151]">
                    <span className="font-semibold text-[#4B5563]">Topic Covered: </span>
                    {l.topicsCovered}
                  </p>
                  {l.homeworkAssigned && (
                    <div className="mt-1 p-2 rounded-md bg-[#EEF2FC] border border-[#D6E0FA] text-[#1E3A8A] text-xs">
                      <span className="font-bold">📝 Homework Assigned: </span>
                      {l.homeworkAssigned}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Marks Summary & Receipts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Exam Marks Card */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-[#202124]">
                Mid-Term Exam Results
              </h3>
              <a
                href="/examinations"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                View Full Card
              </a>
            </div>

            <div className="space-y-2.5">
              {childResults.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-[#202124]">
                      {r.examId.includes("mth")
                        ? "Mathematics"
                        : r.examId.includes("sci")
                        ? "Science"
                        : r.examId.includes("eng")
                        ? "English"
                        : "Social Studies"}
                    </p>
                    <span className="text-[10px] text-[#6B7280]">
                      Marks: {r.marksObtained}/{r.maxMarks} ({r.percentage}%)
                    </span>
                  </div>
                  <Badge variant="primary" size="sm">
                    Grade {r.grade}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Payment & Receipts Card */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#202124]">
                Recent Fee Receipts
              </h3>
              <a
                href="/fees"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                Fee Ledger
              </a>
            </div>

            <div className="space-y-2">
              {feeRecord?.transactions.slice(0, 2).map((tx) => (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-lg border border-[#E8EAED] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-[#202124]">
                      {tx.receiptNo}
                    </p>
                    <p className="text-[10px] text-[#6B7280]">
                      {tx.feeHead} • {formatDate(tx.paymentDate)}
                    </p>
                  </div>
                  <span className="font-bold text-[#25845A]">
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Simulate Instant Fee Payment (Demo)"
        description={`Paying for ${child.fullName} (${child.className} - ${child.sectionName})`}
        size="md"
      >
        <form onSubmit={handleSimulatePayment} className="space-y-4">
          <div className="p-3 bg-[#EEF2FC] rounded-lg border border-[#D6E0FA] text-xs text-[#1E3A8A]">
            <span className="font-semibold block">Demo Simulation Notice:</span>
            No real credit card or bank debit will occur. This updates the live ledger dataset instantly.
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Payment Amount (INR)
            </label>
            <input
              type="number"
              required
              min={100}
              max={feeRecord?.dueAmount || 50000}
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] outline-hidden font-mono text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Simulated Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["UPI", "Net Banking", "Debit Card"] as const).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    payMethod === m
                      ? "bg-[#202124] text-white border-transparent"
                      : "bg-white text-[#374151] border-[#E8EAED] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              size="sm"
              loading={payProcessing}
            >
              Confirm &amp; Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Teacher Contact Modal */}
      <Modal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        title="Class Teacher Contact Details"
        size="sm"
        footer={
          <Button variant="outline" size="sm" onClick={() => setTeacherModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={classTeacher.avatar}
              alt={classTeacher.name}
              className="w-12 h-12 rounded-full object-cover border border-[#E8EAED]"
            />
            <div>
              <p className="font-bold text-sm text-[#202124]">{classTeacher.name}</p>
              <p className="text-[#6B7280]">{classTeacher.designation}</p>
              <Badge variant="primary" size="sm" className="mt-1">
                Class Teacher of {child.className}-{child.sectionName}
              </Badge>
            </div>
          </div>

          <div className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E8EAED] space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="font-semibold text-[#202124]">{classTeacher.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-[#202124]">{classTeacher.email}</span>
            </div>
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Official visiting hours: Mon-Fri 03:30 PM to 04:30 PM (Prior appointment via school desk recommended).
          </p>
        </div>
      </Modal>
    </div>
  );
};
