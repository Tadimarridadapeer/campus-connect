"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { CurriculumChapter, DailyTeachingLog } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  BookMarked,
  Plus,
  CheckCircle,
  Clock,
  Layers,
  Calendar,
  Sparkles,
  BookOpen,
  Filter,
  CheckSquare,
  AlertCircle,
} from "lucide-react";

export default function CurriculumPage() {
  const {
    currentUser,
    curriculum,
    dailyLogs,
    classes,
    subjects,
    teachers,
    updateChapterStatus,
    addDailyTeachingLog,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"chapters" | "dailyLogs">("chapters");
  const [selectedSubName, setSelectedSubName] = useState<string>("Mathematics");
  const [selectedClassId, setSelectedClassId] = useState<string>("cls-8");

  // Add Daily Log Modal
  const [logModalOpen, setLogModalOpen] = useState(false);

  // Daily Log Form
  const [logDate, setLogDate] = useState("2026-11-12");
  const [logClassId, setLogClassId] = useState("cls-8");
  const [logSubId, setLogSubId] = useState("sub-1");
  const [logChapterTitle, setLogChapterTitle] = useState("Linear Equations in One Variable");
  const [logTopics, setLogTopics] = useState("");
  const [logHomework, setLogHomework] = useState("");
  const [logRemarks, setLogRemarks] = useState("");

  const isTeacherOrAdmin =
    currentUser?.role === "teacher" ||
    currentUser?.role === "super_admin" ||
    currentUser?.role === "principal" ||
    currentUser?.role === "coordinator";

  // Filtered chapters
  const filteredChapters = curriculum.filter(
    (c) => c.subjectName === selectedSubName && c.classId === selectedClassId
  );

  // Handle Save Daily Teaching Log
  const handleSaveDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find((c) => c.id === logClassId);
    const selSub = subjects.find((s) => s.id === logSubId);

    addDailyTeachingLog({
      institutionId: currentInstitution.id,
      classId: logClassId,
      className: selClass?.name || "Class 8",
      sectionId: "sec-8a",
      sectionName: "A",
      subjectId: logSubId,
      subjectName: selSub?.name || "Mathematics",
      teacherId: currentUser?.teacherId || "tch-1",
      teacherName: currentUser?.name || "Dr. Arvind Swaminathan",
      date: logDate,
      chapterId: "cur-mth-2",
      chapterTitle: logChapterTitle,
      topicsCovered: logTopics,
      homeworkAssigned: logHomework,
      remarks: logRemarks,
    });

    setLogModalOpen(false);
    setLogTopics("");
    setLogHomework("");
    toast("Teaching Log Published", {
      type: "success",
      message: `Lesson entry recorded for ${selSub?.name} on ${formatDate(logDate)}. Visible to students & parents.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Curriculum Tracking &amp; Daily Teaching Logs
            </h1>
            <Badge variant="primary" size="sm">
              Pedagogical Oversight
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Chapter completion progress, learning objectives, and transparent classroom teaching logs
          </p>
        </div>

        {isTeacherOrAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setLogModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Log Daily Teaching
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1">
        <button
          onClick={() => setActiveTab("chapters")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "chapters"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Layers className="w-4 h-4" />
          Chapter Syllabus &amp; Progress
        </button>

        <button
          onClick={() => setActiveTab("dailyLogs")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "dailyLogs"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Daily Classroom Teaching Logs ({dailyLogs.length})
        </button>
      </div>

      {/* Tab 1: Chapter Syllabus Tracker */}
      {activeTab === "chapters" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Subject:</span>
                <select
                  value={selectedSubName}
                  onChange={(e) => setSelectedSubName(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer font-semibold"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-[#6B7280]">
              Completed Chapters: <strong className="text-[#25845A]">{filteredChapters.filter((c) => c.status === "completed").length}</strong> of {filteredChapters.length}
            </div>
          </div>

          {/* Chapter Cards List */}
          <div className="space-y-3">
            {filteredChapters.map((chap) => (
              <div
                key={chap.id}
                className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs hover:border-[#4667D5]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F3F4F6] text-[#202124]">
                      Chapter {chap.chapterNumber}
                    </span>
                    <h3 className="text-base font-bold text-[#202124]">
                      {chap.chapterTitle}
                    </h3>
                    <Badge
                      variant={
                        chap.status === "completed"
                          ? "success"
                          : chap.status === "in_progress"
                          ? "primary"
                          : "secondary"
                      }
                      size="sm"
                    >
                      {chap.status === "completed"
                        ? "COMPLETED"
                        : chap.status === "in_progress"
                        ? "IN PROGRESS"
                        : "NOT STARTED"}
                    </Badge>
                  </div>

                  <div className="text-xs text-[#4B5563]">
                    <span className="font-semibold text-[#6B7280]">Topics: </span>
                    {chap.topics.join(" • ")}
                  </div>

                  <div className="text-[11px] text-[#6B7280]">
                    <span className="font-semibold text-[#6B7280]">Objectives: </span>
                    {chap.learningObjectives.join("; ")}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#6B7280] pt-1">
                    <span>Instructor: <strong className="text-[#202124]">{chap.assignedTeacherName}</strong></span>
                    <span>Planned Completion: <strong>{formatDate(chap.plannedCompletionDate)}</strong></span>
                    {chap.actualCompletionDate && (
                      <span className="text-[#25845A] font-semibold">
                        Finished on: {formatDate(chap.actualCompletionDate)}
                      </span>
                    )}
                  </div>
                </div>

                {isTeacherOrAdmin && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant={chap.status === "not_started" ? "primary" : "outline"}
                      size="xs"
                      onClick={() => updateChapterStatus(chap.id, "not_started")}
                    >
                      Not Started
                    </Button>
                    <Button
                      variant={chap.status === "in_progress" ? "primary" : "outline"}
                      size="xs"
                      onClick={() => updateChapterStatus(chap.id, "in_progress")}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={chap.status === "completed" ? "success" : "outline"}
                      size="xs"
                      onClick={() => updateChapterStatus(chap.id, "completed")}
                      icon={<CheckCircle className="w-3.5 h-3.5" />}
                    >
                      Complete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Daily Teaching Logs Feed */}
      {activeTab === "dailyLogs" && (
        <div className="space-y-4">
          <div className="space-y-3">
            {dailyLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs space-y-3 hover:border-[#4667D5]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3F4F6] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#202124]">
                        {log.subjectName} — {log.className} (Section {log.sectionName})
                      </span>
                      <Badge variant="primary" size="sm">
                        {log.chapterTitle}
                      </Badge>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      Instructor: {log.teacherName}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-semibold text-[#4667D5] bg-[#EEF2FC] px-2.5 py-1 rounded-md">
                    {formatDate(log.date)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#374151] block text-[11px] uppercase tracking-wider">
                      Concepts &amp; Topics Covered Today:
                    </span>
                    <p className="text-[#202124] text-xs mt-0.5 leading-relaxed">
                      {log.topicsCovered}
                    </p>
                  </div>

                  {log.homeworkAssigned && (
                    <div className="p-3 bg-[#EEF2FC]/70 rounded-lg border border-[#D6E0FA] text-xs">
                      <span className="font-bold text-[#1E40AF] block">
                        📌 Homework / Home Study Task Assigned:
                      </span>
                      <p className="text-[#1E3A8A] mt-0.5 font-medium">
                        {log.homeworkAssigned}
                      </p>
                    </div>
                  )}

                  {log.remarks && (
                    <p className="text-[11px] text-[#6B7280] italic">
                      Note: {log.remarks}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Daily Teaching Log Modal */}
      <Modal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        title="Add Daily Classroom Teaching Log"
        description="Records what topics were taught and assignments given. Visible to parents and students."
        size="md"
      >
        <form onSubmit={handleSaveDailyLog} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Class *
              </label>
              <select
                value={logClassId}
                onChange={(e) => setLogClassId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
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
                value={logSubId}
                onChange={(e) => setLogSubId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Chapter Title *
              </label>
              <input
                type="text"
                required
                value={logChapterTitle}
                onChange={(e) => setLogChapterTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Topics Covered in Class Today *
            </label>
            <textarea
              rows={2}
              required
              value={logTopics}
              onChange={(e) => setLogTopics(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Solving linear equations with variable on both sides; demonstrated on board"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Homework Assigned
            </label>
            <input
              type="text"
              value={logHomework}
              onChange={(e) => setLogHomework(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Exercise 2.3 Questions 1 to 10 in notebooks"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Classroom Observations / Remarks
            </label>
            <input
              type="text"
              value={logRemarks}
              onChange={(e) => setLogRemarks(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="Optional notes regarding participation or pace"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLogModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save &amp; Publish Log
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
