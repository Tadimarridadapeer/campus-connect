import type { Metadata } from "next";
import "./globals.css";
import { EduProvider } from "@/context/EduContext";
import { ToastProvider } from "@/components/ui/Toast";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "EDUVANTA — Education Management Ecosystem",
  description:
    "Comprehensive multi-tenant education management ERP for schools, colleges, and educational institutions.",
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
