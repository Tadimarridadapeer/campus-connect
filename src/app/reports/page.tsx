"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  BarChart3,
  Download,
  Filter,
  Users,
  Award,
  CreditCard,
  BookOpen,
  Calendar,
  Printer,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function ReportsPage() {
  const {
    students,
    teachers,
    classes,
    studentFees,
    examResults,
    curriculum,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [reportType, setReportType] = useState<"enrollment" | "finance" | "academics" | "curriculum">("enrollment");

  // Gender Breakdown
  const maleCount = students.filter((s) => s.gender === "Male").length;
  const femaleCount = students.filter((s) => s.gender === "Female").length;
  const otherCount = students.filter((s) => s.gender === "Other").length;

  const genderPieData = [
    { name: "Boys", value: maleCount, color: "#4667D5" },
    { name: "Girls", value: femaleCount, color: "#25845A" },
    { name: "Other", value: otherCount, color: "#D69B36" },
  ].filter((d) => d.value > 0);

  // Class Enrollment Breakdown
  const classEnrollmentData = classes.map((c) => ({
    className: c.name,
    count: students.filter((s) => s.classId === c.id).length,
  }));

  // Fee Status Breakdown
  const feeStatusData = [
    { name: "Fully Paid", value: studentFees.filter((f) => f.status === "paid").length, color: "#25845A" },
    { name: "Partial Paid", value: studentFees.filter((f) => f.status === "partial").length, color: "#4667D5" },
    { name: "Overdue Dues", value: studentFees.filter((f) => f.status === "overdue").length, color: "#D94B4B" },
    { name: "Pending", value: studentFees.filter((f) => f.status === "pending").length, color: "#D69B36" },
  ];

  // Academic Grade Breakdown
  const gradesCount: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, D: 0, E: 0 };
  examResults.forEach((r) => {
    if (gradesCount[r.grade] !== undefined) gradesCount[r.grade]++;
  });

  const academicGradeData = Object.entries(gradesCount).map(([grade, count]) => ({
    grade,
    students: count,
  }));

  // Export Comprehensive CSV
  const handleExportReportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (reportType === "enrollment") {
      headers = ["Class", "Enrolled Students", "Percentage of Total"];
      rows = classEnrollmentData.map((d) => [
        d.className,
        d.count,
        `${((d.count / (students.length || 1)) * 100).toFixed(1)}%`,
      ]);
    } else if (reportType === "finance") {
      headers = ["Student Name", "Admission No", "Class", "Total Fee", "Paid", "Due", "Status"];
      rows = studentFees.map((f) => [
        `"${f.studentName}"`,
        f.admissionNo,
        f.className,
        f.totalFee,
        f.paidAmount,
        f.dueAmount,
        f.status,
      ]);
    } else {
      headers = ["Student Name", "Roll", "Marks Scored", "Max Marks", "Percentage", "Grade", "Status"];
      rows = examResults.map((r) => [
        `"${r.studentName}"`,
        r.rollNo,
        r.marksObtained,
        r.maxMarks,
        r.percentage,
        r.grade,
        r.status,
      ]);
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EDUVANTA_${reportType.toUpperCase()}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("Report Exported", {
      type: "success",
      message: `Downloaded ${reportType.toUpperCase()} analytics report as CSV.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Institutional Reports &amp; Intelligence Analytics
            </h1>
            <Badge variant="primary" size="sm">
              Live Aggregate
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Data insights on enrollment trends, financial collections, curriculum pace, and student results
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Analytics
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportReportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1 overflow-x-auto">
        {(
          [
            { id: "enrollment", label: "Student Enrollment", icon: Users },
            { id: "finance", label: "Fee Collections", icon: CreditCard },
            { id: "academics", label: "Academic Exam Grades", icon: Award },
            { id: "curriculum", label: "Curriculum Pace", icon: BookOpen },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                reportType === tab.id
                  ? "bg-[#202124] text-white"
                  : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Report Content Panels */}
      {reportType === "enrollment" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
            <h3 className="text-sm font-bold text-[#202124] mb-1">
              Class Enrollment Distribution
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Total enrolled count across each grade
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                  <XAxis dataKey="className" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="count" fill="#4667D5" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
            <h3 className="text-sm font-bold text-[#202124] mb-1">
              Gender Demographics
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Gender diversity breakdown across all classes
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {genderPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {reportType === "finance" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
            <h3 className="text-sm font-bold text-[#202124] mb-1">
              Student Fee Status Breakdown
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Count of students by payment standing
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="value" fill="#25845A" radius={[4, 4, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#202124]">
              Executive Financial Metrics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
                <span className="text-[#1E714C] block text-[10px] uppercase font-bold">Total Collected Revenue</span>
                <p className="text-xl font-bold text-[#1E714C]">
                  {formatCurrency(studentFees.reduce((a, b) => a + b.paidAmount, 0))}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                <span className="text-[#B91C1C] block text-[10px] uppercase font-bold">Outstanding Receivables</span>
                <p className="text-xl font-bold text-[#B91C1C]">
                  {formatCurrency(studentFees.reduce((a, b) => a + b.dueAmount, 0))}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#EEF2FC] border border-[#D6E0FA]">
                <span className="text-[#1E3A8A] block text-[10px] uppercase font-bold">Scholarship Waivers Granted</span>
                <p className="text-xl font-bold text-[#1E3A8A]">
                  {formatCurrency(studentFees.reduce((a, b) => a + b.discountAmount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === "academics" && (
        <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <h3 className="text-sm font-bold text-[#202124] mb-1">
            Grade Frequency Distribution (Mid-Term Exams)
          </h3>
          <p className="text-xs text-[#6B7280] mb-4">
            Overall CBSE grade distribution across Class 8 examinations
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicGradeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="students" fill="#4667D5" radius={[4, 4, 0, 0]} name="Score Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {reportType === "curriculum" && (
        <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#202124]">
            Curriculum Pace by Subject
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-[#202124]">Class 8 Mathematics (CBSE)</span>
                <span className="text-[#25845A] font-bold">2 of 4 Chapters (50% on track)</span>
              </div>
              <div className="w-full h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-[#4667D5] rounded-full w-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-[#202124]">Class 8 Science (CBSE)</span>
                <span className="text-[#25845A] font-bold">2 of 3 Chapters (67% on track)</span>
              </div>
              <div className="w-full h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-[#25845A] rounded-full w-2/3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
