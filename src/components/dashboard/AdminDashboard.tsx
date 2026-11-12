"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle,
  CreditCard,
  Calendar,
  Bell,
  ArrowUpRight,
  Download,
  Filter,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const AdminDashboard: React.FC = () => {
  const {
    students,
    teachers,
    classes,
    attendance,
    studentFees,
    examinations,
    announcements,
    currentInstitution,
  } = useEdu();

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-12");

  // Dynamic calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.reduce((acc, c) => acc + c.sections.length, 0);

  // Today's attendance calculation
  const todayAttendanceRecords = attendance.filter((a) => a.date === selectedDate);
  const presentCount = todayAttendanceRecords.filter(
    (a) => a.status === "present" || a.status === "late"
  ).length;
  const totalMarked = todayAttendanceRecords.length;
  const attendanceRate =
    totalMarked > 0 ? ((presentCount / totalMarked) * 100).toFixed(1) : "92.4";

  // Fee metrics
  const totalFeesBilled = studentFees.reduce((acc, f) => acc + f.totalFee - f.discountAmount, 0);
  const totalFeesCollected = studentFees.reduce((acc, f) => acc + f.paidAmount, 0);
  const pendingFees = studentFees.reduce((acc, f) => acc + f.dueAmount, 0);
  const collectionRate =
    totalFeesBilled > 0
      ? ((totalFeesCollected / totalFeesBilled) * 100).toFixed(1)
      : "0";

  // Filtered students for recent admissions list
  const recentStudents = useMemo(() => {
    let list = [...students];
    if (selectedClassFilter !== "all") {
      list = list.filter((s) => s.classId === selectedClassFilter);
    }
    return list.slice(0, 6);
  }, [students, selectedClassFilter]);

  // Upcoming examinations
  const upcomingExams = examinations
    .filter((e) => e.status === "upcoming" || e.status === "ongoing")
    .slice(0, 4);

  // Analytics Chart Data: Class-wise Attendance
  const attendanceByClassData = useMemo(() => {
    return [
      { class: "Class 6", present: 94, absent: 6 },
      { class: "Class 7", present: 91, absent: 9 },
      { class: "Class 8", present: 93, absent: 7 },
      { class: "Class 9", present: 88, absent: 12 },
      { class: "Class 10", present: 96, absent: 4 },
    ];
  }, []);

  // Analytics Chart Data: Fee Collection Trend (INR in Lakhs)
  const feeCollectionTrend = [
    { month: "Jun", collected: 45, target: 50 },
    { month: "Jul", collected: 38, target: 40 },
    { month: "Aug", collected: 28, target: 30 },
    { month: "Sep", collected: 52, target: 50 },
    { month: "Oct", collected: 42, target: 40 },
    { month: "Nov", collected: 35, target: 45 },
  ];

  // Export CSV Report of overview
  const handleExportSummaryCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Metric", "Value"],
        ["Institution", currentInstitution.name],
        ["Academic Year", currentInstitution.academicYear],
        ["Total Enrolled Students", totalStudents],
        ["Total Faculty Members", totalTeachers],
        ["Total Class Sections", totalClasses],
        ["Today's Attendance Rate", `${attendanceRate}%`],
        ["Total Fee Billed (INR)", totalFeesBilled],
        ["Total Fee Collected (INR)", totalFeesCollected],
        ["Pending Outstanding Fees (INR)", pendingFees],
        ["Fee Collection Rate", `${collectionRate}%`],
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `EDUVANTA_${currentInstitution.code}_Executive_Summary.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Executive Overview Dashboard
            </h1>
            <Badge variant="primary" size="sm">
              {currentInstitution.academicYear}
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time operational summary for {currentInstitution.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-2.5 py-1.5 text-xs text-[#374151]">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="bg-transparent outline-hidden cursor-pointer text-xs font-medium"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#F7F8FA] border border-[#E8EAED] rounded-lg px-2.5 py-1.5 text-xs text-[#374151] outline-hidden cursor-pointer"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSummaryCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs relative overflow-hidden group hover:border-[#4667D5]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FC] text-[#4667D5] flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124] tracking-tight">
              {totalStudents}
            </span>
            <span className="text-[11px] text-[#25845A] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> 100% active
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Across {totalClasses} active class sections
          </p>
        </div>

        {/* Total Teachers */}
        <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs relative overflow-hidden group hover:border-[#4667D5]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Faculty & Staff
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] text-[#25845A] flex items-center justify-center">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124] tracking-tight">
              {totalTeachers}
            </span>
            <span className="text-[11px] text-[#25845A] font-semibold">
              90% present today
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Ratio 1:{(totalStudents / totalTeachers).toFixed(0)} teacher to students
          </p>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs relative overflow-hidden group hover:border-[#4667D5]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Today&apos;s Attendance
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center">
              <CheckCircle className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124] tracking-tight">
              {attendanceRate}%
            </span>
            <Badge variant="success" size="sm">
              Above Target
            </Badge>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Threshold configured at {currentInstitution.settings.attendanceThreshold}%
          </p>
        </div>

        {/* Fee Collection & Outstanding */}
        <div className="bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs relative overflow-hidden group hover:border-[#4667D5]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
              Fee Collections
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#FFFBEB] text-[#D69B36] flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124] tracking-tight">
              {formatCurrency(totalFeesCollected)}
            </span>
            <span className="text-[11px] text-[#6B7280] font-medium">
              ({collectionRate}%)
            </span>
          </div>
          <p className="text-[11px] text-[#D94B4B] font-medium mt-1">
            Pending Dues: {formatCurrency(pendingFees)}
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class-wise Attendance Rate Bar Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Attendance Rate by Grade
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Current month average attendance percentage
              </p>
            </div>
            <Badge variant="primary" size="sm">
              Daily Tracking
            </Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={attendanceByClassData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                <XAxis dataKey="class" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E8EAED" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E8EAED" }} domain={[0, 100]} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, "Present Rate"]}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E8EAED", borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar dataKey="present" fill="#4667D5" radius={[4, 4, 0, 0]} name="Present %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Fee Collection vs Target Chart */}
        <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Fee Collection Analytics
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Collected vs Projected Target (INR in Lakhs)
              </p>
            </div>
            <span className="text-xs font-semibold text-[#25845A]">
              Target Met: 89%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={feeCollectionTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2F5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E8EAED" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E8EAED" }} />
                <Tooltip
                  formatter={(value: any) => [`₹${value} Lakhs`]}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E8EAED", borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Line type="monotone" dataKey="collected" stroke="#25845A" strokeWidth={2} name="Collected" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="4 4" name="Target" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Recent Admissions & Upcoming Examinations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Admissions / Student Directory Highlights */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
          <div className="p-4.5 border-b border-[#E8EAED] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Enrolled Students Overview
              </h3>
              <p className="text-xs text-[#6B7280]">
                Active student enrollment roster
              </p>
            </div>
            <a
              href="/students"
              className="text-xs text-[#4667D5] font-semibold hover:underline flex items-center gap-1"
            >
              View Full Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-3">Admission No</th>
                  <th className="py-2.5 px-3">Class & Sec</th>
                  <th className="py-2.5 px-3">Roll</th>
                  <th className="py-2.5 px-4 text-right">Fee Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {recentStudents.map((st) => {
                  const feeRec = studentFees.find((f) => f.studentId === st.id);
                  return (
                    <tr key={st.id} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="py-2.5 px-4 flex items-center gap-2.5">
                        <img
                          src={st.avatar}
                          alt={st.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-[#E8EAED]"
                        />
                        <div>
                          <p className="font-semibold text-[#202124]">{st.fullName}</p>
                          <span className="text-[10px] text-[#6B7280]">{st.gender}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#374151]">
                        {st.admissionNo}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#202124]">
                        {st.className} - {st.sectionName}
                      </td>
                      <td className="py-2.5 px-3 text-[#6B7280]">
                        #{st.rollNo}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Badge
                          variant={
                            feeRec?.status === "paid"
                              ? "success"
                              : feeRec?.status === "partial"
                              ? "primary"
                              : feeRec?.status === "overdue"
                              ? "danger"
                              : "warning"
                          }
                          size="sm"
                        >
                          {feeRec?.status ? feeRec.status.toUpperCase() : "PENDING"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Examinations & Announcements */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Examinations Card */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#4667D5]" />
                <h3 className="text-sm font-bold text-[#202124]">
                  Upcoming Examinations
                </h3>
              </div>
              <a
                href="/examinations"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                Date Sheet
              </a>
            </div>

            <div className="space-y-2.5">
              {upcomingExams.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] py-4 text-center">
                  No upcoming exams scheduled.
                </p>
              ) : (
                upcomingExams.map((ex) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#202124]">
                        {ex.subjectName}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {ex.className} • {ex.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#4667D5] block">
                        {formatDate(ex.date)}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">
                        {ex.startTime}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Today's Announcements Card */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#D69B36]" />
                <h3 className="text-sm font-bold text-[#202124]">
                  Active Announcements
                </h3>
              </div>
              <a
                href="/announcements"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                Notice Board
              </a>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="text-xs border-b border-[#F3F4F6] pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#202124] line-clamp-1">
                      {ann.title}
                    </p>
                    <Badge
                      variant={
                        ann.priority === "urgent"
                          ? "danger"
                          : ann.priority === "important"
                          ? "warning"
                          : "default"
                      }
                      size="sm"
                    >
                      {ann.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[#6B7280] text-[11px] line-clamp-2 mt-1">
                    {ann.content}
                  </p>
                  <span className="text-[10px] text-[#9CA3AF] mt-1 block">
                    By {ann.authorName} ({ann.authorRole}) • {formatDate(ann.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
