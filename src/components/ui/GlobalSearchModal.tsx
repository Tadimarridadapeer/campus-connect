"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, User, BookOpen, GraduationCap, FileText, Calendar, Award, ArrowRight, X } from "lucide-react";
import { useEdu } from "@/context/EduContext";
import { useRouter } from "next/navigation";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { students, teachers, classes, subjects, examinations, assignments, certificates } = useEdu();
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(); // toggle handled by parent
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: {
      category: string;
      icon: any;
      title: string;
      subtitle: string;
      link: string;
    }[] = [];

    // Students
    students.forEach((s) => {
      if (
        s.fullName.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q)
      ) {
        matches.push({
          category: "Students",
          icon: User,
          title: s.fullName,
          subtitle: `${s.admissionNo} • ${s.className} - Section ${s.sectionName} (Roll #${s.rollNo})`,
          link: `/students?id=${s.id}`,
        });
      }
    });

    // Teachers
    teachers.forEach((t) => {
      if (
        t.name.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      ) {
        matches.push({
          category: "Teachers",
          icon: GraduationCap,
          title: t.name,
          subtitle: `${t.employeeId} • ${t.designation} (${t.department})`,
          link: `/teachers?id=${t.id}`,
        });
      }
    });

    // Classes
    classes.forEach((c) => {
      if (c.name.toLowerCase().includes(q)) {
        matches.push({
          category: "Classes & Sections",
          icon: BookOpen,
          title: c.name,
          subtitle: `${c.sections.length} Sections (${c.sections.map((s) => s.name).join(", ")})`,
          link: `/academics`,
        });
      }
    });

    // Subjects
    subjects.forEach((sub) => {
      if (sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q)) {
        matches.push({
          category: "Subjects",
          icon: BookOpen,
          title: sub.name,
          subtitle: `Code: ${sub.code} • ${sub.creditsOrPeriods} Periods/Wk`,
          link: `/academics`,
        });
      }
    });

    // Exams
    examinations.forEach((ex) => {
      if (
        ex.title.toLowerCase().includes(q) ||
        ex.subjectName.toLowerCase().includes(q)
      ) {
        matches.push({
          category: "Examinations",
          icon: Calendar,
          title: ex.title,
          subtitle: `${ex.className} • ${ex.date} (${ex.startTime})`,
          link: `/examinations`,
        });
      }
    });

    // Assignments
    assignments.forEach((asg) => {
      if (
        asg.title.toLowerCase().includes(q) ||
        asg.subjectName.toLowerCase().includes(q)
      ) {
        matches.push({
          category: "Assignments",
          icon: FileText,
          title: asg.title,
          subtitle: `${asg.className} • ${asg.subjectName} • Due: ${asg.dueDate}`,
          link: `/assignments`,
        });
      }
    });

    // Certificates
    certificates.forEach((cert) => {
      if (
        cert.certificateNumber.toLowerCase().includes(q) ||
        cert.studentName.toLowerCase().includes(q)
      ) {
        matches.push({
          category: "Certificates",
          icon: Award,
          title: `${cert.type.toUpperCase()} Certificate — ${cert.studentName}`,
          subtitle: `No: ${cert.certificateNumber} • Issued: ${cert.issueDate}`,
          link: `/certificates`,
        });
      }
    });

    return matches.slice(0, 12);
  }, [query, students, teachers, classes, subjects, examinations, assignments, certificates]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E8EAED] overflow-hidden z-10 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8EAED]">
          <Search className="w-5 h-5 text-[#9CA3AF] shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search students, teachers, classes, exams, subjects, certificates... (Type to find)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-[#202124] placeholder-[#9CA3AF] bg-transparent outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#9CA3AF] hover:text-[#4B5563] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-medium text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB] rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="py-10 text-center text-[#6B7280]">
              <Search className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2.5" />
              <p className="text-xs font-medium text-[#374151]">
                Quick Enterprise Global Search
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                Type a name like &quot;Aarav&quot;, &quot;Arvind&quot;, &quot;Class 8&quot;, or &quot;Math&quot;
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-[#6B7280]">
              <p className="text-sm font-medium text-[#374151]">
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Try searching by student name, admission number, teacher name, or class.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {results.map((res, idx) => {
                const Icon = res.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      router.push(res.link);
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F7F8FA] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EEF2FC] text-[#4667D5] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#202124]">
                            {res.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F3F4F6] text-[#6B7280] font-medium">
                            {res.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {res.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#4667D5] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#F9FAFB] border-t border-[#E8EAED] text-[11px] text-[#6B7280] flex items-center justify-between">
          <span>Search records across all active modules</span>
          <span className="font-mono text-[10px]">EDUVANTA v1.0</span>
        </div>
      </div>
    </div>
  );
};
