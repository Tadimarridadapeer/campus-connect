"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StudentFeeRecord, FeeTransaction } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function FeesPage() {
  const {
    studentFees,
    feeStructures,
    classes,
    students,
    recordFeePayment,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"ledger" | "structures">("ledger");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");

  // Modals
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [activeFeeRecord, setActiveFeeRecord] = useState<StudentFeeRecord | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<FeeTransaction | null>(null);

  // Payment Form
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "");
  const [payAmount, setPayAmount] = useState<number>(20000);
  const [payMethod, setPayMethod] = useState<"UPI" | "Net Banking" | "Cash" | "Cheque" | "Debit Card">("UPI");
  const [feeHead, setFeeHead] = useState("Term 2 Tuition Installment");
  const [remarks, setRemarks] = useState("Direct payment via Accounts Counter");

  // Filtered Fee Records
  const filteredFees = useMemo(() => {
    return studentFees.filter((f) => {
      const matchSearch =
        f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      const matchClass = classFilter === "all" || f.classId === classFilter;

      return matchSearch && matchStatus && matchClass;
    });
  }, [studentFees, searchTerm, statusFilter, classFilter]);

  // Aggregate Metrics
  const totalBilled = studentFees.reduce((a, b) => a + (b.totalFee - b.discountAmount), 0);
  const totalCollected = studentFees.reduce((a, b) => a + b.paidAmount, 0);
  const totalOutstanding = studentFees.reduce((a, b) => a + b.dueAmount, 0);
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : "0";

  // Handle Open Payment Form
  const handleOpenPayment = (record?: StudentFeeRecord) => {
    if (record) {
      setSelectedStudentId(record.studentId);
      setPayAmount(record.dueAmount > 0 ? record.dueAmount : 15000);
    } else {
      setSelectedStudentId(students[0]?.id || "");
      setPayAmount(20000);
    }
    setPayModalOpen(true);
  };

  // Submit Payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || payAmount <= 0) return;

    const receiptNo = recordFeePayment(
      selectedStudentId,
      payAmount,
      payMethod,
      feeHead,
      remarks
    );

    setPayModalOpen(false);

    // Find student name for toast
    const st = students.find((s) => s.id === selectedStudentId);
    toast("Fee Payment Recorded", {
      type: "success",
      message: `₹${payAmount.toLocaleString("en-IN")} credited for ${st?.fullName}. Receipt #${receiptNo} generated.`,
    });
  };

  // Open Receipt
  const handleViewReceipt = (feeRec: StudentFeeRecord, tx: FeeTransaction) => {
    setActiveFeeRecord(feeRec);
    setActiveTransaction(tx);
    setReceiptModalOpen(true);
  };

  // Export CSV
  const handleExportFeeCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Admission No", "Student Name", "Class", "Total Fee", "Discount", "Paid", "Due", "Status", "Due Date"],
        ...filteredFees.map((f) => [
          f.admissionNo,
          `"${f.studentName}"`,
          f.className,
          f.totalFee,
          f.discountAmount,
          f.paidAmount,
          f.dueAmount,
          f.status,
          f.dueDate,
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Fee_Ledger_${currentInstitution.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Fees &amp; Financial Management
            </h1>
            <Badge variant="primary" size="sm">
              Collection Rate: {collectionRate}%
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Student fee ledgers, multi-head fee structures, automated receipts, and revenue reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportFeeCSV}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Ledger
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenPayment()}
            icon={<Plus className="w-4 h-4" />}
          >
            Record Fee Payment
          </Button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <span className="text-xs font-semibold text-[#6B7280]">Total Fee Billed</span>
          <p className="text-2xl font-bold text-[#202124] mt-1">
            {formatCurrency(totalBilled)}
          </p>
          <span className="text-[11px] text-[#6B7280]">Annual institutional billing</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <span className="text-xs font-semibold text-[#6B7280]">Total Revenue Collected</span>
          <p className="text-2xl font-bold text-[#25845A] mt-1">
            {formatCurrency(totalCollected)}
          </p>
          <span className="text-[11px] text-[#25845A] font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {collectionRate}% of billed total
          </span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <span className="text-xs font-semibold text-[#6B7280]">Outstanding Dues</span>
          <p className="text-2xl font-bold text-[#D94B4B] mt-1">
            {formatCurrency(totalOutstanding)}
          </p>
          <span className="text-[11px] text-[#D94B4B]">Installments pending collection</span>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#E8EAED] shadow-2xs">
          <span className="text-xs font-semibold text-[#6B7280]">Scholarships &amp; Waivers</span>
          <p className="text-2xl font-bold text-[#4667D5] mt-1">
            {formatCurrency(studentFees.reduce((a, b) => a + b.discountAmount, 0))}
          </p>
          <span className="text-[11px] text-[#6B7280]">Merit &amp; sibling discounts</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8EAED] pb-1">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "ledger"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          Student Fee Ledgers ({studentFees.length})
        </button>

        <button
          onClick={() => setActiveTab("structures")}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === "structures"
              ? "bg-[#202124] text-white"
              : "text-[#6B7280] hover:text-[#202124] hover:bg-[#F3F4F6]"
          }`}
        >
          Class Fee Structures ({feeStructures.length})
        </button>
      </div>

      {/* Tab 1: Student Fee Ledger */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by student or admission #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg focus:border-[#4667D5] outline-hidden"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Class:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
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
            </div>

            <span className="text-xs text-[#6B7280]">
              Showing <strong>{filteredFees.length}</strong> student ledgers
            </span>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-3">Admission No</th>
                    <th className="py-3 px-3">Class &amp; Sec</th>
                    <th className="py-3 px-3 text-right">Total Billed</th>
                    <th className="py-3 px-3 text-right">Paid</th>
                    <th className="py-3 px-3 text-right">Balance Due</th>
                    <th className="py-3 px-3">Due Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-[#FDFDFE]">
                      <td className="py-3 px-4 font-bold text-[#202124]">
                        {fee.studentName}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#6B7280]">
                        {fee.admissionNo}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#202124]">
                        {fee.className} - {fee.sectionName}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {formatCurrency(fee.totalFee - fee.discountAmount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#25845A]">
                        {formatCurrency(fee.paidAmount)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#D94B4B]">
                        {formatCurrency(fee.dueAmount)}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#6B7280]">
                        {formatDate(fee.dueDate)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            fee.status === "paid"
                              ? "success"
                              : fee.status === "partial"
                              ? "primary"
                              : fee.status === "overdue"
                              ? "danger"
                              : "warning"
                          }
                          size="sm"
                        >
                          {fee.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {fee.transactions.length > 0 && (
                            <button
                              onClick={() => handleViewReceipt(fee, fee.transactions[0])}
                              className="p-1 rounded text-[#4667D5] hover:bg-[#EEF2FC] transition-colors"
                              title="Print Recent Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => handleOpenPayment(fee)}
                          >
                            Collect Fee
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Class Fee Structures */}
      {activeTab === "structures" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feeStructures.map((fs) => (
            <div
              key={fs.id}
              className="bg-white rounded-xl border border-[#E8EAED] p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#202124]">
                    {fs.className} Fee Schedule
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Academic Year {fs.academicYear}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#6B7280] uppercase font-bold">Total Composite Fee</span>
                  <p className="text-lg font-bold text-[#4667D5]">
                    {formatCurrency(fs.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="border border-[#E8EAED] rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#F9FAFB] text-[#6B7280] border-b border-[#E8EAED]">
                    <tr>
                      <th className="py-2 px-3">Fee Category</th>
                      <th className="py-2 px-3">Frequency</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {fs.heads.map((head) => (
                      <tr key={head.id}>
                        <td className="py-2 px-3 font-medium text-[#202124]">{head.name}</td>
                        <td className="py-2 px-3 text-[#6B7280]">{head.frequency}</td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-[#202124]">
                          {formatCurrency(head.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Fee Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Record Fee Payment (Demo Transaction)"
        size="md"
      >
        <form onSubmit={handleSavePayment} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Select Student *
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                const rec = studentFees.find((f) => f.studentId === e.target.value);
                if (rec) setPayAmount(rec.dueAmount > 0 ? rec.dueAmount : 15000);
              }}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white font-semibold"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.className} - {st.sectionName} • {st.admissionNo})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Amount to Collect (INR) *
              </label>
              <input
                type="number"
                required
                min={100}
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Payment Method *
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Net Banking">Net Banking (NEFT/RTGS)</option>
                <option value="Cash">Cash at Counter</option>
                <option value="Cheque">Bank Cheque / DD</option>
                <option value="Debit Card">Debit / POS Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Fee Head Description *
            </label>
            <input
              type="text"
              required
              value={feeHead}
              onChange={(e) => setFeeHead(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Term 2 Tuition & Labs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPayModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm &amp; Issue Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Fee Receipt Modal */}
      <Modal
        isOpen={receiptModalOpen && !!activeFeeRecord && !!activeTransaction}
        onClose={() => setReceiptModalOpen(false)}
        title="Official Fee Payment Receipt"
        size="md"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="text-[11px] font-mono text-[#6B7280]">
              Receipt #{activeTransaction?.receiptNo}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setReceiptModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        }
      >
        {activeFeeRecord && activeTransaction && (
          <div className="p-4 bg-white border border-[#202124] rounded-xl text-xs space-y-4">
            <div className="text-center border-b border-[#202124] pb-3">
              <h3 className="font-bold text-sm text-[#202124] uppercase">
                {currentInstitution.name}
              </h3>
              <p className="text-[10px] text-[#6B7280]">
                {currentInstitution.address}, {currentInstitution.city} • Affiliation: {currentInstitution.affiliationNo}
              </p>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded bg-[#202124] text-white font-bold text-[10px] tracking-wider uppercase">
                Official Fee Receipt
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p><strong>Receipt Number:</strong> <span className="font-mono">{activeTransaction.receiptNo}</span></p>
                <p><strong>Date:</strong> {formatDate(activeTransaction.paymentDate)}</p>
                <p><strong>Payment Mode:</strong> {activeTransaction.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p><strong>Student Name:</strong> {activeFeeRecord.studentName}</p>
                <p><strong>Admission No:</strong> {activeFeeRecord.admissionNo}</p>
                <p><strong>Class &amp; Sec:</strong> {activeFeeRecord.className} - {activeFeeRecord.sectionName}</p>
              </div>
            </div>

            <div className="border border-[#E8EAED] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F7F8FA]">
                  <tr>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-[#202124]">
                      {activeTransaction.feeHead}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#25845A]">
                      {formatCurrency(activeTransaction.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-4 flex items-end justify-between text-[11px] text-[#6B7280]">
              <div>
                <p>Payment Ref: <span className="font-mono">{activeTransaction.transactionRef}</span></p>
                <p>Cashier / Desk: {activeTransaction.collectedBy}</p>
              </div>
              <div className="text-center">
                <div className="h-6 border-b border-[#202124] mb-1 w-24" />
                <span>Authorized Signatory</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
