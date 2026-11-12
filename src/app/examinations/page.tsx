"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { Examination, ExamResult } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  FileCheck2,
  Calendar,
  Plus,
  Printer,
  Award,
  Filter,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function ExaminationsPage() {
  const {
    examinations,
    examResults,
    classes,
    subjects,
    students,
    createExamination,
    saveExamMarks,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"schedule" | "marks" | "reportCards">("schedule");
  const [selectedExamId, setSelectedExamId] = useState<string>("exam-mid-mth-8");
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>("stu-1");

  // Create Exam Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // New Exam Form
  const [examTitle, setExamTitle] = useState("");
  const [examCategory, setExamCategory] = useState<Examination["category"]>("unit_test");
  const [examClassId, setExamClassId] = useState("cls-8");
  const [examSubId, setExamSubId] = useState("sub-1");
  const [examDate, setExamDate] = useState("2026-11-25");
  const [examStartTime, setExamStartTime] = useState("09:15 AM");
  const [examEndTime, setExamEndTime] = useState("10:45 AM");
  const [examMaxMarks, setExamMaxMarks] = useState(40);
  const [examPassMarks, setExamPassMarks] = useState(14);
  const [examRoom, setExamRoom] = useState("Room 301");

  // Active examination for marks entry
  const activeExam =
    examinations.find((e) => e.id === selectedExamId) || examinations[0];

  // Students belonging to active exam's class
  const examStudents = useMemo(() => {
    if (!activeExam) return [];
    return students.filter((s) => s.classId === activeExam.classId);
  }, [students, activeExam]);

  // Existing results for active exam
  const activeExamResults = useMemo(() => {
    return examResults.filter((r) => r.examId === activeExam?.id);
  }, [examResults, activeExam]);

  // Local draft marks state
  const [draftMarks, setDraftMarks] = useState<Record<string, { marks: number; remarks: string }>>({});

  React.useEffect(() => {
    if (!activeExam) return;
    const initialMap: Record<string, { marks: number; remarks: string }> = {};
    examStudents.forEach((st) => {
      const existing = activeExamResults.find((r) => r.studentId === st.id);
      initialMap[st.id] = {
        marks: existing ? existing.marksObtained : 0,
        remarks: existing?.remarks || "",
      };
    });
    setDraftMarks(initialMap);
  }, [activeExam, examStudents, activeExamResults]);

  // Calculate CBSE Grade helper
  const calculateGrade = (pct: number): string => {
    if (pct >= 91) return "A1";
    if (pct >= 81) return "A2";
    if (pct >= 71) return "B1";
    if (pct >= 61) return "B2";
    if (pct >= 51) return "C1";
    if (pct >= 41) return "C2";
    if (pct >= 33) return "D";
    return "E";
  };

  // Handle Save Marks Matrix
  const handleSaveMarksMatrix = () => {
    if (!activeExam) return;

    const resultsToSave = examStudents.map((st) => {
      const marks = draftMarks[st.id]?.marks || 0;
      const pct = Number(((marks / activeExam.maxMarks) * 100).toFixed(1));
      const grade = calculateGrade(pct);
      const isPass = marks >= activeExam.passingMarks;

      return {
        examId: activeExam.id,
        studentId: st.id,
        studentName: st.fullName,
        rollNo: st.rollNo,
        marksObtained: marks,
        maxMarks: activeExam.maxMarks,
        passingMarks: activeExam.passingMarks,
        percentage: pct,
        grade,
        status: isPass ? ("pass" as const) : ("fail" as const),
        remarks: draftMarks[st.id]?.remarks || (isPass ? "Good performance" : "Requires remedial classes"),
      };
    });

    saveExamMarks(resultsToSave);
    toast("Marks Saved & Calculated", {
      type: "success",
      message: `Updated results for ${resultsToSave.length} students in ${activeExam.title}.`,
    });
  };

  // Handle Create Exam
  const handleSaveCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find((c) => c.id === examClassId);
    const selSub = subjects.find((s) => s.id === examSubId);

    createExamination({
      institutionId: currentInstitution.id,
      title: examTitle || `${selSub?.name} Assessment`,
      category: examCategory,
      classId: examClassId,
      className: selClass?.name || "Class 8",
      subjectId: examSubId,
      subjectName: selSub?.name || "Mathematics",
      date: examDate,
      startTime: examStartTime,
      endTime: examEndTime,
      maxMarks: examMaxMarks,
      passingMarks: examPassMarks,
      roomNumber: examRoom,
      status: "upcoming",
    });

    setCreateModalOpen(false);
    toast("Examination Scheduled", {
      type: "success",
      message: `${examTitle} scheduled for ${formatDate(examDate)}.`,
    });
  };

  // Active student for official report card
  const reportStudent =
    students.find((s) => s.id === selectedStudentForReport) || students[0];

  const studentMidtermResults = examResults.filter(
    (r) => r.studentId === reportStudent?.id && r.examId.includes("mid")
  );

  const totalScored = studentMidtermResults.reduce((a, b) => a + b.marksObtained, 0);
  const totalPossible = studentMidtermResults.reduce((a, b) => a + b.maxMarks, 0);
  const cumulativePct =
    totalPossible > 0 ? ((totalScored / totalPossible) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Examination &amp; Results System
            </h1>
            <Badge variant="primary" size="sm">
              CBSE Evaluation Matrix
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Exam schedules, automated marks tabulation, grade calculation, and printable report cards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReportModalOpen(true)}
            icon={<Award className="w-3.5 h-3.5" />}
          >
            Generate Report Card
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Schedule Examination
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1">
        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "schedule"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Examination Schedule ({examinations.length})
        </button>

        <button
          onClick={() => setActiveTab("marks")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "marks"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Marks Tabulation &amp; Entry
        </button>

        <button
          onClick={() => setActiveTab("reportCards")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "reportCards"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Award className="w-4 h-4" />
          Official Report Cards
        </button>
      </div>

      {/* Tab 1: Examination Schedule */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                <tr>
                  <th className="py-3 px-4">Examination Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Class &amp; Subject</th>
                  <th className="py-3 px-3">Date &amp; Time</th>
                  <th className="py-3 px-3">Marks (Max / Pass)</th>
                  <th className="py-3 px-3">Venue</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {examinations.map((ex) => (
                  <tr key={ex.id} className="hover:bg-[#FDFDFE]">
                    <td className="py-3 px-4 font-bold text-[#202124]">
                      {ex.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="uppercase text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280]">
                        {ex.category.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#202124] block">
                        {ex.subjectName}
                      </span>
                      <span className="text-[10px] text-[#6B7280]">
                        {ex.className}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#202124] block">
                        {formatDate(ex.date)}
                      </span>
                      <span className="font-mono text-[10px] text-[#6B7280]">
                        {ex.startTime} – {ex.endTime}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <strong>{ex.maxMarks}</strong> / pass: {ex.passingMarks}
                    </td>
                    <td className="py-3 px-3 text-[#374151]">
                      {ex.roomNumber}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant={
                          ex.status === "published"
                            ? "success"
                            : ex.status === "ongoing"
                            ? "warning"
                            : "primary"
                        }
                        size="sm"
                      >
                        {ex.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Marks Tabulation & Entry Matrix */}
      {activeTab === "marks" && (
        <div className="space-y-4">
          {/* Exam Selection Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#374151]">
                Select Assessment:
              </span>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer font-semibold min-w-[280px]"
              >
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title} ({ex.className} • Max: {ex.maxMarks})
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveMarksMatrix}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Save &amp; Publish Marks
            </Button>
          </div>

          {/* Marks Entry Table */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#E8EAED] flex items-center justify-between bg-[#FAFAFA]">
              <div className="text-xs">
                <span className="font-bold text-[#202124] text-sm block">
                  {activeExam?.title}
                </span>
                <span className="text-[#6B7280]">
                  Max Marks: <strong>{activeExam?.maxMarks}</strong> • Passing Threshold: <strong>{activeExam?.passingMarks}</strong>
                </span>
              </div>
              <Badge variant="primary" size="sm">
                Tabulating {examStudents.length} Students
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-3 px-4 w-14">Roll</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-3">Admission No</th>
                    <th className="py-3 px-4 w-32">Marks Scored</th>
                    <th className="py-3 px-3">Calculated %</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Result</th>
                    <th className="py-3 px-4">Evaluator Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {examStudents.map((st) => {
                    const score = draftMarks[st.id]?.marks ?? 0;
                    const max = activeExam?.maxMarks || 100;
                    const pct = Number(((score / max) * 100).toFixed(1));
                    const grade = calculateGrade(pct);
                    const isPass = score >= (activeExam?.passingMarks || 33);

                    return (
                      <tr key={st.id} className="hover:bg-[#FDFDFE]">
                        <td className="py-2.5 px-4 font-mono font-bold text-[#6B7280]">
                          #{st.rollNo}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[#202124]">
                          {st.fullName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[#6B7280]">
                          {st.admissionNo}
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            min={0}
                            max={max}
                            value={score}
                            onChange={(e) =>
                              setDraftMarks((prev) => ({
                                ...prev,
                                [st.id]: {
                                  marks: Math.min(max, Math.max(0, Number(e.target.value))),
                                  remarks: prev[st.id]?.remarks || "",
                                },
                              }))
                            }
                            className="w-20 px-2.5 py-1 text-xs font-mono font-bold border border-[#E8EAED] rounded-lg outline-hidden focus:border-[#4667D5]"
                          />
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-[#202124]">
                          {pct}%
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="primary" size="sm">
                            {grade}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant={isPass ? "success" : "danger"} size="sm">
                            {isPass ? "PASS" : "FAIL"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="text"
                            placeholder="Add evaluation feedback..."
                            value={draftMarks[st.id]?.remarks || ""}
                            onChange={(e) =>
                              setDraftMarks((prev) => ({
                                ...prev,
                                [st.id]: {
                                  marks: prev[st.id]?.marks ?? 0,
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
        </div>
      )}

      {/* Tab 3: Official Report Cards Hub */}
      {activeTab === "reportCards" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#374151]">
                Select Student:
              </span>
              <select
                value={selectedStudentForReport}
                onChange={(e) => setSelectedStudentForReport(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer font-semibold min-w-[240px]"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.fullName} ({st.className} - {st.sectionName})
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Official Report Card
            </Button>
          </div>

          {/* Printable Report Card Sheet */}
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-[#E8EAED] shadow-md space-y-6">
            {/* Header */}
            <div className="text-center border-b-2 border-[#202124] pb-4">
              <span className="text-2xl">{currentInstitution.logo}</span>
              <h2 className="text-lg font-bold uppercase tracking-wider text-[#202124] mt-1">
                {currentInstitution.name}
              </h2>
              <p className="text-xs text-[#6B7280]">
                Affiliated to CBSE, New Delhi • Affiliation No: {currentInstitution.affiliationNo}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                {currentInstitution.address}, {currentInstitution.city}, {currentInstitution.state}
              </p>
              <h3 className="text-sm font-bold uppercase tracking-widest mt-3 text-[#4667D5]">
                Academic Performance Profile (Term 1)
              </h3>
            </div>

            {/* Student Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-[#F7F8FA] p-4 rounded-xl border border-[#E8EAED]">
              <div className="space-y-1">
                <p><strong>Student Name:</strong> {reportStudent?.fullName}</p>
                <p><strong>Admission No:</strong> {reportStudent?.admissionNo}</p>
                <p><strong>Roll Number:</strong> #{reportStudent?.rollNo}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Class &amp; Section:</strong> {reportStudent?.className} - {reportStudent?.sectionName}</p>
                <p><strong>Academic Session:</strong> {currentInstitution.academicYear}</p>
                <p><strong>Attendance Rate:</strong> 94.2%</p>
              </div>
            </div>

            {/* Marks Table */}
            <div className="border border-[#202124] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#202124] text-white">
                  <tr>
                    <th className="py-2 px-3">Subject</th>
                    <th className="py-2 px-3 text-center">Max Marks</th>
                    <th className="py-2 px-3 text-center">Pass Marks</th>
                    <th className="py-2 px-3 text-center">Marks Obtained</th>
                    <th className="py-2 px-3 text-center">Grade</th>
                    <th className="py-2 px-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8EAED]">
                  {studentMidtermResults.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 px-3 font-bold text-[#202124]">
                        {r.examId.includes("mth")
                          ? "Mathematics"
                          : r.examId.includes("sci")
                          ? "Science"
                          : r.examId.includes("eng")
                          ? "English Literature"
                          : "Social Studies"}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">{r.maxMarks}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{r.passingMarks}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#4667D5] font-mono">
                        {r.marksObtained}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{r.grade}</td>
                      <td className="py-2.5 px-3 text-[#6B7280]">{r.remarks}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#F7F8FA] font-bold">
                    <td className="py-2.5 px-3">Grand Total</td>
                    <td className="py-2.5 px-3 text-center font-mono">{totalPossible}</td>
                    <td className="py-2.5 px-3 text-center font-mono">108</td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#25845A]">
                      {totalScored}
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#4667D5]">
                      {calculateGrade(Number(cumulativePct))}
                    </td>
                    <td className="py-2.5 px-3">Percentage: {cumulativePct}% (PASSED)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Grading Legend & Signatures */}
            <div className="pt-4 flex items-end justify-between text-xs text-[#6B7280]">
              <div>
                <p className="font-semibold text-[#202124]">Result Status: PROMOTED</p>
                <p className="text-[10px]">Grading Scale: A1 (91-100), A2 (81-90), B1 (71-80), B2 (61-70)</p>
              </div>

              <div className="flex gap-12 text-center text-[11px]">
                <div>
                  <div className="h-8 border-b border-[#202124] mb-1 w-28" />
                  <span>Class Teacher</span>
                </div>
                <div>
                  <div className="h-8 border-b border-[#202124] mb-1 w-28" />
                  <span>Principal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Exam Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Schedule New Examination"
        size="md"
      >
        <form onSubmit={handleSaveCreateExam} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Examination Title *
            </label>
            <input
              type="text"
              required
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Unit Test 2 — Mathematics"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Category *
              </label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="unit_test">Unit Test</option>
                <option value="midterm">Midterm Examination</option>
                <option value="quarterly">Quarterly Examination</option>
                <option value="half_yearly">Half-Yearly</option>
                <option value="annual">Annual Examination</option>
                <option value="practical">Practical Exam</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Class *
              </label>
              <select
                value={examClassId}
                onChange={(e) => setExamClassId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Subject *
              </label>
              <select
                value={examSubId}
                onChange={(e) => setExamSubId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Start</label>
              <input
                type="text"
                required
                value={examStartTime}
                onChange={(e) => setExamStartTime(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">End</label>
              <input
                type="text"
                required
                value={examEndTime}
                onChange={(e) => setExamEndTime(e.target.value)}
                className="w-full px-2 py-1 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Max</label>
              <input
                type="number"
                required
                value={examMaxMarks}
                onChange={(e) => setExamMaxMarks(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Pass</label>
              <input
                type="number"
                required
                value={examPassMarks}
                onChange={(e) => setExamPassMarks(Number(e.target.value))}
                className="w-full px-2 py-1 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Schedule
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Report Card Modal Selector */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Generate Official Student Report Card"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Select Student Roster
            </label>
            <select
              value={selectedStudentForReport}
              onChange={(e) => setSelectedStudentForReport(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#E8EAED] rounded-lg bg-white"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.className} - {st.sectionName})
                </option>
              ))}
            </select>
          </div>

          <Button
            className="w-full"
            size="sm"
            onClick={() => {
              setReportModalOpen(false);
              setActiveTab("reportCards");
            }}
          >
            Load Report Card
          </Button>
        </div>
      </Modal>
    </div>
  );
}
