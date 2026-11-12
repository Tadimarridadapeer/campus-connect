"use client";

import React, { useState, useMemo, useId } from "react";
import { useEdu } from "@/context/EduContext";
import { Student } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
  FileText,
  CreditCard,
  CheckCircle,
  Calendar,
  Award,
  IdCard,
  Printer,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

export default function StudentsPage() {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    promoteStudents,
    currentInstitution,
    attendance,
    examResults,
    studentFees,
  } = useEdu();
  const { toast } = useToast();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");

  // Selection for bulk promote
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [idCardModalOpen, setIdCardModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Active student for edit/delete/profile
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<"overview" | "academics" | "attendance" | "exams" | "fees" | "docs">("overview");

  // Promote form state
  const [targetClassId, setTargetClassId] = useState("");
  const [targetSectionId, setTargetSectionId] = useState("");

  // Student Form State
  interface StudentFormData {
    admissionNo: string;
    rollNo: string;
    firstName: string;
    lastName: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    classId: string;
    sectionId: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    parentRelation: "Father" | "Mother" | "Guardian";
    address: string;
    bloodGroup: string;
    admissionDate: string;
    previousSchool: string;
    medicalNotes: string;
    status: "active" | "transferred" | "graduated";
  }

  const initialForm: StudentFormData = {
    admissionNo: "",
    rollNo: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    dob: "2013-05-15",
    classId: classes[0]?.id || "",
    sectionId: classes[0]?.sections[0]?.id || "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    parentRelation: "Father",
    address: "",
    bloodGroup: "O+",
    admissionDate: "2026-11-12",
    previousSchool: "",
    medicalNotes: "",
    status: "active",
  };
  const [formData, setFormData] = useState<StudentFormData>(initialForm);

  // Filtered students list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.includes(searchTerm);

      const matchClass = selectedClass === "all" || s.classId === selectedClass;
      const matchSection = selectedSection === "all" || s.sectionId === selectedSection;
      const matchStatus = selectedStatus === "all" || s.status === selectedStatus;

      return matchSearch && matchClass && matchSection && matchStatus;
    });
  }, [students, searchTerm, selectedClass, selectedSection, selectedStatus]);

  // Handle Add Student
  const handleOpenAddModal = () => {
    const nextRoll = (students.length + 1).toString().padStart(2, "0");
    const nextAdm = `${currentInstitution.code}/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      ...initialForm,
      admissionNo: nextAdm,
      rollNo: nextRoll,
      classId: classes[2]?.id || classes[0]?.id, // Default Class 8
      sectionId: classes[2]?.sections[0]?.id || classes[0]?.sections[0]?.id,
    });
    setAddModalOpen(true);
  };

  const handleSaveAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const selClass = classes.find((c) => c.id === formData.classId);
    const selSection = selClass?.sections.find((sec) => sec.id === formData.sectionId);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    addStudent({
      institutionId: currentInstitution.id,
      admissionNo: formData.admissionNo,
      rollNo: formData.rollNo,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName,
      gender: formData.gender,
      dob: formData.dob,
      avatar: `https://images.unsplash.com/photo-${formData.gender === "Female" ? "1534528741775-53994a69daeb" : "1507003211169-0a1dd7228f2d"}?w=150&auto=format&fit=crop&q=80`,
      classId: formData.classId,
      className: selClass?.name || "Class 8",
      sectionId: formData.sectionId,
      sectionName: selSection?.name || "A",
      parentId: `par-${Date.now()}`,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail,
      parentRelation: formData.parentRelation,
      address: formData.address,
      bloodGroup: formData.bloodGroup,
      admissionDate: formData.admissionDate,
      previousSchool: formData.previousSchool || "N/A",
      medicalNotes: formData.medicalNotes || "None",
      status: formData.status,
      documents: [
        {
          id: `doc-${Date.now()}`,
          name: "Admission_Form_Signed.pdf",
          type: "PDF",
          uploadDate: formData.admissionDate,
          fileSize: "1.2 MB",
        },
      ],
    });

    setAddModalOpen(false);
    toast("Student Added Successfully", {
      type: "success",
      message: `${fullName} has been enrolled into ${selClass?.name} Section ${selSection?.name}.`,
    });
  };

  // Handle Edit Student
  const handleOpenEdit = (student: Student) => {
    setActiveStudent(student);
    setFormData({
      admissionNo: student.admissionNo,
      rollNo: student.rollNo,
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dob: student.dob,
      classId: student.classId,
      sectionId: student.sectionId,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      parentRelation: student.parentRelation,
      address: student.address,
      bloodGroup: student.bloodGroup,
      admissionDate: student.admissionDate,
      previousSchool: student.previousSchool,
      medicalNotes: student.medicalNotes,
      status: student.status,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;
    const selClass = classes.find((c) => c.id === formData.classId);
    const selSection = selClass?.sections.find((sec) => sec.id === formData.sectionId);
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    updateStudent(activeStudent.id, {
      ...formData,
      fullName,
      className: selClass?.name || activeStudent.className,
      sectionName: selSection?.name || activeStudent.sectionName,
    });

    setEditModalOpen(false);
    toast("Student Updated", {
      type: "success",
      message: `Profile changes for ${fullName} have been saved.`,
    });
  };

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!activeStudent) return;
    deleteStudent(activeStudent.id);
    setDeleteConfirmOpen(false);
    toast("Student Record Removed", {
      type: "info",
      message: `${activeStudent.fullName} has been deleted from the database.`,
    });
  };

  // Handle Bulk Promote
  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0 || !targetClassId || !targetSectionId) return;

    promoteStudents(selectedStudentIds, targetClassId, targetSectionId);
    const targetClass = classes.find((c) => c.id === targetClassId);
    setPromoteModalOpen(false);
    setSelectedStudentIds([]);
    toast("Promotion Successful", {
      type: "success",
      message: `${selectedStudentIds.length} student(s) promoted to ${targetClass?.name}.`,
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Student ID",
      "Admission No",
      "Roll No",
      "Full Name",
      "Gender",
      "Date of Birth",
      "Class",
      "Section",
      "Parent Name",
      "Parent Phone",
      "Parent Email",
      "Address",
      "Blood Group",
      "Status",
    ];

    const rows = filteredStudents.map((s) => [
      s.id,
      s.admissionNo,
      s.rollNo,
      `"${s.fullName}"`,
      s.gender,
      s.dob,
      `"${s.className}"`,
      s.sectionName,
      `"${s.parentName}"`,
      s.parentPhone,
      s.parentEmail,
      `"${s.address}"`,
      s.bloodGroup,
      s.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Students_${currentInstitution.code}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("Export Ready", {
      type: "success",
      message: `Exported ${filteredStudents.length} student records to CSV.`,
    });
  };

  // Simulated CSV Import
  const handleSimulateCSVImport = () => {
    setImportModalOpen(false);
    toast("CSV Import Complete", {
      type: "success",
      message: "Validated 12 student records. No formatting conflicts found.",
    });
  };

  // Active student stats for profile drawer
  const activeStudentAttendance = activeStudent
    ? attendance.filter((a) => a.studentId === activeStudent.id)
    : [];
  const activeStudentResults = activeStudent
    ? examResults.filter((r) => r.studentId === activeStudent.id)
    : [];
  const activeStudentFee = activeStudent
    ? studentFees.find((f) => f.studentId === activeStudent.id)
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Student Directory &amp; Records
            </h1>
            <Badge variant="primary" size="sm">
              {students.length} Total Enrolled
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Complete student lifecycle management, admissions, promotions, and academic histories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedStudentIds.length > 0 && (
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setPromoteModalOpen(true)}
              icon={<TrendingUp className="w-4 h-4" />}
            >
              Promote ({selectedStudentIds.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setImportModalOpen(true)}
            icon={<Upload className="w-3.5 h-3.5" />}
          >
            Import CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddModal}
            icon={<Plus className="w-4 h-4" />}
          >
            New Admission
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student name, admission no, roll #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] outline-hidden"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#374151]">
            <span className="text-[#6B7280]">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection("all");
              }}
              className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#374151]">
            <span className="text-[#6B7280]">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
            >
              <option value="all">All Sections</option>
              <option value="sec-8a">Section A</option>
              <option value="sec-8b">Section B</option>
              <option value="sec-8c">Section C</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#374151]">
            <span className="text-[#6B7280]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="transferred">Transferred</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#6B7280]">
          Showing <span className="font-semibold text-[#202124]">{filteredStudents.length}</span> records
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudentIds.length === filteredStudents.length &&
                      filteredStudents.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudentIds(filteredStudents.map((s) => s.id));
                      } else {
                        setSelectedStudentIds([]);
                      }
                    }}
                    className="rounded border-[#D1D5DB] text-[#4667D5] focus:ring-[#4667D5] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Class &amp; Sec</th>
                <th className="py-3 px-3">Roll #</th>
                <th className="py-3 px-3">Parent / Guardian</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Fee Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#6B7280]">
                    <Users className="w-8 h-8 text-[#D1D5DB] mx-auto mb-2" />
                    <p className="font-semibold text-[#374151]">No students matched your search</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">Try changing filters or adding a new admission.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const feeRec = studentFees.find((f) => f.studentId === st.id);
                  const isSelected = selectedStudentIds.includes(st.id);

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-[#F7F8FA] transition-colors ${
                        isSelected ? "bg-[#EEF2FC]/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds((prev) => [...prev, st.id]);
                            } else {
                              setSelectedStudentIds((prev) =>
                                prev.filter((id) => id !== st.id)
                              );
                            }
                          }}
                          className="rounded border-[#D1D5DB] text-[#4667D5] focus:ring-[#4667D5] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.avatar}
                            alt={st.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-[#E8EAED]"
                          />
                          <div>
                            <button
                              onClick={() => {
                                setActiveStudent(st);
                                setProfileModalOpen(true);
                              }}
                              className="font-bold text-[#202124] hover:text-[#4667D5] hover:underline cursor-pointer block text-left"
                            >
                              {st.fullName}
                            </button>
                            <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
                              {st.gender} • Blood: {st.bloodGroup}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-[#374151]">
                        {st.admissionNo}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#202124]">
                        {st.className} - {st.sectionName}
                      </td>
                      <td className="py-3 px-3 text-[#6B7280]">
                        #{st.rollNo}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-[#202124]">{st.parentName}</p>
                        <span className="text-[10px] text-[#6B7280]">{st.parentRelation}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#6B7280]">
                        {st.parentPhone}
                      </td>
                      <td className="py-3 px-3">
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
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setActiveStudent(st);
                              setProfileModalOpen(true);
                            }}
                            className="p-1.5 rounded-md text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6] transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveStudent(st);
                              setIdCardModalOpen(true);
                            }}
                            className="p-1.5 rounded-md text-[#6B7280] hover:text-[#4667D5] hover:bg-[#EEF2FC] transition-colors"
                            title="Generate Student ID Card"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 rounded-md text-[#6B7280] hover:text-[#4667D5] hover:bg-[#F3F4F6] transition-colors"
                            title="Edit Student"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveStudent(st);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 rounded-md text-[#9CA3AF] hover:text-[#D94B4B] hover:bg-[#FEF2F2] transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="New Student Admission"
        description="Enter primary admission data, class allocation, and parent contacts"
        size="lg"
      >
        <form onSubmit={handleSaveAddStudent} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden focus:border-[#4667D5]"
                placeholder="e.g. Advait"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden focus:border-[#4667D5]"
                placeholder="e.g. Rao"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Admission No *
              </label>
              <input
                type="text"
                required
                value={formData.admissionNo}
                onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Roll Number *
              </label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden bg-white"
              >
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Class *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => {
                  const sel = classes.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    classId: e.target.value,
                    sectionId: sel?.sections[0]?.id || "",
                  });
                }}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Section *
              </label>
              <select
                value={formData.sectionId}
                onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden bg-white"
              >
                {classes
                  .find((c) => c.id === formData.classId)
                  ?.sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name} (Room: {s.roomNumber})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="border-t border-[#E8EAED] pt-3">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
              Parent &amp; Residential Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Parent / Guardian Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
                  placeholder="e.g. Ramesh Rao"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Contact Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden font-mono"
                  placeholder="+91 98450 12345"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
                  placeholder="parent@domain.com"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Residential Address *
              </label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
                placeholder="Street address, apartment name, area, city, pincode"
              />
            </div>
          </div>

          <div className="border-t border-[#E8EAED] pt-3">
            <h4 className="text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">
              Previous School &amp; Medical Notes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Previous School Name
                </label>
                <input
                  type="text"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
                  placeholder="e.g. National Public School"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Medical Notes / Allergies
                </label>
                <input
                  type="text"
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg outline-hidden"
                  placeholder="e.g. Asthmatic, peanut allergy, or None"
                />
              </div>
            </div>
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
              Confirm &amp; Admit Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Student Information"
        size="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Roll Number
              </label>
              <input
                type="text"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Parent Name
              </label>
              <input
                type="text"
                required
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Parent Phone
              </label>
              <input
                type="text"
                required
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="active">Active</option>
                <option value="transferred">Transferred</option>
                <option value="graduated">Graduated</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Residential Address
            </label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
        title="Confirm Student Discharge / Delete"
        message={`Are you sure you want to permanently delete ${activeStudent?.fullName} (${activeStudent?.admissionNo})? All associated fee records and attendance entries will be removed.`}
        confirmText="Yes, Delete Student"
      />

      {/* Promote Students Modal */}
      <Modal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        title={`Promote ${selectedStudentIds.length} Selected Student(s)`}
        description="Select destination academic class and section for the new academic year"
        size="md"
      >
        <form onSubmit={handlePromoteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Target Grade / Class *
            </label>
            <select
              required
              value={targetClassId}
              onChange={(e) => {
                setTargetClassId(e.target.value);
                const sel = classes.find((c) => c.id === e.target.value);
                setTargetSectionId(sel?.sections[0]?.id || "");
              }}
              className="w-full px-3 py-2 text-xs border border-[#E8EAED] rounded-lg bg-white"
            >
              <option value="">Select target class...</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {targetClassId && (
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Target Section *
              </label>
              <select
                required
                value={targetSectionId}
                onChange={(e) => setTargetSectionId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {classes
                  .find((c) => c.id === targetClassId)
                  ?.sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPromoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Promotion
            </Button>
          </div>
        </form>
      </Modal>

      {/* Comprehensive Student Profile Modal with 6 Tabs */}
      <Modal
        isOpen={profileModalOpen && !!activeStudent}
        onClose={() => setProfileModalOpen(false)}
        size="xl"
      >
        {activeStudent && (
          <div className="space-y-5">
            {/* Header Bio Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F7F8FA] border border-[#E8EAED]">
              <div className="flex items-center gap-4">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#202124]">
                      {activeStudent.fullName}
                    </h3>
                    <Badge variant="primary" size="sm">
                      Roll #{activeStudent.rollNo}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {activeStudent.className} • Section {activeStudent.sectionName} • Adm: {activeStudent.admissionNo}
                  </p>
                  <span className="text-[11px] text-[#25845A] font-semibold flex items-center gap-1 mt-0.5">
                    Status: {activeStudent.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setProfileModalOpen(false);
                    setIdCardModalOpen(true);
                  }}
                  icon={<IdCard className="w-3.5 h-3.5" />}
                >
                  Student ID Card
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setProfileModalOpen(false);
                    handleOpenEdit(activeStudent);
                  }}
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1 overflow-x-auto">
              {(
                [
                  { id: "overview", label: "Personal Bio" },
                  { id: "academics", label: "Academic Info" },
                  { id: "attendance", label: "Attendance Record" },
                  { id: "exams", label: "Exam Marks" },
                  { id: "fees", label: "Fee Ledger" },
                  { id: "docs", label: "Documents" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                    profileTab === tab.id
                      ? "bg-[#202124] text-white"
                      : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal Bio */}
            {profileTab === "overview" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Date of Birth</span>
                  <span className="font-semibold text-[#202124]">{formatDate(activeStudent.dob)}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Gender</span>
                  <span className="font-semibold text-[#202124]">{activeStudent.gender}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Blood Group</span>
                  <span className="font-semibold text-[#202124]">{activeStudent.bloodGroup}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Parent / Guardian</span>
                  <span className="font-semibold text-[#202124]">{activeStudent.parentName} ({activeStudent.parentRelation})</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Parent Phone</span>
                  <span className="font-mono font-semibold text-[#202124]">{activeStudent.parentPhone}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Parent Email</span>
                  <span className="text-[#202124]">{activeStudent.parentEmail || "Not provided"}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Permanent Residential Address</span>
                  <span className="font-medium text-[#202124]">{activeStudent.address}</span>
                </div>
                <div className="col-span-2 sm:col-span-3 p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]">
                  <span className="text-[10px] text-[#B45309] font-bold block">Medical Notes &amp; Allergies</span>
                  <span className="text-[#92400E]">{activeStudent.medicalNotes}</span>
                </div>
              </div>
            )}

            {/* Tab 2: Academic Info */}
            {profileTab === "academics" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                    <span className="text-[10px] text-[#6B7280] block">Admission Date</span>
                    <span className="font-semibold text-[#202124]">{formatDate(activeStudent.admissionDate)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                    <span className="text-[10px] text-[#6B7280] block">Previous School</span>
                    <span className="font-semibold text-[#202124]">{activeStudent.previousSchool}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#FAFAFA] border border-[#E8EAED]">
                  <span className="text-[10px] text-[#6B7280] block">Class Teacher</span>
                  <span className="font-semibold text-[#202124]">Dr. Arvind Swaminathan (PGT Mathematics)</span>
                </div>
              </div>
            )}

            {/* Tab 3: Attendance History */}
            {profileTab === "attendance" && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
                  <span className="font-semibold text-[#1E714C]">Overall Recorded Attendance</span>
                  <span className="font-bold text-[#1E714C] text-sm">94.2% (Regular)</span>
                </div>
                <div className="border border-[#E8EAED] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] border-b border-[#E8EAED]">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {activeStudentAttendance.map((a) => (
                        <tr key={a.id}>
                          <td className="py-2 px-3 font-mono">{formatDate(a.date)}</td>
                          <td className="py-2 px-3">
                            <Badge
                              variant={
                                a.status === "present"
                                  ? "success"
                                  : a.status === "late"
                                  ? "warning"
                                  : "danger"
                              }
                              size="sm"
                            >
                              {a.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-[#6B7280]">{a.remarks || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: Exam Marks */}
            {profileTab === "exams" && (
              <div className="space-y-3 text-xs">
                <div className="border border-[#E8EAED] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] border-b border-[#E8EAED]">
                      <tr>
                        <th className="py-2 px-3">Examination</th>
                        <th className="py-2 px-3">Subject</th>
                        <th className="py-2 px-3">Marks</th>
                        <th className="py-2 px-3">Percentage</th>
                        <th className="py-2 px-3">Grade</th>
                        <th className="py-2 px-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F3F4F6]">
                      {activeStudentResults.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-[#9CA3AF]">
                            No published exam results found for this student.
                          </td>
                        </tr>
                      ) : (
                        activeStudentResults.map((res) => (
                          <tr key={res.id}>
                            <td className="py-2 px-3 font-semibold text-[#202124]">
                              Mid-Term Examination 2026
                            </td>
                            <td className="py-2 px-3">
                              {res.examId.includes("mth")
                                ? "Mathematics"
                                : res.examId.includes("sci")
                                ? "Science"
                                : res.examId.includes("eng")
                                ? "English Literature"
                                : "Social Studies"}
                            </td>
                            <td className="py-2 px-3 font-bold text-[#202124]">
                              {res.marksObtained} / {res.maxMarks}
                            </td>
                            <td className="py-2 px-3 font-medium">
                              {res.percentage}%
                            </td>
                            <td className="py-2 px-3">
                              <Badge variant="primary" size="sm">
                                {res.grade}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-[#6B7280] line-clamp-1">
                              {res.remarks || "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 5: Fee Ledger */}
            {profileTab === "fees" && (
              <div className="space-y-3 text-xs">
                {activeStudentFee ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 p-3 bg-[#F7F8FA] rounded-lg border border-[#E8EAED]">
                      <div>
                        <span className="text-[10px] text-[#6B7280] block">Total Annual Fee</span>
                        <span className="font-bold text-sm text-[#202124]">{formatCurrency(activeStudentFee.totalFee)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6B7280] block">Paid Amount</span>
                        <span className="font-bold text-sm text-[#25845A]">{formatCurrency(activeStudentFee.paidAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6B7280] block">Outstanding Due</span>
                        <span className="font-bold text-sm text-[#D94B4B]">{formatCurrency(activeStudentFee.dueAmount)}</span>
                      </div>
                    </div>

                    <h5 className="font-bold text-[#202124] text-xs pt-1">Payment Receipts</h5>
                    <div className="border border-[#E8EAED] rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F9FAFB] text-[#6B7280] border-b border-[#E8EAED]">
                          <tr>
                            <th className="py-2 px-3">Receipt #</th>
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Mode</th>
                            <th className="py-2 px-3">Fee Head</th>
                            <th className="py-2 px-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {activeStudentFee.transactions.map((tx) => (
                            <tr key={tx.id}>
                              <td className="py-2 px-3 font-mono font-semibold text-[#4667D5]">{tx.receiptNo}</td>
                              <td className="py-2 px-3">{formatDate(tx.paymentDate)}</td>
                              <td className="py-2 px-3">{tx.paymentMethod}</td>
                              <td className="py-2 px-3 text-[#6B7280]">{tx.feeHead}</td>
                              <td className="py-2 px-3 text-right font-bold text-[#25845A]">
                                {formatCurrency(tx.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-center py-6 text-[#9CA3AF]">No fee record attached.</p>
                )}
              </div>
            )}

            {/* Tab 6: Documents */}
            {profileTab === "docs" && (
              <div className="space-y-2.5 text-xs">
                {activeStudent.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#E8EAED] bg-[#FAFAFA]"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-[#4667D5]" />
                      <div>
                        <p className="font-semibold text-[#202124]">{doc.name}</p>
                        <span className="text-[10px] text-[#6B7280]">
                          Uploaded: {formatDate(doc.uploadDate)} • Size: {doc.fileSize}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="xs" icon={<Download className="w-3.5 h-3.5" />}>
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Official Printable Student ID Card Modal */}
      <Modal
        isOpen={idCardModalOpen && !!activeStudent}
        onClose={() => setIdCardModalOpen(false)}
        title="Official Student Identity Card"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#6B7280]">
              Valid for Academic Year {currentInstitution.academicYear}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIdCardModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print ID Card
              </Button>
            </div>
          </div>
        }
      >
        {activeStudent && (
          <div className="flex justify-center p-2">
            <div className="w-80 rounded-2xl overflow-hidden border-2 border-[#202124] shadow-xl bg-white text-[#202124]">
              {/* Card Header */}
              <div className="bg-[#202124] text-white p-3 text-center">
                <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">
                  {currentInstitution.affiliationNo}
                </p>
                <h4 className="text-xs font-bold leading-tight mt-0.5">
                  {currentInstitution.name}
                </h4>
                <p className="text-[9px] text-gray-300">
                  {currentInstitution.city}, {currentInstitution.state}
                </p>
              </div>

              {/* Photo & Info */}
              <div className="p-4 flex flex-col items-center text-center">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.fullName}
                  className="w-20 h-20 rounded-xl object-cover border-2 border-[#E8EAED] shadow-xs mb-2"
                />
                <h3 className="text-sm font-bold text-[#202124]">
                  {activeStudent.fullName}
                </h3>
                <p className="text-xs font-semibold text-[#4667D5]">
                  {activeStudent.className} - Section {activeStudent.sectionName}
                </p>

                <div className="w-full mt-3 pt-3 border-t border-[#F3F4F6] text-[11px] space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Admission No:</span>
                    <span className="font-mono font-bold">{activeStudent.admissionNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Roll Number:</span>
                    <span className="font-bold">#{activeStudent.rollNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Blood Group:</span>
                    <span className="font-bold text-[#D94B4B]">{activeStudent.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Emergency Contact:</span>
                    <span className="font-mono">{activeStudent.parentPhone}</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-4 pt-2 border-t border-[#E8EAED] w-full flex flex-col items-center">
                  <div className="font-mono text-xl tracking-[0.25em] text-[#202124] select-none scale-y-125">
                    ||| | |||| | ||| |||| |
                  </div>
                  <span className="font-mono text-[9px] text-[#6B7280] mt-1">
                    {activeStudent.admissionNo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* CSV Import Modal Simulation */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import Students from CSV"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSimulateCSVImport}>
              Upload &amp; Process Data
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 border-2 border-dashed border-[#D1D5DB] rounded-xl text-center hover:border-[#4667D5] transition-colors cursor-pointer bg-[#FAFAFA]">
            <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
            <p className="font-semibold text-[#202124]">Choose a CSV file or drag and drop</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">
              Supports standard CBSE/State board CSV format (UTF-8)
            </p>
            <input type="file" className="hidden" />
          </div>

          <div className="p-3 bg-[#EEF2FC] rounded-lg border border-[#D6E0FA] text-[#1E3A8A]">
            <p className="font-bold">Required CSV Columns:</p>
            <p className="text-[11px] font-mono mt-1">
              AdmissionNo, FirstName, LastName, Gender, DOB, Class, Section, ParentName, ParentPhone, Address
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
