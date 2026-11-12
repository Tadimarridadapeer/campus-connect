"use client";

import React from "react";
import { useEdu } from "@/context/EduContext";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  CheckCircle,
  Award,
  BookOpen,
  ClipboardList,
  AlertCircle,
  FileCheck2,
  Download,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    students,
    timetable,
    assignments,
    submissions,
    examResults,
    examinations,
    dailyLogs,
    studentFees,
  } = useEdu();

  // Find student record
  const student =
    students.find((s) => s.id === currentUser?.studentId) || students[0];

  // Fee record
  const feeRecord = studentFees.find((f) => f.studentId === student.id);

  // Student's timetable for today (Thursday)
  const todaySchedule = timetable
    .filter(
      (slot) =>
        slot.day === "Thursday" &&
        slot.classId === student.classId &&
        slot.sectionId === student.sectionId
    )
    .sort((a, b) => a.periodNumber - b.periodNumber);

  // Student's upcoming examinations
  const upcomingExams = examinations
    .filter((e) => e.classId === student.classId && e.status === "upcoming")
    .slice(0, 3);

  // Student's results
  const myResults = examResults.filter((r) => r.studentId === student.id);

  // Student's assignments
  const myAssignments = assignments.filter((a) => a.classId === student.classId);

  // Today's lessons from Daily Teaching Logs for student's class
  const todayLessons = dailyLogs.filter(
    (l) => l.classId === student.classId && l.sectionId === student.sectionId
  );

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#202124] to-[#1F2937] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">
                Welcome back, {student.fullName}!
              </h1>
              <Badge variant="primary" size="sm" className="bg-white/10 text-white border-white/20">
                Roll #{student.rollNo}
              </Badge>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              {student.className} • Section {student.sectionName} • Admission No: {student.admissionNo}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Class Teacher: Dr. Arvind Swaminathan (Room 301)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="success"
            size="sm"
            onClick={() => (window.location.href = "/assignments")}
            icon={<ClipboardList className="w-4 h-4" />}
          >
            My Homework
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/examinations")}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            icon={<Award className="w-4 h-4" />}
          >
            Report Card
          </Button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Rate */}
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
            <span className="text-2xl font-bold text-[#202124]">94.2%</span>
            <Badge variant="success" size="sm">
              Eligible
            </Badge>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Min requirement: 75% for Board exams
          </p>
        </div>

        {/* Academic GPA / Marks */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Mid-Term Marks
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
            Rank #2 in Class 8A
          </p>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Active Homework
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D69B36] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">
              {myAssignments.length}
            </span>
            <span className="text-xs text-[#6B7280]">Tasks assigned</span>
          </div>
          <p className="text-[11px] text-[#D69B36] font-medium mt-1">
            1 due this weekend
          </p>
        </div>

        {/* Fee Status */}
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Fee Payment Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base font-bold text-[#202124]">
              ₹{feeRecord?.dueAmount.toLocaleString("en-IN") || 0} Due
            </span>
            <Badge
              variant={feeRecord?.status === "paid" ? "success" : "warning"}
              size="sm"
            >
              {feeRecord?.status ? feeRecord.status.toUpperCase() : "PAID"}
            </Badge>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Next due date: {feeRecord?.dueDate || "31/12/2026"}
          </p>
        </div>
      </div>

      {/* Grid: Today's Timetable & Daily Class Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Timetable */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Today&apos;s Class Schedule (Thursday)
              </h3>
              <p className="text-xs text-[#6B7280]">
                Live room locations and subject teachers
              </p>
            </div>
            <a
              href="/timetable"
              className="text-xs text-[#4667D5] font-semibold hover:underline flex items-center gap-1"
            >
              Full Week <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2.5">
            {todaySchedule.map((slot) => {
              if (slot.isBreak) {
                return (
                  <div
                    key={slot.id}
                    className="p-2.5 rounded-lg bg-[#F9FAFB] border border-dashed border-[#D1D5DB] text-center text-xs font-semibold text-[#6B7280]"
                  >
                    ☕ {slot.subjectName} ({slot.startTime} - {slot.endTime})
                  </div>
                );
              }
              return (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#E8EAED] hover:border-[#4667D5] transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#EEF2FC] text-[#4667D5] font-bold text-xs flex items-center justify-center shrink-0">
                      P{slot.periodNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">
                        {slot.subjectName}
                      </h4>
                      <p className="text-[11px] text-[#6B7280]">
                        {slot.teacherName} • {slot.roomNumber}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#374151]">
                    {slot.startTime} – {slot.endTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Today's Classroom Lessons Taught & Upcoming Exams */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Teaching Log Feed (Differentiating Feature) */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4667D5]" />
                <h3 className="text-sm font-bold text-[#202124]">
                  What Was Taught Today
                </h3>
              </div>
              <a
                href="/curriculum"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                All Logs
              </a>
            </div>

            <div className="space-y-3">
              {todayLessons.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] py-3 text-center">
                  Today&apos;s teaching logs are being updated by teachers.
                </p>
              ) : (
                todayLessons.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#202124]">
                        {l.subjectName}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">
                        {l.teacherName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#374151]">
                      <span className="font-medium text-[#6B7280]">Topic: </span>
                      {l.topicsCovered}
                    </p>
                    {l.homeworkAssigned && (
                      <div className="mt-1 p-1.5 rounded bg-[#EEF2FC] text-[#1E40AF] text-[10px] font-medium">
                        📌 Homework: {l.homeworkAssigned}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#202124]">
                Upcoming Tests & Exams
              </h3>
              <a
                href="/examinations"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                Exam Portal
              </a>
            </div>

            <div className="space-y-2.5">
              {upcomingExams.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3 rounded-lg border border-[#E8EAED] flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-[#202124]">
                      {ex.title}
                    </p>
                    <p className="text-[11px] text-[#6B7280]">
                      Room: {ex.roomNumber} • Max Marks: {ex.maxMarks}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#D94B4B] block">
                      {formatDate(ex.date)}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      {ex.startTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
