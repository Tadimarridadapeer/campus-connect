"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { AttendanceStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  Users,
  CheckCheck,
  TrendingUp,
} from "lucide-react";

export default function AttendancePage() {
  const {
    students,
    classes,
    attendance,
    markAttendance,
    teachers,
    teacherAttendance,
    markTeacherAttendance,
  } = useEdu();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");
  const [selectedClassId, setSelectedClassId] = useState<string>("cls-8");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("sec-8a");
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-12");

  // Selected class students
  const classStudents = useMemo(() => {
    return students.filter(
      (s) => s.classId === selectedClassId && s.sectionId === selectedSectionId
    );
  }, [students, selectedClassId, selectedSectionId]);

  // Existing attendance on chosen date
  const existingRecords = useMemo(() => {
    return attendance.filter(
      (a) =>
        a.classId === selectedClassId &&
        a.sectionId === selectedSectionId &&
        a.date === selectedDate
    );
  }, [attendance, selectedClassId, selectedSectionId, selectedDate]);

  // Local draft state for marking attendance
  const [draftStatus, setDraftStatus] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  // Sync draftStatus whenever class/section/date changes
  React.useEffect(() => {
    const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((st) => {
      const rec = existingRecords.find((r) => r.studentId === st.id);
      initialMap[st.id] = {
        status: rec ? rec.status : "present",
        remarks: rec?.remarks || "",
      };
    });
    setDraftStatus(initialMap);
  }, [classStudents, existingRecords]);

  // Status counters
  const presentCount = Object.values(draftStatus).filter(
    (v) => v.status === "present" || v.status === "late"
  ).length;
  const absentCount = Object.values(draftStatus).filter((v) => v.status === "absent").length;
  const leaveCount = Object.values(draftStatus).filter((v) => v.status === "leave").length;
  const totalCount = classStudents.length;
  const ratePercentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : "0";

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    classStudents.forEach((s) => {
      updated[s.id] = { status: "present", remarks: "" };
    });
    setDraftStatus(updated);
    toast("All Students Marked Present", { type: "info" });
  };

  // Submit attendance
  const handleSubmitAttendance = () => {
    const recordsToSave = classStudents.map((st) => ({
      studentId: st.id,
      studentName: st.fullName,
      rollNo: st.rollNo,
      classId: selectedClassId,
      sectionId: selectedSectionId,
      date: selectedDate,
      status: draftStatus[st.id]?.status || "present",
      remarks: draftStatus[st.id]?.remarks || "",
    }));

    markAttendance(recordsToSave);
    toast("Attendance Successfully Recorded", {
      type: "success",
      message: `${presentCount} present, ${absentCount} absent, ${leaveCount} on leave for ${formatDate(selectedDate)}.`,
    });
  };

  // Export CSV
  const handleExportAttendanceCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Admission No", "Roll", "Student Name", "Date", "Status", "Remarks"],
        ...classStudents.map((st) => [
          st.admissionNo,
          st.rollNo,
          `"${st.fullName}"`,
          selectedDate,
          draftStatus[st.id]?.status || "present",
          `"${draftStatus[st.id]?.remarks || ""}"`,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Attendance_${selectedDate}_Class8A.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Daily Attendance Register
            </h1>
            <Badge variant="primary" size="sm">
              Live Register
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time biometric &amp; classroom roll call logging with monthly percentage tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAttendanceCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Sheet
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitAttendance}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Submit &amp; Lock Attendance
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "students"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          Student Daily Attendance
        </button>
        <button
          onClick={() => setActiveTab("teachers")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "teachers"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          Faculty &amp; Staff Attendance
        </button>
      </div>

      {activeTab === "students" && (
        <>
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Class Selector */}
              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const c = classes.find((cls) => cls.id === e.target.value);
                    setSelectedSectionId(c?.sections[0]?.id || "");
                  }}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section Selector */}
              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Section:</span>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                >
                  {classes
                    .find((c) => c.id === selectedClassId)
                    ?.sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        Section {s.name} ({s.roomNumber})
                      </option>
                    ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllPresent}
              icon={<CheckCircle className="w-3.5 h-3.5 text-[#25845A]" />}
            >
              Mark All Present
            </Button>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] text-xs">
              <span className="text-[#6B7280]">Present / Late</span>
              <p className="text-xl font-bold text-[#25845A] mt-1">
                {presentCount} / {totalCount}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] text-xs">
              <span className="text-[#6B7280]">Absent</span>
              <p className="text-xl font-bold text-[#D94B4B] mt-1">
                {absentCount}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] text-xs">
              <span className="text-[#6B7280]">Approved Leave</span>
              <p className="text-xl font-bold text-[#D69B36] mt-1">
                {leaveCount}
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-[#E8EAED] text-xs">
              <span className="text-[#6B7280]">Attendance Rate</span>
              <p className="text-xl font-bold text-[#4667D5] mt-1">
                {ratePercentage}%
              </p>
            </div>
          </div>

          {/* Attendance Marking Table */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-3 px-4 w-16">Roll #</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-3">Admission No</th>
                    <th className="py-3 px-4 text-center">Status Selection</th>
                    <th className="py-3 px-4">Remarks / Excused Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {classStudents.map((st) => {
                    const currentStatus = draftStatus[st.id]?.status || "present";
                    const currentRemarks = draftStatus[st.id]?.remarks || "";

                    return (
                      <tr key={st.id} className="hover:bg-[#FDFDFE]">
                        <td className="py-3 px-4 font-mono font-bold text-[#6B7280]">
                          #{st.rollNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={st.avatar}
                              alt={st.fullName}
                              className="w-7 h-7 rounded-full object-cover border border-[#E8EAED]"
                            />
                            <span className="font-bold text-[#202124]">
                              {st.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[#6B7280]">
                          {st.admissionNo}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 p-1 bg-[#F7F8FA] rounded-lg border border-[#E8EAED]">
                            {(
                              [
                                { id: "present", label: "P", color: "hover:bg-[#ECFDF5] hover:text-[#25845A]" },
                                { id: "late", label: "L", color: "hover:bg-[#FFFBEB] hover:text-[#D69B36]" },
                                { id: "leave", label: "LV", color: "hover:bg-[#F0F9FF] hover:text-[#0284C7]" },
                                { id: "absent", label: "A", color: "hover:bg-[#FEF2F2] hover:text-[#D94B4B]" },
                              ] as const
                            ).map((opt) => (
                              <button
                                key={opt.id}
                                onClick={() =>
                                  setDraftStatus((prev) => ({
                                    ...prev,
                                    [st.id]: {
                                      status: opt.id,
                                      remarks: prev[st.id]?.remarks || "",
                                    },
                                  }))
                                }
                                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                                  currentStatus === opt.id
                                    ? opt.id === "present"
                                      ? "bg-[#25845A] text-white shadow-xs"
                                      : opt.id === "late"
                                      ? "bg-[#D69B36] text-white shadow-xs"
                                      : opt.id === "leave"
                                      ? "bg-[#0284C7] text-white shadow-xs"
                                      : "bg-[#D94B4B] text-white shadow-xs"
                                    : `text-[#6B7280] ${opt.color}`
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Optional remark (e.g. sick note, bus delay)..."
                            value={currentRemarks}
                            onChange={(e) =>
                              setDraftStatus((prev) => ({
                                ...prev,
                                [st.id]: {
                                  status: prev[st.id]?.status || "present",
                                  remarks: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-2.5 py-1 text-xs border border-[#E8EAED] rounded-lg outline-hidden focus:border-[#4667D5]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Teacher Attendance Tab */}
      {activeTab === "teachers" && (
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#E8EAED] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202124]">
              Faculty Attendance for {formatDate(selectedDate)}
            </h3>
            <span className="text-xs text-[#25845A] font-semibold">
              9/10 Present (90%)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-3">Employee ID</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {teachers.map((t) => {
                  const rec = teacherAttendance.find((ta) => ta.teacherId === t.id);
                  const isLeave = rec?.status === "leave";

                  return (
                    <tr key={t.id} className="hover:bg-[#FDFDFE]">
                      <td className="py-3 px-4 font-bold text-[#202124] flex items-center gap-2.5">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#E8EAED]"
                        />
                        {t.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#6B7280]">
                        {t.employeeId}
                      </td>
                      <td className="py-3 px-3 text-[#374151]">
                        {t.department}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={isLeave ? "warning" : "success"}
                          size="sm"
                        >
                          {isLeave ? "CASUAL LEAVE" : "PRESENT"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-[#6B7280]">
                        {rec?.remarks || "On Duty (Biometric Check-in: 08:24 AM)"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
