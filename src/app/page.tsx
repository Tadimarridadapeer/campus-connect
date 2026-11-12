"use client";

import React from "react";
import { useEdu } from "@/context/EduContext";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";

export default function HomePage() {
  const { currentUser } = useEdu();

  if (!currentUser) return null;

  switch (currentUser.role) {
    case "teacher":
      return <TeacherDashboard />;
    case "student":
      return <StudentDashboard />;
    case "parent":
      return <ParentDashboard />;
    default:
      return <AdminDashboard />;
  }
}
