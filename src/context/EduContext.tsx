"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AcademicClass,
  Announcement,
  Assignment,
  AssignmentSubmission,
  AttendanceRecord,
  AttendanceStatus,
  Certificate,
  CurriculumChapter,
  DailyTeachingLog,
  Examination,
  ExamResult,
  FeeStructure,
  Institution,
  NotificationItem,
  Parent,
  Student,
  StudentFeeRecord,
  Subject,
  Teacher,
  TeacherAttendanceRecord,
  TimetableSlot,
  User,
  UserRole,
} from "@/types";
import {
  initialAnnouncements,
  initialAssignments,
  initialAttendance,
  initialCertificates,
  initialClasses,
  initialCurriculum,
  initialDailyLogs,
  initialExaminations,
  initialExamResults,
  initialFeeStructures,
  initialInstitutions,
  initialNotifications,
  initialParents,
  initialStudentFees,
  initialStudents,
  initialSubjects,
  initialSubmissions,
  initialTeacherAttendance,
  initialTeachers,
  initialTimetable,
  initialUsers,
} from "@/lib/mockData";

interface EduContextType {
  currentUser: User | null;
  currentInstitution: Institution;
  allInstitutions: Institution[];
  users: User[];
  students: Student[];
  teachers: Teacher[];
  parents: Parent[];
  classes: AcademicClass[];
  subjects: Subject[];
  timetable: TimetableSlot[];
  attendance: AttendanceRecord[];
  teacherAttendance: TeacherAttendanceRecord[];
  examinations: Examination[];
  examResults: ExamResult[];
  feeStructures: FeeStructure[];
  studentFees: StudentFeeRecord[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  curriculum: CurriculumChapter[];
  dailyLogs: DailyTeachingLog[];
  certificates: Certificate[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;

  // Auth & tenant actions
  login: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchInstitution: (institutionId: string) => void;

  // Student CRUD
  addStudent: (student: Omit<Student, "id">) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  promoteStudents: (studentIds: string[], targetClassId: string, targetSectionId: string) => void;

  // Teacher CRUD
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Academic Actions
  addClass: (newClass: Omit<AcademicClass, "id">) => void;
  addSection: (classId: string, section: { name: string; classTeacherId: string; classTeacherName: string; roomNumber: string; capacity: number }) => void;
  addSubject: (subject: Omit<Subject, "id">) => void;

  // Timetable
  saveTimetableSlot: (slot: Omit<TimetableSlot, "id">) => { success: boolean; conflictMessage?: string };
  deleteTimetableSlot: (id: string) => void;

  // Attendance
  markAttendance: (records: { studentId: string; studentName: string; rollNo: string; classId: string; sectionId: string; date: string; status: AttendanceStatus; remarks?: string }[]) => void;
  markTeacherAttendance: (records: { teacherId: string; teacherName: string; employeeId: string; date: string; status: "present" | "absent" | "late" | "leave"; remarks?: string }[]) => void;

  // Examinations & Results
  createExamination: (exam: Omit<Examination, "id">) => void;
  updateExamStatus: (examId: string, status: Examination["status"]) => void;
  saveExamMarks: (results: Omit<ExamResult, "id">[]) => void;

  // Fees
  recordFeePayment: (studentId: string, amount: number, paymentMethod: "UPI" | "Net Banking" | "Cash" | "Cheque" | "Debit Card", feeHead: string, remarks?: string) => string;

  // Assignments
  createAssignment: (asg: Omit<Assignment, "id">) => void;
  submitAssignment: (asgId: string, studentId: string, studentName: string, content: string, fileName?: string) => void;
  gradeSubmission: (submissionId: string, marks: number, feedback: string) => void;

  // Curriculum & Logs
  updateChapterStatus: (chapterId: string, status: CurriculumChapter["status"], actualCompletionDate?: string) => void;
  addDailyTeachingLog: (log: Omit<DailyTeachingLog, "id">) => void;

  // Certificates
  issueCertificate: (cert: Omit<Certificate, "id" | "certificateNumber">) => Certificate;

  // Announcements & Notifications
  createAnnouncement: (ann: Omit<Announcement, "id" | "createdAt">) => void;
  deleteAnnouncement: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // System
  updateInstitutionSettings: (updates: Partial<Institution>) => void;
  resetAllData: () => void;
}

const EduContext = createContext<EduContextType | undefined>(undefined);

const STORAGE_KEY = "eduvanta_state_v1";

export function EduProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  // States
  const [allInstitutions, setAllInstitutions] = useState<Institution[]>(initialInstitutions);
  const [currentInstitutionId, setCurrentInstitutionId] = useState<string>("inst-greenfield");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Default Super Admin
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [parents, setParents] = useState<Parent[]>(initialParents);
  const [classes, setClasses] = useState<AcademicClass[]>(initialClasses);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(initialTimetable);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>(initialTeacherAttendance);
  const [examinations, setExaminations] = useState<Examination[]>(initialExaminations);
  const [examResults, setExamResults] = useState<ExamResult[]>(initialExamResults);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFeeStructures);
  const [studentFees, setStudentFees] = useState<StudentFeeRecord[]>(initialStudentFees);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(initialSubmissions);
  const [curriculum, setCurriculum] = useState<CurriculumChapter[]>(initialCurriculum);
  const [dailyLogs, setDailyLogs] = useState<DailyTeachingLog[]>(initialDailyLogs);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedChildId, setSelectedChildId] = useState<string>("stu-1"); // Default child for parent demo

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.institutions) setAllInstitutions(parsed.institutions);
        if (parsed.currentInstitutionId) setCurrentInstitutionId(parsed.currentInstitutionId);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.parents) setParents(parsed.parents);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.timetable) setTimetable(parsed.timetable);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.teacherAttendance) setTeacherAttendance(parsed.teacherAttendance);
        if (parsed.examinations) setExaminations(parsed.examinations);
        if (parsed.examResults) setExamResults(parsed.examResults);
        if (parsed.feeStructures) setFeeStructures(parsed.feeStructures);
        if (parsed.studentFees) setStudentFees(parsed.studentFees);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.submissions) setSubmissions(parsed.submissions);
        if (parsed.curriculum) setCurriculum(parsed.curriculum);
        if (parsed.dailyLogs) setDailyLogs(parsed.dailyLogs);
        if (parsed.certificates) setCertificates(parsed.certificates);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.selectedChildId) setSelectedChildId(parsed.selectedChildId);
      }
    } catch (e) {
      console.error("Failed to load Eduvanta state from storage:", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const stateToSave = {
        institutions: allInstitutions,
        currentInstitutionId,
        users,
        currentUser,
        students,
        teachers,
        parents,
        classes,
        subjects,
        timetable,
        attendance,
        teacherAttendance,
        examinations,
        examResults,
        feeStructures,
        studentFees,
        assignments,
        submissions,
        curriculum,
        dailyLogs,
        certificates,
        announcements,
        notifications,
        selectedChildId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save Eduvanta state to storage:", e);
    }
  }, [
    isInitialized,
    allInstitutions,
    currentInstitutionId,
    users,
    currentUser,
    students,
    teachers,
    parents,
    classes,
    subjects,
    timetable,
    attendance,
    teacherAttendance,
    examinations,
    examResults,
    feeStructures,
    studentFees,
    assignments,
    submissions,
    curriculum,
    dailyLogs,
    certificates,
    announcements,
    notifications,
    selectedChildId,
  ]);

  const currentInstitution =
    allInstitutions.find((i) => i.id === currentInstitutionId) || allInstitutions[0];

  // Auth actions
  const login = (email: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setCurrentInstitutionId(found.institutionId);
      if (found.role === "parent") {
        const par = parents.find((p) => p.email.toLowerCase() === email.toLowerCase());
        if (par && par.childrenIds.length > 0) {
          setSelectedChildId(par.childrenIds[0]);
        }
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setCurrentInstitutionId(targetUser.institutionId);
      if (role === "parent") {
        const par = parents.find((p) => p.id === targetUser.parentId);
        if (par && par.childrenIds.length > 0) {
          setSelectedChildId(par.childrenIds[0]);
        }
      }
    }
  };

  const switchInstitution = (institutionId: string) => {
    setCurrentInstitutionId(institutionId);
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, "id">) => {
    const newId = `stu-${Date.now()}`;
    const newStudent: Student = { ...studentData, id: newId };
    setStudents((prev) => [newStudent, ...prev]);

    // Create corresponding fee record
    const newFeeRecord: StudentFeeRecord = {
      id: `sfr-${newId}`,
      institutionId: studentData.institutionId,
      studentId: newId,
      studentName: studentData.fullName,
      admissionNo: studentData.admissionNo,
      classId: studentData.classId,
      className: studentData.className,
      sectionName: studentData.sectionName,
      totalFee: 115000,
      discountAmount: 0,
      paidAmount: 0,
      dueAmount: 115000,
      dueDate: "2026-12-31",
      status: "pending",
      transactions: [],
    };
    setStudentFees((prev) => [newFeeRecord, ...prev]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setStudentFees((prev) => prev.filter((f) => f.studentId !== id));
  };

  const promoteStudents = (
    studentIds: string[],
    targetClassId: string,
    targetSectionId: string
  ) => {
    const targetClass = classes.find((c) => c.id === targetClassId);
    const targetSection = targetClass?.sections.find((s) => s.id === targetSectionId);
    if (!targetClass || !targetSection) return;

    setStudents((prev) =>
      prev.map((s) =>
        studentIds.includes(s.id)
          ? {
              ...s,
              classId: targetClass.id,
              className: targetClass.name,
              sectionId: targetSection.id,
              sectionName: targetSection.name,
            }
          : s
      )
    );
  };

  // Teacher CRUD
  const addTeacher = (teacherData: Omit<Teacher, "id">) => {
    const newId = `tch-${Date.now()}`;
    const newTeacher: Teacher = { ...teacherData, id: newId };
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Academic Actions
  const addClass = (classData: Omit<AcademicClass, "id">) => {
    const newClass: AcademicClass = {
      ...classData,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const addSection = (
    classId: string,
    sectionData: {
      name: string;
      classTeacherId: string;
      classTeacherName: string;
      roomNumber: string;
      capacity: number;
    }
  ) => {
    const newSectionId = `sec-${Date.now()}`;
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              sections: [
                ...c.sections,
                { ...sectionData, id: newSectionId, classId },
              ],
            }
          : c
      )
    );
  };

  const addSubject = (subjectData: Omit<Subject, "id">) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  // Timetable
  const saveTimetableSlot = (
    slotData: Omit<TimetableSlot, "id">
  ): { success: boolean; conflictMessage?: string } => {
    // Conflict detection: Is the teacher already booked in the same period on the same day?
    if (slotData.teacherId) {
      const teacherConflict = timetable.find(
        (t) =>
          t.day === slotData.day &&
          t.periodNumber === slotData.periodNumber &&
          t.teacherId === slotData.teacherId &&
          !(t.classId === slotData.classId && t.sectionId === slotData.sectionId)
      );
      if (teacherConflict) {
        return {
          success: false,
          conflictMessage: `Conflict: Teacher ${slotData.teacherName} is already assigned to ${teacherConflict.className} - ${teacherConflict.sectionName} in Period ${slotData.periodNumber} on ${slotData.day}.`,
        };
      }
    }

    // Room conflict detection:
    if (slotData.roomNumber && slotData.roomNumber !== "-") {
      const roomConflict = timetable.find(
        (t) =>
          t.day === slotData.day &&
          t.periodNumber === slotData.periodNumber &&
          t.roomNumber.toLowerCase() === slotData.roomNumber.toLowerCase() &&
          !(t.classId === slotData.classId && t.sectionId === slotData.sectionId)
      );
      if (roomConflict) {
        return {
          success: false,
          conflictMessage: `Conflict: ${slotData.roomNumber} is already occupied by ${roomConflict.className} (${roomConflict.subjectName}) in Period ${slotData.periodNumber}.`,
        };
      }
    }

    // Replace or add slot
    setTimetable((prev) => {
      const filtered = prev.filter(
        (t) =>
          !(
            t.classId === slotData.classId &&
            t.sectionId === slotData.sectionId &&
            t.day === slotData.day &&
            t.periodNumber === slotData.periodNumber
          )
      );
      return [...filtered, { ...slotData, id: `tt-${Date.now()}` }];
    });

    return { success: true };
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  // Attendance
  const markAttendance = (
    records: {
      studentId: string;
      studentName: string;
      rollNo: string;
      classId: string;
      sectionId: string;
      date: string;
      status: AttendanceStatus;
      remarks?: string;
    }[]
  ) => {
    setAttendance((prev) => {
      // Remove any existing records for the same students on the same date
      const keys = records.map((r) => `${r.studentId}_${r.date}`);
      const remaining = prev.filter((r) => !keys.includes(`${r.studentId}_${r.date}`));
      const newItems: AttendanceRecord[] = records.map((r, idx) => ({
        id: `att-rec-${Date.now()}-${idx}`,
        institutionId: currentInstitutionId,
        classId: r.classId,
        sectionId: r.sectionId,
        date: r.date,
        studentId: r.studentId,
        studentName: r.studentName,
        rollNo: r.rollNo,
        status: r.status,
        remarks: r.remarks,
      }));
      return [...newItems, ...remaining];
    });
  };

  const markTeacherAttendance = (
    records: {
      teacherId: string;
      teacherName: string;
      employeeId: string;
      date: string;
      status: "present" | "absent" | "late" | "leave";
      remarks?: string;
    }[]
  ) => {
    setTeacherAttendance((prev) => {
      const keys = records.map((r) => `${r.teacherId}_${r.date}`);
      const remaining = prev.filter((r) => !keys.includes(`${r.teacherId}_${r.date}`));
      const newItems: TeacherAttendanceRecord[] = records.map((r, idx) => ({
        id: `tatt-rec-${Date.now()}-${idx}`,
        institutionId: currentInstitutionId,
        date: r.date,
        teacherId: r.teacherId,
        teacherName: r.teacherName,
        employeeId: r.employeeId,
        status: r.status,
        remarks: r.remarks,
      }));
      return [...newItems, ...remaining];
    });
  };

  // Examinations & Results
  const createExamination = (examData: Omit<Examination, "id">) => {
    const newExam: Examination = {
      ...examData,
      id: `exam-${Date.now()}`,
    };
    setExaminations((prev) => [newExam, ...prev]);
  };

  const updateExamStatus = (examId: string, status: Examination["status"]) => {
    setExaminations((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, status } : e))
    );
  };

  const saveExamMarks = (results: Omit<ExamResult, "id">[]) => {
    setExamResults((prev) => {
      const examIds = results.map((r) => `${r.examId}_${r.studentId}`);
      const remaining = prev.filter((r) => !examIds.includes(`${r.examId}_${r.studentId}`));
      const newResults: ExamResult[] = results.map((r, idx) => ({
        ...r,
        id: `res-${Date.now()}-${idx}`,
      }));
      return [...newResults, ...remaining];
    });
  };

  // Fees
  const recordFeePayment = (
    studentId: string,
    amount: number,
    paymentMethod: "UPI" | "Net Banking" | "Cash" | "Cheque" | "Debit Card",
    feeHead: string,
    remarks?: string
  ): string => {
    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx = {
      id: `tx-${Date.now()}`,
      receiptNo,
      amount,
      paymentMethod,
      paymentDate: new Date().toISOString().split("T")[0],
      transactionRef: `${paymentMethod.toUpperCase()}/${Date.now()}`,
      feeHead,
      collectedBy: currentUser?.name || "Accounts Dept",
      remarks,
    };

    setStudentFees((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          const newPaid = s.paidAmount + amount;
          const newDue = Math.max(0, s.totalFee - s.discountAmount - newPaid);
          const newStatus =
            newDue === 0 ? "paid" : newPaid > 0 ? "partial" : "pending";
          return {
            ...s,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newStatus,
            transactions: [newTx, ...s.transactions],
          };
        }
        return s;
      })
    );

    return receiptNo;
  };

  // Assignments
  const createAssignment = (asgData: Omit<Assignment, "id">) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
    };
    setAssignments((prev) => [newAsg, ...prev]);

    // Send in-app notification to students
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      institutionId: asgData.institutionId,
      targetRole: "student",
      title: `New Assignment: ${asgData.title}`,
      message: `${asgData.subjectName} — Due by ${asgData.dueDate}`,
      type: "assignment",
      link: "/assignments",
      isRead: false,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const submitAssignment = (
    asgId: string,
    studentId: string,
    studentName: string,
    content: string,
    fileName?: string
  ) => {
    const newSubm: AssignmentSubmission = {
      id: `subm-${Date.now()}`,
      assignmentId: asgId,
      studentId,
      studentName,
      submissionDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      content,
      fileName: fileName || "Solution_Document.pdf",
      status: "submitted",
    };
    setSubmissions((prev) => [
      newSubm,
      ...prev.filter((s) => !(s.assignmentId === asgId && s.studentId === studentId)),
    ]);
  };

  const gradeSubmission = (
    submissionId: string,
    marks: number,
    feedback: string
  ) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              marksAwarded: marks,
              teacherFeedback: feedback,
              status: "evaluated",
              evaluatedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              evaluatedBy: currentUser?.name || "Teacher",
            }
          : s
      )
    );
  };

  // Curriculum & Logs
  const updateChapterStatus = (
    chapterId: string,
    status: CurriculumChapter["status"],
    actualCompletionDate?: string
  ) => {
    setCurriculum((prev) =>
      prev.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              status,
              actualCompletionDate:
                status === "completed"
                  ? actualCompletionDate || new Date().toISOString().split("T")[0]
                  : undefined,
            }
          : c
      )
    );
  };

  const addDailyTeachingLog = (logData: Omit<DailyTeachingLog, "id">) => {
    const newLog: DailyTeachingLog = {
      ...logData,
      id: `log-${Date.now()}`,
    };
    setDailyLogs((prev) => [newLog, ...prev]);
  };

  // Certificates
  const issueCertificate = (
    certData: Omit<Certificate, "id" | "certificateNumber">
  ): Certificate => {
    const certNumber = `${currentInstitution.code}/${certData.type.toUpperCase()}/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      certificateNumber: certNumber,
      status: "issued",
    };
    setCertificates((prev) => [newCert, ...prev]);
    return newCert;
  };

  // Announcements & Notifications
  const createAnnouncement = (
    annData: Omit<Announcement, "id" | "createdAt">
  ) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Settings
  const updateInstitutionSettings = (updates: Partial<Institution>) => {
    setAllInstitutions((prev) =>
      prev.map((inst) =>
        inst.id === currentInstitutionId ? { ...inst, ...updates } : inst
      )
    );
  };

  const resetAllData = () => {
    setAllInstitutions(initialInstitutions);
    setCurrentInstitutionId("inst-greenfield");
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setParents(initialParents);
    setClasses(initialClasses);
    setSubjects(initialSubjects);
    setTimetable(initialTimetable);
    setAttendance(initialAttendance);
    setTeacherAttendance(initialTeacherAttendance);
    setExaminations(initialExaminations);
    setExamResults(initialExamResults);
    setFeeStructures(initialFeeStructures);
    setStudentFees(initialStudentFees);
    setAssignments(initialAssignments);
    setSubmissions(initialSubmissions);
    setCurriculum(initialCurriculum);
    setDailyLogs(initialDailyLogs);
    setCertificates(initialCertificates);
    setAnnouncements(initialAnnouncements);
    setNotifications(initialNotifications);
    setSelectedChildId("stu-1");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <EduContext.Provider
      value={{
        currentUser,
        currentInstitution,
        allInstitutions,
        users,
        students,
        teachers,
        parents,
        classes,
        subjects,
        timetable,
        attendance,
        teacherAttendance,
        examinations,
        examResults,
        feeStructures,
        studentFees,
        assignments,
        submissions,
        curriculum,
        dailyLogs,
        certificates,
        announcements,
        notifications,
        selectedChildId,
        setSelectedChildId,
        login,
        logout,
        switchRole,
        switchInstitution,
        addStudent,
        updateStudent,
        deleteStudent,
        promoteStudents,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        addSection,
        addSubject,
        saveTimetableSlot,
        deleteTimetableSlot,
        markAttendance,
        markTeacherAttendance,
        createExamination,
        updateExamStatus,
        saveExamMarks,
        recordFeePayment,
        createAssignment,
        submitAssignment,
        gradeSubmission,
        updateChapterStatus,
        addDailyTeachingLog,
        issueCertificate,
        createAnnouncement,
        deleteAnnouncement,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateInstitutionSettings,
        resetAllData,
      }}
    >
      {children}
    </EduContext.Provider>
  );
}

export function useEdu() {
  const context = useContext(EduContext);
  if (!context) {
    throw new Error("useEdu must be used within an EduProvider");
  }
  return context;
}
