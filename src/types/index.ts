export type UserRole =
  | "super_admin"
  | "principal"
  | "coordinator"
  | "teacher"
  | "student"
  | "parent";

export type InstitutionType = "school" | "college";

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: InstitutionType;
  logo: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  affiliationNo?: string; // e.g. CBSE/2026/9382
  academicYear: string; // e.g. "2026-2027"
  currency: string; // "INR"
  settings: {
    attendanceThreshold: number; // e.g. 75%
    enableDailyLogs: boolean;
    enableParentPortal: boolean;
    gradingType: "CBSE" | "ICSE" | "GPA";
    primaryColor: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId: string;
  avatar: string;
  phone: string;
  studentId?: string;
  teacherId?: string;
  parentId?: string;
}

export interface Section {
  id: string;
  name: string; // e.g. "A", "B", "C"
  classId: string;
  classTeacherId: string;
  classTeacherName: string;
  roomNumber: string;
  capacity: number;
}

export interface AcademicClass {
  id: string;
  institutionId: string;
  name: string; // e.g. "Class 8", "Class 9", or "B.Tech CSE - Year 2"
  gradeLevel: number;
  type: InstitutionType;
  department?: string; // For colleges
  semester?: number; // For colleges
  sections: Section[];
}

export interface Subject {
  id: string;
  institutionId: string;
  name: string; // e.g. "Mathematics", "Science", "Computer Science"
  code: string; // e.g. "MTH-801"
  department?: string;
  creditsOrPeriods: number;
}

export interface Student {
  id: string;
  institutionId: string;
  admissionNo: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";
  dob: string; // YYYY-MM-DD
  avatar: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  parentId: string;
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
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    fileSize: string;
  }[];
}

export interface Teacher {
  id: string;
  institutionId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  department: string;
  designation: string;
  joiningDate: string;
  avatar: string;
  assignedSubjects: string[]; // Subject names
  assignedClasses: {
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
    subject: string;
  }[];
  isClassTeacherOf?: {
    classId: string;
    className: string;
    sectionId: string;
    sectionName: string;
  };
}

export interface Parent {
  id: string;
  institutionId: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  address: string;
  avatar: string;
  childrenIds: string[]; // IDs of students
}

export interface TimetableSlot {
  id: string;
  institutionId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periodNumber: number;
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "09:45 AM"
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
  isBreak?: boolean;
  breakLabel?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "leave" | "half_day";

export interface AttendanceRecord {
  id: string;
  institutionId: string;
  classId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  rollNo: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  institutionId: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  teacherName: string;
  employeeId: string;
  status: "present" | "absent" | "late" | "leave";
  remarks?: string;
}

export type ExamCategory =
  | "unit_test"
  | "midterm"
  | "quarterly"
  | "half_yearly"
  | "annual"
  | "practical";

export interface Examination {
  id: string;
  institutionId: string;
  title: string;
  category: ExamCategory;
  classId: string;
  className: string;
  sectionId?: string; // optional if for all sections
  subjectId: string;
  subjectName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:30 AM"
  endTime: string; // e.g. "12:30 PM"
  maxMarks: number;
  passingMarks: number;
  roomNumber: string;
  status: "upcoming" | "ongoing" | "completed" | "published";
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  marksObtained: number;
  maxMarks: number;
  passingMarks: number;
  percentage: number;
  grade: string; // A1, A2, B1, etc.
  status: "pass" | "fail";
  remarks?: string;
}

export interface FeeHead {
  id: string;
  name: string; // e.g. "Tuition Fee", "Lab Fee", "Library Fee", "Transport"
  amount: number;
  frequency: "Annual" | "Term" | "Monthly" | "One-time";
}

export interface FeeStructure {
  id: string;
  institutionId: string;
  classId: string;
  className: string;
  academicYear: string;
  heads: FeeHead[];
  totalAmount: number;
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  amount: number;
  paymentMethod: "UPI" | "Net Banking" | "Cash" | "Cheque" | "Debit Card";
  paymentDate: string; // YYYY-MM-DD
  transactionRef: string;
  feeHead: string;
  collectedBy: string;
  remarks?: string;
}

export interface StudentFeeRecord {
  id: string;
  institutionId: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  classId: string;
  className: string;
  sectionName: string;
  totalFee: number;
  discountAmount: number;
  discountReason?: string;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
  transactions: FeeTransaction[];
}

export interface Assignment {
  id: string;
  institutionId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  instructions: string;
  maxMarks: number;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  attachments: {
    name: string;
    size: string;
    url: string;
  }[];
  targetType: "all" | "selected";
  selectedStudentIds?: string[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionDate: string;
  content: string;
  fileName?: string;
  status: "submitted" | "late" | "evaluated";
  marksAwarded?: number;
  teacherFeedback?: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
}

export interface CurriculumChapter {
  id: string;
  institutionId: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  chapterNumber: number;
  chapterTitle: string;
  topics: string[];
  learningObjectives: string[];
  assignedTeacherId: string;
  assignedTeacherName: string;
  plannedCompletionDate: string;
  actualCompletionDate?: string;
  status: "not_started" | "in_progress" | "completed";
}

export interface DailyTeachingLog {
  id: string;
  institutionId: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  date: string; // YYYY-MM-DD
  chapterId: string;
  chapterTitle: string;
  topicsCovered: string;
  homeworkAssigned: string;
  remarks?: string;
}

export type CertificateType =
  | "bonafide"
  | "study"
  | "transfer"
  | "character"
  | "id_card";

export interface Certificate {
  id: string;
  institutionId: string;
  certificateNumber: string;
  type: CertificateType;
  studentId: string;
  studentName: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  academicYear: string;
  issueDate: string;
  purpose?: string;
  reasonForLeaving?: string;
  conduct?: string;
  issuedBy: string;
  status: "issued" | "draft";
}

export interface Announcement {
  id: string;
  institutionId: string;
  title: string;
  content: string;
  targetAudience: "all" | "teachers" | "students" | "parents" | "class";
  classId?: string;
  className?: string;
  priority: "normal" | "important" | "urgent";
  createdAt: string;
  authorName: string;
  authorRole: string;
}

export interface NotificationItem {
  id: string;
  institutionId: string;
  userId?: string;
  targetRole?: UserRole | "all";
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "exam" | "fee" | "assignment";
  link?: string;
  isRead: boolean;
  createdAt: string;
}
