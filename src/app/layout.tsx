import type { Metadata } from "next";
import "./globals.css";
import { EduProvider } from "@/context/EduContext";
import { ToastProvider } from "@/components/ui/Toast";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Campus Connect | Education Management Platform",
  description:
    "Manage students, teachers, attendance, examinations, fees, assignments and academic operations through one connected education management platform.",
  applicationName: "Campus Connect",
  keywords: [
    "Campus Connect",
    "Education Management Platform",
    "School Management",
    "College ERP",
    "CBSE",
    "ICSE",
    "Connecting Every Classroom",
  ],
  openGraph: {
    title: "Campus Connect – Complete School & College Management Platform",
    description:
      "A complete education management platform connecting institutions, administrators, teachers, students and parents.",
    siteName: "Campus Connect",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F8FA] antialiased text-[#202124]">
        <EduProvider>
          <ToastProvider>
            <AppLayout>{children}</AppLayout>
          </ToastProvider>
        </EduProvider>
      </body>
    </html>
  );
}
