"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  BookOpen,
  Plus,
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  Building,
  CheckCircle,
  Award,
} from "lucide-react";

export default function AcademicsPage() {
  const {
    classes,
    subjects,
    teachers,
    addClass,
    addSection,
    addSubject,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"classes" | "subjects" | "grading">("classes");

  // Modals
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);

  const [selectedClassIdForSection, setSelectedClassIdForSection] = useState(classes[0]?.id || "");

  // Form states
  const [newClassName, setNewClassName] = useState("");
  const [newGradeLevel, setNewGradeLevel] = useState(11);
  const [newClassType, setNewClassType] = useState<"school" | "college">(currentInstitution.type);
  const [newDept, setNewDept] = useState("");
  const [newSemester, setNewSemester] = useState(1);

  const [sectionName, setSectionName] = useState("A");
  const [sectionTeacherId, setSectionTeacherId] = useState(teachers[0]?.id || "");
  const [sectionRoom, setSectionRoom] = useState("Room 601");
  const [sectionCapacity, setSectionCapacity] = useState(40);

  const [subName, setSubName] = useState("");
  const [subCode, setSubCode] = useState("");
  const [subCredits, setSubCredits] = useState(5);
  const [subDept, setSubDept] = useState("Academics");

  // Handle Add Class
  const handleSaveAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    addClass({
      institutionId: currentInstitution.id,
      name: newClassName,
      gradeLevel: newGradeLevel,
      type: newClassType,
      department: newDept || undefined,
      semester: newClassType === "college" ? newSemester : undefined,
      sections: [
        {
          id: `sec-${Date.now()}`,
          name: "A",
          classId: `cls-${Date.now()}`,
          classTeacherId: teachers[0]?.id || "",
          classTeacherName: teachers[0]?.name || "Staff",
          roomNumber: "Room 101",
          capacity: 40,
        },
      ],
    });

    setAddClassOpen(false);
    setNewClassName("");
    toast("Class Created", {
      type: "success",
      message: `${newClassName} has been added with Section A initialized.`,
    });
  };

  // Handle Add Section
  const handleSaveAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    const tch = teachers.find((t) => t.id === sectionTeacherId);
    addSection(selectedClassIdForSection, {
      name: sectionName,
      classTeacherId: sectionTeacherId,
      classTeacherName: tch?.name || "Assigned Faculty",
      roomNumber: sectionRoom,
      capacity: sectionCapacity,
    });

    setAddSectionOpen(false);
    toast("Section Added", {
      type: "success",
      message: `Section ${sectionName} added to class with teacher ${tch?.name}.`,
    });
  };

  // Handle Add Subject
  const handleSaveAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCode) return;

    addSubject({
      institutionId: currentInstitution.id,
      name: subName,
      code: subCode,
      department: subDept,
      creditsOrPeriods: subCredits,
    });

    setAddSubjectOpen(false);
    setSubName("");
    setSubCode("");
    toast("Subject Added", {
      type: "success",
      message: `${subName} (${subCode}) registered with ${subCredits} periods/week.`,
    });
  };

  // Filter classes for current institution
  const institutionClasses = classes.filter((c) => c.institutionId === currentInstitution.id);
  const institutionSubjects = subjects.filter((s) => s.institutionId === currentInstitution.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Academic Structure &amp; Curriculum Management
            </h1>
            <Badge variant="primary" size="sm">
              {currentInstitution.type === "college" ? "Higher Education Model" : "K-12 School Model"}
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Configure classes, sections, department cohorts, subjects, and grading systems
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "classes" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddClassOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add {currentInstitution.type === "college" ? "Course / Class" : "Class"}
            </Button>
          ) : activeTab === "subjects" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setAddSubjectOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Subject
            </Button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1">
        <button
          onClick={() => setActiveTab("classes")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "classes"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Layers className="w-4 h-4" />
          Classes &amp; Sections ({institutionClasses.length})
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "subjects"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Subjects &amp; Credits ({institutionSubjects.length})
        </button>

        <button
          onClick={() => setActiveTab("grading")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "grading"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          <Award className="w-4 h-4" />
          Grading Scale Config
        </button>
      </div>

      {/* Tab 1: Classes & Sections */}
      {activeTab === "classes" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutionClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs hover:border-[#4667D5]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#202124]">
                        {cls.name}
                      </h3>
                      {cls.department && (
                        <p className="text-xs text-[#4667D5] font-semibold mt-0.5">
                          {cls.department} (Semester {cls.semester})
                        </p>
                      )}
                      <span className="text-[11px] text-[#6B7280]">
                        Grade Level: {cls.gradeLevel}
                      </span>
                    </div>

                    <Badge variant="primary" size="sm">
                      {cls.sections.length} Sections
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                      Configured Sections:
                    </h4>
                    {cls.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-2.5 rounded-lg bg-[#F7F8FA] border border-[#E8EAED] text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-[#202124]">
                            Section {sec.name}
                          </p>
                          <span className="text-[10px] text-[#6B7280]">
                            Class Teacher: {sec.classTeacherName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-mono font-medium block">
                            {sec.roomNumber}
                          </span>
                          <span className="text-[10px] text-[#6B7280]">
                            Cap: {sec.capacity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex justify-end">
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      setSelectedClassIdForSection(cls.id);
                      setAddSectionOpen(true);
                    }}
                    icon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Section
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Subjects & Credits */}
      {activeTab === "subjects" && (
        <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                <tr>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-3">Subject Code</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Weekly Periods / Credits</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {institutionSubjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#F7F8FA] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#202124] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#4667D5]" />
                      {sub.name}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#4667D5]">
                      {sub.code}
                    </td>
                    <td className="py-3 px-3 text-[#374151]">
                      {sub.department || "Academic General"}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#202124]">
                      {sub.creditsOrPeriods} Periods / Week
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="success" size="sm">
                        ACTIVE
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Grading Scale Configuration */}
      {activeTab === "grading" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#202124]">
                  Active Grading Scale (CBSE 9-Point Scheme)
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Standard evaluation benchmarks used across report cards
                </p>
              </div>
              <Badge variant="primary" size="sm">
                Default
              </Badge>
            </div>

            <div className="border border-[#E8EAED] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3">Score Range</th>
                    <th className="py-2.5 px-3">Grade Point</th>
                    <th className="py-2.5 px-3">Performance Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {[
                    { grade: "A1", range: "91% – 100%", gpa: "10.0", remark: "Outstanding" },
                    { grade: "A2", range: "81% – 90%", gpa: "9.0", remark: "Excellent" },
                    { grade: "B1", range: "71% – 80%", gpa: "8.0", remark: "Very Good" },
                    { grade: "B2", range: "61% – 70%", gpa: "7.0", remark: "Good" },
                    { grade: "C1", range: "51% – 60%", gpa: "6.0", remark: "Fair" },
                    { grade: "C2", range: "41% – 50%", gpa: "5.0", remark: "Average" },
                    { grade: "D", range: "33% – 40%", gpa: "4.0", remark: "Pass Threshold" },
                    { grade: "E", range: "Below 33%", gpa: "0.0", remark: "Needs Remedial Guidance" },
                  ].map((row) => (
                    <tr key={row.grade} className="hover:bg-[#F7F8FA]">
                      <td className="py-2 px-3 font-bold text-[#4667D5]">{row.grade}</td>
                      <td className="py-2 px-3 font-medium">{row.range}</td>
                      <td className="py-2 px-3 font-mono">{row.gpa}</td>
                      <td className="py-2 px-3 text-[#6B7280]">{row.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#202124]">
                Higher Education / College GPA Scale
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Configured for Horizon Degree College (Semester SGPA / CGPA Calculation)
              </p>

              <div className="mt-4 p-4 rounded-xl bg-[#F7F8FA] border border-[#E8EAED] space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#25845A]" />
                  <span>Supports 10-Point UGC Choice Based Credit System (CBCS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#25845A]" />
                  <span>Semester Grade Point Average (SGPA) calculation enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#25845A]" />
                  <span>Cumulative Grade Point Average (CGPA) transcript generation</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#F3F4F6] text-right">
              <Button variant="outline" size="sm" onClick={() => toast("Scale Configuration Saved", { type: "success" })}>
                Save Grading System
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      <Modal
        isOpen={addClassOpen}
        onClose={() => setAddClassOpen(false)}
        title="Create New Academic Class"
        size="md"
      >
        <form onSubmit={handleSaveAddClass} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Class / Course Name *
            </label>
            <input
              type="text"
              required
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Class 11 (Science) or B.Tech CSE"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Grade / Year Level *
              </label>
              <input
                type="number"
                required
                value={newGradeLevel}
                onChange={(e) => setNewGradeLevel(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Institution Structure *
              </label>
              <select
                value={newClassType}
                onChange={(e) => setNewClassType(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="school">School (K-12)</option>
                <option value="college">College (Higher Ed)</option>
              </select>
            </div>
          </div>

          {newClassType === "college" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Semester
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={newSemester}
                  onChange={(e) => setNewSemester(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddClassOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Class
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        title="Add Section to Class"
        size="sm"
      >
        <form onSubmit={handleSaveAddSection} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Section Name *
              </label>
              <input
                type="text"
                required
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                placeholder="e.g. D"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Room Number *
              </label>
              <input
                type="text"
                required
                value={sectionRoom}
                onChange={(e) => setSectionRoom(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Class Teacher *
            </label>
            <select
              value={sectionTeacherId}
              onChange={(e) => setSectionTeacherId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Capacity
            </label>
            <input
              type="number"
              value={sectionCapacity}
              onChange={(e) => setSectionCapacity(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddSectionOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Subject Modal */}
      <Modal
        isOpen={addSubjectOpen}
        onClose={() => setAddSubjectOpen(false)}
        title="Register New Subject"
        size="sm"
      >
        <form onSubmit={handleSaveAddSubject} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Artificial Intelligence"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={subCode}
                onChange={(e) => setSubCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono uppercase"
                placeholder="AI-801"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Periods / Week *
              </label>
              <input
                type="number"
                min={1}
                max={15}
                required
                value={subCredits}
                onChange={(e) => setSubCredits(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddSubjectOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Register Subject
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
