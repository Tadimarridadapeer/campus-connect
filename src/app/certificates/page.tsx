"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { Certificate, CertificateType } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  Award,
  Plus,
  Printer,
  Download,
  FileCheck2,
  Search,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function CertificatesPage() {
  const {
    certificates,
    students,
    issueCertificate,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  // Form
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || "");
  const [certType, setCertType] = useState<CertificateType>("bonafide");
  const [certPurpose, setCertPurpose] = useState("Passport Application / Visa Verification");
  const [certConduct, setCertConduct] = useState("Exemplary and courteous");
  const [reasonForLeaving, setReasonForLeaving] = useState("");

  const handleSaveIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st) return;

    const newCert = issueCertificate({
      institutionId: currentInstitution.id,
      type: certType,
      studentId: st.id,
      studentName: st.fullName,
      admissionNo: st.admissionNo,
      className: st.className,
      sectionName: st.sectionName,
      academicYear: currentInstitution.academicYear,
      issueDate: new Date().toISOString().split("T")[0],
      purpose: certPurpose,
      conduct: certConduct,
      reasonForLeaving: certType === "transfer" ? reasonForLeaving : undefined,
      issuedBy: `${currentInstitution.name} Administrative Registry`,
      status: "issued",
    });

    setIssueModalOpen(false);
    setActiveCert(newCert);
    toast("Certificate Generated", {
      type: "success",
      message: `${certType.toUpperCase()} Certificate generated with Serial #${newCert.certificateNumber}.`,
    });
  };

  const handlePrintView = (cert: Certificate) => {
    setActiveCert(cert);
    setPrintModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Certificates &amp; Digital Document Registry
            </h1>
            <Badge variant="primary" size="sm">
              Official Templated Documents
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Generate and verify Bonafide, Study, Transfer, Character Certificates, and Student ID Cards
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIssueModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Issue Certificate
        </Button>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
              <tr>
                <th className="py-3 px-4">Certificate Serial #</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Admission No</th>
                <th className="py-3 px-3">Class &amp; Sec</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3">Purpose</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-[#FDFDFE]">
                  <td className="py-3 px-4 font-mono font-bold text-[#4667D5]">
                    {cert.certificateNumber}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="primary" size="sm">
                      {cert.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#202124]">
                    {cert.studentName}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#6B7280]">
                    {cert.admissionNo}
                  </td>
                  <td className="py-3 px-3 font-medium text-[#202124]">
                    {cert.className} - {cert.sectionName}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#6B7280]">
                    {formatDate(cert.issueDate)}
                  </td>
                  <td className="py-3 px-3 text-[#6B7280] truncate max-w-[200px]">
                    {cert.purpose || "Official Records"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handlePrintView(cert)}
                      icon={<Printer className="w-3.5 h-3.5" />}
                    >
                      Print View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal */}
      <Modal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="Issue New Official Certificate"
        size="md"
      >
        <form onSubmit={handleSaveIssue} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Select Student *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white font-semibold"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.className} - {st.sectionName} • {st.admissionNo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Certificate Type *
            </label>
            <select
              value={certType}
              onChange={(e) => setCertType(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
            >
              <option value="bonafide">Bonafide Certificate</option>
              <option value="study">Study &amp; Conduct Certificate</option>
              <option value="transfer">Transfer Certificate (TC)</option>
              <option value="character">Character Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Purpose of Issuance *
            </label>
            <input
              type="text"
              required
              value={certPurpose}
              onChange={(e) => setCertPurpose(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Passport re-issue, National Scholarship application"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Conduct &amp; Moral Character Remark
            </label>
            <input
              type="text"
              value={certConduct}
              onChange={(e) => setCertConduct(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
            />
          </div>

          {certType === "transfer" && (
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Reason for Leaving School
              </label>
              <input
                type="text"
                value={reasonForLeaving}
                onChange={(e) => setReasonForLeaving(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                placeholder="e.g. Parent transfer to another city"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIssueModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Generate Certificate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Certificate Modal Layout */}
      <Modal
        isOpen={printModalOpen && !!activeCert}
        onClose={() => setPrintModalOpen(false)}
        title="Official Certificate Document"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] text-[#6B7280]">
              Demo verification: Sample document for institutional presentation
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPrintModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print / Save PDF
              </Button>
            </div>
          </div>
        }
      >
        {activeCert && (
          <div className="p-8 bg-white border-4 border-double border-[#202124] rounded-2xl space-y-6 text-[#202124]">
            {/* Header */}
            <div className="text-center border-b border-[#202124] pb-4">
              <span className="text-3xl block">{currentInstitution.logo}</span>
              <h2 className="text-xl font-bold uppercase tracking-widest mt-1">
                {currentInstitution.name}
              </h2>
              <p className="text-xs text-[#6B7280]">
                {currentInstitution.address}, {currentInstitution.city} • Affiliation: {currentInstitution.affiliationNo}
              </p>
              <div className="mt-3 inline-block border-2 border-[#202124] px-4 py-1 text-sm font-bold tracking-widest uppercase bg-[#F7F8FA]">
                {activeCert.type.toUpperCase()} CERTIFICATE
              </div>
            </div>

            {/* Serial & Date */}
            <div className="flex justify-between text-xs font-mono">
              <span><strong>Certificate No:</strong> {activeCert.certificateNumber}</span>
              <span><strong>Date of Issue:</strong> {formatDate(activeCert.issueDate)}</span>
            </div>

            {/* Body Text */}
            <div className="text-sm leading-relaxed space-y-4 pt-2 text-justify">
              <p>
                This is to officially certify that <strong>{activeCert.studentName}</strong>, bearing Admission Number <strong>{activeCert.admissionNo}</strong>, is a bonafide student of this institution currently studying in <strong>{activeCert.className} (Section {activeCert.sectionName})</strong> for the Academic Year <strong>{activeCert.academicYear}</strong>.
              </p>

              {activeCert.purpose && (
                <p>
                  This certificate is issued upon special request of the student&apos;s parent/guardian for the specific purpose of: <em>{activeCert.purpose}</em>.
                </p>
              )}

              {activeCert.conduct && (
                <p>
                  To the best of our school knowledge and records, his/her moral conduct, character, and institutional discipline have been <strong>{activeCert.conduct}</strong>.
                </p>
              )}

              {activeCert.reasonForLeaving && (
                <p>
                  Reason for leaving: <strong>{activeCert.reasonForLeaving}</strong>.
                </p>
              )}
            </div>

            {/* Signatures & Seal */}
            <div className="pt-12 flex items-end justify-between text-xs">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full border border-dashed border-[#202124] flex items-center justify-center text-[10px] text-gray-500 uppercase tracking-tighter mx-auto mb-1">
                  Institutional Seal
                </div>
                <span>Official Seal</span>
              </div>

              <div className="text-center">
                <div className="h-8 border-b border-[#202124] mb-1 w-32" />
                <span className="font-bold block">Mrs. Sunita Venkatraman</span>
                <span className="text-[#6B7280]">Principal &amp; Head of School</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
