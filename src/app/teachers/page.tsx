"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { Teacher } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Sparkles,
  Download,
} from "lucide-react";

export default function TeachersPage() {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    currentInstitution,
    timetable,
  } = useEdu();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [activeTeacher, setActiveTeacher] = useState<Teacher | null>(null);

  // Form State
  const initialForm = {
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    qualification: "",
    department: "Mathematics",
    designation: "PGT Faculty",
    joiningDate: "2026-11-12",
    assignedSubjects: "Mathematics",
  };
  const [formData, setFormData] = useState(initialForm);

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedSubjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDept = selectedDept === "all" || t.department === selectedDept;

      return matchSearch && matchDept;
    });
  }, [teachers, searchTerm, selectedDept]);

  // Departments list
  const departments = Array.from(new Set(teachers.map((t) => t.department)));

  const handleOpenAdd = () => {
    const nextEmp = `EMP-${currentInstitution.code}-${1000 + teachers.length + 1}`;
    setFormData({
      ...initialForm,
      employeeId: nextEmp,
    });
    setAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const subjs = formData.assignedSubjects.split(",").map((s) => s.trim()).filter(Boolean);

    addTeacher({
      institutionId: currentInstitution.id,
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      qualification: formData.qualification,
      department: formData.department,
      designation: formData.designation,
      joiningDate: formData.joiningDate,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      assignedSubjects: subjs,
      assignedClasses: [
        {
          classId: "cls-8",
          className: "Class 8",
          sectionId: "sec-8a",
          sectionName: "A",
          subject: subjs[0] || "General Studies",
        },
      ],
    });

    setAddModalOpen(false);
    toast("Faculty Appointed", {
      type: "success",
      message: `${formData.name} added to ${formData.department} department.`,
    });
  };

  const handleOpenEdit = (t: Teacher) => {
    setActiveTeacher(t);
    setFormData({
      employeeId: t.employeeId,
      name: t.name,
      email: t.email,
      phone: t.phone,
      qualification: t.qualification,
      department: t.department,
      designation: t.designation,
      joiningDate: t.joiningDate,
      assignedSubjects: t.assignedSubjects.join(", "),
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTeacher) return;

    const subjs = formData.assignedSubjects.split(",").map((s) => s.trim()).filter(Boolean);
    updateTeacher(activeTeacher.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      qualification: formData.qualification,
      department: formData.department,
      designation: formData.designation,
      joiningDate: formData.joiningDate,
      assignedSubjects: subjs,
    });

    setEditModalOpen(false);
    toast("Teacher Profile Updated", {
      type: "success",
      message: `Changes for ${formData.name} saved successfully.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!activeTeacher) return;
    deleteTeacher(activeTeacher.id);
    setDeleteConfirmOpen(false);
    toast("Faculty Record Removed", {
      type: "info",
      message: `${activeTeacher.name} removed from faculty roster.`,
    });
  };

  // Timetable slots for active teacher in modal
  const activeTeacherSchedule = activeTeacher
    ? timetable.filter(
        (slot) =>
          slot.teacherId === activeTeacher.id ||
          slot.teacherName.toLowerCase().includes(activeTeacher.name.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Teacher Directory &amp; Profiles
            </h1>
            <Badge variant="primary" size="sm">
              {teachers.length} Active Faculty
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Faculty staffing, subject assignments, designations, and class teacherships
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Teacher
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search faculty by name, employee ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#374151]">
            <span className="text-[#6B7280]">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-[#6B7280]">
          Showing <span className="font-semibold text-[#202124]">{filteredTeachers.length}</span> faculty members
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs hover:border-[#4667D5]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E8EAED]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#202124] leading-tight">
                      {t.name}
                    </h3>
                    <p className="text-[11px] text-[#4667D5] font-semibold mt-0.5">
                      {t.designation}
                    </p>
                    <span className="text-[10px] font-mono text-[#6B7280]">
                      {t.employeeId}
                    </span>
                  </div>
                </div>

                <Badge variant="primary" size="sm">
                  {t.department}
                </Badge>
              </div>

              {t.isClassTeacherOf && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Class Teacher: {t.isClassTeacherOf.className} - {t.isClassTeacherOf.sectionName}
                </div>
              )}

              <div className="mt-3.5 space-y-1.5 text-xs text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span>Subjects: <strong className="text-[#202124]">{t.assignedSubjects.join(", ")}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span className="font-mono">{t.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-[#9CA3AF]" />
                  <span className="truncate">{t.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#F3F4F6] flex items-center justify-between">
              <span className="text-[10px] text-[#9CA3AF]">
                Joined: {formatDate(t.joiningDate)}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActiveTeacher(t);
                    setProfileModalOpen(true);
                  }}
                  className="p-1.5 rounded-md text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6] transition-colors"
                  title="View Full Profile"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-md text-[#6B7280] hover:text-[#4667D5] hover:bg-[#F3F4F6] transition-colors"
                  title="Edit Teacher"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveTeacher(t);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#D94B4B] hover:bg-[#FEF2F2] transition-colors"
                  title="Delete Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Appoint New Faculty Member"
        size="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                placeholder="Dr. / Mr. / Ms."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Languages & Humanities">Languages &amp; Humanities</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Computer Applications">Computer Applications</option>
                <option value="Physical Education">Physical Education</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Designation *
              </label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                placeholder="Senior PGT / TGT"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Qualifications &amp; Degrees
            </label>
            <input
              type="text"
              required
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. M.Sc. Mathematics, B.Ed (Delhi Univ)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Assigned Subjects (comma separated)
            </label>
            <input
              type="text"
              required
              value={formData.assignedSubjects}
              onChange={(e) => setFormData({ ...formData, assignedSubjects: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="Mathematics, Statistics"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Appointment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Faculty Profile"
        size="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Designation</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">Qualifications</label>
            <input
              type="text"
              required
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Faculty Member"
        message={`Are you sure you want to remove ${activeTeacher?.name} (${activeTeacher?.employeeId}) from active faculty?`}
      />

      {/* Full Teacher Profile Modal */}
      <Modal
        isOpen={profileModalOpen && !!activeTeacher}
        onClose={() => setProfileModalOpen(false)}
        size="lg"
      >
        {activeTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#F7F8FA] rounded-xl border border-[#E8EAED]">
              <img
                src={activeTeacher.avatar}
                alt={activeTeacher.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-xs"
              />
              <div>
                <h3 className="text-base font-bold text-[#202124]">{activeTeacher.name}</h3>
                <p className="text-xs text-[#4667D5] font-semibold">{activeTeacher.designation}</p>
                <p className="text-[11px] text-[#6B7280]">{activeTeacher.qualification}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="primary" size="sm">{activeTeacher.department}</Badge>
                  <span className="text-[11px] font-mono text-[#6B7280]">{activeTeacher.employeeId}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#E8EAED]">
                <span className="text-[#6B7280] block text-[10px]">Contact Phone:</span>
                <span className="font-mono font-semibold text-[#202124]">{activeTeacher.phone}</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#E8EAED]">
                <span className="text-[#6B7280] block text-[10px]">Official Email:</span>
                <span className="text-[#202124]">{activeTeacher.email}</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#E8EAED]">
                <span className="text-[#6B7280] block text-[10px]">Assigned Subjects:</span>
                <span className="font-semibold text-[#202124]">{activeTeacher.assignedSubjects.join(", ")}</span>
              </div>
              <div className="p-3 bg-[#FAFAFA] rounded-lg border border-[#E8EAED]">
                <span className="text-[#6B7280] block text-[10px]">Date of Joining:</span>
                <span className="font-semibold text-[#202124]">{formatDate(activeTeacher.joiningDate)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
                Active Weekly Teaching Periods ({activeTeacherSchedule.length} Slots)
              </h4>
              <div className="border border-[#E8EAED] rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9FAFB] text-[#6B7280] border-b border-[#E8EAED]">
                    <tr>
                      <th className="py-2 px-3">Day</th>
                      <th className="py-2 px-3">Period</th>
                      <th className="py-2 px-3">Class &amp; Sec</th>
                      <th className="py-2 px-3">Room</th>
                      <th className="py-2 px-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {activeTeacherSchedule.map((slot) => (
                      <tr key={slot.id}>
                        <td className="py-2 px-3 font-semibold">{slot.day}</td>
                        <td className="py-2 px-3">P{slot.periodNumber}</td>
                        <td className="py-2 px-3">{slot.className} - {slot.sectionName}</td>
                        <td className="py-2 px-3">{slot.roomNumber}</td>
                        <td className="py-2 px-3 font-mono">{slot.startTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
