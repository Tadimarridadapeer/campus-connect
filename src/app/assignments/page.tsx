"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { Assignment, AssignmentSubmission } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileText,
  Upload,
  Download,
  Award,
  ArrowRight,
} from "lucide-react";

export default function AssignmentsPage() {
  const {
    currentUser,
    assignments,
    submissions,
    classes,
    subjects,
    students,
    createAssignment,
    submitAssignment,
    gradeSubmission,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const isTeacherOrAdmin =
    currentUser?.role === "teacher" ||
    currentUser?.role === "super_admin" ||
    currentUser?.role === "principal" ||
    currentUser?.role === "coordinator";

  const isStudent = currentUser?.role === "student";

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);

  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<AssignmentSubmission | null>(null);

  // New Assignment Form State
  const [newTitle, setNewTitle] = useState("");
  const [newClassId, setNewClassId] = useState("cls-8");
  const [newSubId, setNewSubId] = useState("sub-1");
  const [newDesc, setNewDesc] = useState("");
  const [newInstructions, setNewInstructions] = useState("");
  const [newMaxMarks, setNewMaxMarks] = useState(20);
  const [newDueDate, setNewDueDate] = useState("2026-11-20");

  // Student submission form
  const [studentContent, setStudentContent] = useState("");
  const [studentFileName, setStudentFileName] = useState("Homework_Response.pdf");

  // Grading form
  const [awardedMarks, setAwardedMarks] = useState<number>(18);
  const [teacherFeedback, setTeacherFeedback] = useState("Well solved with clean steps.");

  // Current student record (if student role)
  const currentStudent =
    students.find((s) => s.id === currentUser?.studentId) || students[0];

  // Handle Create Assignment
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find((c) => c.id === newClassId);
    const selSub = subjects.find((s) => s.id === newSubId);

    createAssignment({
      institutionId: currentInstitution.id,
      classId: newClassId,
      className: selClass?.name || "Class 8",
      sectionId: "sec-8a",
      sectionName: "A",
      subjectId: newSubId,
      subjectName: selSub?.name || "Mathematics",
      teacherId: currentUser?.teacherId || "tch-1",
      teacherName: currentUser?.name || "Faculty",
      title: newTitle,
      description: newDesc,
      instructions: newInstructions,
      maxMarks: newMaxMarks,
      assignedDate: new Date().toISOString().split("T")[0],
      dueDate: newDueDate,
      attachments: [
        {
          name: "Assignment_Questions_Reference.pdf",
          size: "350 KB",
          url: "#",
        },
      ],
      targetType: "all",
    });

    setCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    toast("Assignment Published", {
      type: "success",
      message: `${newTitle} is now accessible to students.`,
    });
  };

  // Handle Student Submit
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;

    submitAssignment(
      activeAssignment.id,
      currentStudent.id,
      currentStudent.fullName,
      studentContent,
      studentFileName
    );

    setSubmitModalOpen(false);
    setStudentContent("");
    toast("Assignment Submitted", {
      type: "success",
      message: "Your submission has been handed in to the instructor.",
    });
  };

  // Handle Teacher Grade
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    gradeSubmission(activeSubmission.id, awardedMarks, teacherFeedback);
    setGradeModalOpen(false);
    toast("Submission Evaluated", {
      type: "success",
      message: `Score of ${awardedMarks} awarded with comments.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Assignments &amp; Academic Assessments
            </h1>
            <Badge variant="primary" size="sm">
              {assignments.length} Total Assignments
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Create homework tasks, collect digital submissions, and deliver grading feedback
          </p>
        </div>

        {isTeacherOrAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Assignment
          </Button>
        )}
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((asg) => {
          // Submissions for this assignment
          const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
          const studentSubmission = submissions.find(
            (s) => s.assignmentId === asg.id && s.studentId === currentStudent.id
          );

          return (
            <div
              key={asg.id}
              className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs hover:border-[#4667D5]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="primary" size="sm">
                    {asg.subjectName}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#D94B4B] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due {formatDate(asg.dueDate)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#202124] mt-2 leading-snug">
                  {asg.title}
                </h3>
                <p className="text-xs text-[#6B7280] line-clamp-2 mt-1">
                  {asg.description}
                </p>

                <div className="mt-3.5 p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Class &amp; Sec:</span>
                    <span className="font-semibold text-[#202124]">{asg.className} - {asg.sectionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Maximum Marks:</span>
                    <span className="font-bold text-[#4667D5]">{asg.maxMarks} Pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Instructor:</span>
                    <span className="text-[#202124]">{asg.teacherName}</span>
                  </div>
                </div>

                {/* Attachments */}
                {asg.attachments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const blob = new Blob(
                        [
                          `CAMPUS CONNECT Assignment Reference Document\n\nTitle: ${asg.title}\nClass: ${asg.className} - ${asg.sectionName}\nSubject: ${asg.subjectName}\nTeacher: ${asg.teacherName}\nDue Date: ${asg.dueDate}\nMaximum Marks: ${asg.maxMarks}\n\nInstructions & Guidelines:\n${asg.instructions || asg.description}\n\n[Official Assignment Question Paper]`,
                        ],
                        { type: "text/plain" }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = asg.attachments[0].name;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast("Attachment Downloaded", {
                        type: "success",
                        message: `${asg.attachments[0].name} saved to device.`,
                      });
                    }}
                    className="mt-2 text-[11px] text-[#4667D5] hover:underline flex items-center gap-1.5 font-medium cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      {asg.attachments[0].name} ({asg.attachments[0].size})
                    </span>
                    <Download className="w-3 h-3 ml-0.5 text-[#4667D5]" />
                  </button>
                )}
              </div>

              {/* Action Buttons based on Role */}
              <div className="mt-4 pt-3.5 border-t border-[#F3F4F6] flex items-center justify-between">
                {isStudent ? (
                  studentSubmission ? (
                    <div className="flex items-center justify-between w-full">
                      <Badge
                        variant={studentSubmission.status === "evaluated" ? "success" : "primary"}
                        size="sm"
                      >
                        {studentSubmission.status === "evaluated"
                          ? `Graded: ${studentSubmission.marksAwarded}/${asg.maxMarks}`
                          : "Submitted"}
                      </Badge>
                      {studentSubmission.teacherFeedback && (
                        <span className="text-[10px] text-[#6B7280] italic truncate max-w-[150px]">
                          &quot;{studentSubmission.teacherFeedback}&quot;
                        </span>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => {
                        setActiveAssignment(asg);
                        setSubmitModalOpen(true);
                      }}
                      icon={<Upload className="w-3 h-3" />}
                    >
                      Turn In Work
                    </Button>
                  )
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-[#6B7280]">
                      <strong>{asgSubmissions.length}</strong> handed in
                    </span>

                    {asgSubmissions.length > 0 && (
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => {
                          setActiveAssignment(asg);
                          setActiveSubmission(asgSubmissions[0]);
                          setAwardedMarks(asgSubmissions[0].marksAwarded || 18);
                          setTeacherFeedback(asgSubmissions[0].teacherFeedback || "Well done.");
                          setGradeModalOpen(true);
                        }}
                      >
                        Grade ({asgSubmissions.length})
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Homework Assignment"
        size="md"
      >
        <form onSubmit={handleSaveCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Chapter 2 Linear Equations Application Problems"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Class *
              </label>
              <select
                value={newClassId}
                onChange={(e) => setNewClassId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Subject *
              </label>
              <select
                value={newSubId}
                onChange={(e) => setNewSubId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Maximum Score (Marks) *
              </label>
              <input
                type="number"
                required
                value={newMaxMarks}
                onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Submission Due Date *
              </label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Description / Problem Statement *
            </label>
            <textarea
              rows={2}
              required
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="Detailed instructions for students..."
            />
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
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Turn In Work Modal */}
      <Modal
        isOpen={submitModalOpen && !!activeAssignment}
        onClose={() => setSubmitModalOpen(false)}
        title={`Turn In: ${activeAssignment?.title}`}
        size="md"
      >
        <form onSubmit={handleStudentSubmit} className="space-y-3.5">
          <div className="p-3 bg-[#F7F8FA] rounded-lg text-xs space-y-1">
            <p><strong>Subject:</strong> {activeAssignment?.subjectName}</p>
            <p><strong>Max Marks:</strong> {activeAssignment?.maxMarks} Pts</p>
            <p><strong>Due Date:</strong> {activeAssignment ? formatDate(activeAssignment.dueDate) : ""}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Student Solution Notes / Summary
            </label>
            <textarea
              rows={3}
              required
              value={studentContent}
              onChange={(e) => setStudentContent(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="Enter brief explanation or solution notes..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Simulated File Attachment
            </label>
            <input
              type="text"
              required
              value={studentFileName}
              onChange={(e) => setStudentFileName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>

      {/* Teacher Grade Modal */}
      <Modal
        isOpen={gradeModalOpen && !!activeSubmission}
        onClose={() => setGradeModalOpen(false)}
        title={`Evaluate Submission — ${activeSubmission?.studentName}`}
        size="md"
      >
        <form onSubmit={handleSaveGrade} className="space-y-3.5">
          <div className="p-3 bg-[#F7F8FA] rounded-lg text-xs space-y-1">
            <p><strong>Student:</strong> {activeSubmission?.studentName}</p>
            <p><strong>Submitted On:</strong> {activeSubmission?.submissionDate}</p>
            <p><strong>Attachment:</strong> <span className="font-mono text-[#4667D5]">{activeSubmission?.fileName}</span></p>
            <div className="mt-2 p-2 bg-white rounded border border-[#E8EAED]">
              <span className="text-[#6B7280] block text-[10px]">Student Notes:</span>
              <p className="text-[#202124]">{activeSubmission?.content}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Score Awarded (Max: {activeAssignment?.maxMarks || 20}) *
            </label>
            <input
              type="number"
              min={0}
              max={activeAssignment?.maxMarks || 20}
              required
              value={awardedMarks}
              onChange={(e) => setAwardedMarks(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs font-mono font-bold text-sm border border-[#E8EAED] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Instructor Feedback *
            </label>
            <textarea
              rows={2}
              required
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="Add feedback for student..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGradeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Grade
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
