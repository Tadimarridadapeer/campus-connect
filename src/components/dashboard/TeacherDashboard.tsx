"use client";

import React from "react";
import { useEdu } from "@/context/EduContext";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  CheckSquare,
  BookOpen,
  ClipboardList,
  AlertCircle,
  FileCheck2,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    teachers,
    timetable,
    assignments,
    submissions,
    dailyLogs,
    students,
    examinations,
  } = useEdu();

  // Find teacher profile
  const teacher =
    teachers.find((t) => t.id === currentUser?.teacherId) || teachers[0];

  // Today's day name (e.g., Thursday)
  const todayDayName = "Thursday"; // Current local day or standard demo day

  // Today's classes for this teacher
  const todaySchedule = timetable
    .filter(
      (slot) =>
        slot.day === todayDayName &&
        (slot.teacherId === teacher.id ||
          slot.teacherName.toLowerCase().includes(teacher.name.toLowerCase()))
    )
    .sort((a, b) => a.periodNumber - b.periodNumber);

  // Submissions needing evaluation
  const pendingSubmissions = submissions.filter((s) => s.status === "submitted");

  // Recent daily logs by this teacher
  const recentTeacherLogs = dailyLogs
    .filter((l) => l.teacherId === teacher.id)
    .slice(0, 3);

  // Teacher's class students
  const myClassTeacherOf = teacher.isClassTeacherOf;
  const myClassStudents = myClassTeacherOf
    ? students.filter(
        (s) =>
          s.classId === myClassTeacherOf.classId &&
          s.sectionId === myClassTeacherOf.sectionId
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#202124] to-[#2E3138] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h1 className="text-lg font-bold">
              Good day, {teacher.name}!
            </h1>
            <Badge variant="primary" size="sm" className="bg-white/10 text-white border-white/20">
              {teacher.department}
            </Badge>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            {teacher.designation} • Employee ID: {teacher.employeeId}
          </p>
          {myClassTeacherOf && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Class Teacher: {myClassTeacherOf.className} - Section {myClassTeacherOf.sectionName}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a href="/attendance">
            <Button
              variant="success"
              size="sm"
              icon={<CheckSquare className="w-4 h-4" />}
            >
              Mark Class Attendance
            </Button>
          </a>
          <a href="/curriculum">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={<BookOpen className="w-4 h-4" />}
            >
              Log Today&apos;s Lesson
            </Button>
          </a>
        </div>
      </div>

      {/* 3 Metric Cards for Teacher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Today&apos;s Schedule
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FC] text-[#4667D5] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">
              {todaySchedule.length}
            </span>
            <span className="text-xs text-[#6B7280]">Lectures / Lab slots</span>
          </div>
          <p className="text-[11px] text-[#25845A] font-medium mt-1">
            Next: Period {todaySchedule[0]?.periodNumber || 1} at {todaySchedule[0]?.startTime || "09:00 AM"}
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Pending Submissions
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#D69B36] flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">
              {pendingSubmissions.length}
            </span>
            <span className="text-xs text-[#6B7280]">To evaluate</span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Across {assignments.length} active assignments
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B7280]">
              Assigned Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#25845A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#202124]">
              {myClassStudents.length > 0 ? myClassStudents.length : "35"}
            </span>
            <span className="text-xs text-[#6B7280]">in your care</span>
          </div>
          <p className="text-[11px] text-[#4667D5] font-medium mt-1">
            Class 8A roster active
          </p>
        </div>
      </div>

      {/* Two Column Layout: Today's Timetable & Actionable Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Timetable Schedule */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Today&apos;s Teaching Schedule ({todayDayName})
              </h3>
              <p className="text-xs text-[#6B7280]">
                Classroom, period timings, and assigned sections
              </p>
            </div>
            <a
              href="/timetable"
              className="text-xs text-[#4667D5] font-semibold hover:underline flex items-center gap-1"
            >
              Full Timetable <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] py-6 text-center">
                No teaching periods scheduled for today.
              </p>
            ) : (
              todaySchedule.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-[#E8EAED] hover:border-[#4667D5] transition-all bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#202124] text-white flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] uppercase font-bold text-gray-300">Period</span>
                      <span className="text-xs font-bold">{slot.periodNumber}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">
                        {slot.subjectName}
                      </h4>
                      <p className="text-[11px] text-[#6B7280]">
                        {slot.className} - Section {slot.sectionName} • {slot.roomNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#4667D5] block font-mono">
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <Badge variant="primary" size="sm">
                      Confirmed
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Actions & Evaluations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Submissions to Grade */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#D69B36]" />
                <h3 className="text-sm font-bold text-[#202124]">
                  Submissions To Grade
                </h3>
              </div>
              <a
                href="/assignments"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                Grade Hub
              </a>
            </div>

            <div className="space-y-2.5">
              {pendingSubmissions.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] py-3 text-center">
                  All assignments evaluated!
                </p>
              ) : (
                pendingSubmissions.map((sub) => {
                  const asg = assignments.find((a) => a.id === sub.assignmentId);
                  return (
                    <div
                      key={sub.id}
                      className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#202124]">
                          {sub.studentName}
                        </p>
                        <p className="text-[11px] text-[#6B7280] line-clamp-1">
                          {asg?.title || "Assignment"}
                        </p>
                        <span className="text-[10px] text-[#9CA3AF]">
                          Submitted: {sub.submissionDate}
                        </span>
                      </div>
                      <a href="/assignments">
                        <Button variant="subtle" size="xs">
                          Evaluate
                        </Button>
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Curriculum / Daily Log Activity */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#202124]">
                Recent Teaching Logs
              </h3>
              <a
                href="/curriculum"
                className="text-xs text-[#4667D5] font-semibold hover:underline"
              >
                View Tracker
              </a>
            </div>

            <div className="space-y-3">
              {recentTeacherLogs.map((log) => (
                <div key={log.id} className="text-xs border-b border-[#F3F4F6] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#202124]">
                      {log.className} • {log.subjectName}
                    </span>
                    <span className="text-[10px] text-[#6B7280]">
                      {formatDate(log.date)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#374151] mt-0.5 line-clamp-1">
                    {log.topicsCovered}
                  </p>
                  <p className="text-[10px] text-[#4667D5] mt-0.5">
                    HW: {log.homeworkAssigned}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
