"use client";

import React, { useState } from "react";
import { useEdu } from "@/context/EduContext";
import { Announcement } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  Bell,
  Plus,
  Trash2,
  AlertCircle,
  Megaphone,
  Users,
  Search,
  CheckCircle,
} from "lucide-react";

export default function AnnouncementsPage() {
  const {
    currentUser,
    announcements,
    classes,
    createAnnouncement,
    deleteAnnouncement,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeAnn, setActiveAnn] = useState<Announcement | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState<Announcement["targetAudience"]>("all");
  const [classId, setClassId] = useState("cls-8");
  const [priority, setPriority] = useState<Announcement["priority"]>("normal");

  const isTeacherOrAdmin =
    currentUser?.role === "teacher" ||
    currentUser?.role === "super_admin" ||
    currentUser?.role === "principal" ||
    currentUser?.role === "coordinator";

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const selClass = classes.find((c) => c.id === classId);

    createAnnouncement({
      institutionId: currentInstitution.id,
      title,
      content,
      targetAudience,
      classId: targetAudience === "class" ? classId : undefined,
      className: targetAudience === "class" ? selClass?.name : undefined,
      priority,
      authorName: currentUser?.name || "Administration",
      authorRole: currentUser?.role.toUpperCase() || "ADMIN",
    });

    setCreateModalOpen(false);
    setTitle("");
    setContent("");
    toast("Announcement Broadcasted", {
      type: "success",
      message: `"${title}" has been published to the notice board.`,
    });
  };

  const handleConfirmDelete = () => {
    if (!activeAnn) return;
    deleteAnnouncement(activeAnn.id);
    setDeleteModalOpen(false);
    toast("Announcement Removed", { type: "info" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Campus Notice Board &amp; Communications
            </h1>
            <Badge variant="primary" size="sm">
              Internal Bulletin
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Official announcements, parent circulars, exam alerts, and institutional notices
          </p>
        </div>

        {isTeacherOrAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Post Announcement
          </Button>
        )}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-xl bg-white border transition-all ${
              ann.priority === "urgent"
                ? "border-l-4 border-l-[#D94B4B] border-[#E8EAED]"
                : ann.priority === "important"
                ? "border-l-4 border-l-[#D69B36] border-[#E8EAED]"
                : "border-[#E8EAED]"
            } shadow-2xs space-y-3`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3F4F6] pb-3">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-[#202124]">
                  {ann.title}
                </h3>
                <Badge
                  variant={
                    ann.priority === "urgent"
                      ? "danger"
                      : ann.priority === "important"
                      ? "warning"
                      : "secondary"
                  }
                  size="sm"
                >
                  {ann.priority.toUpperCase()}
                </Badge>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F7F8FA] text-[#6B7280] font-semibold uppercase">
                  Audience: {ann.targetAudience}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#6B7280]">
                  {formatDate(ann.createdAt)}
                </span>
                {isTeacherOrAdmin && (
                  <button
                    onClick={() => {
                      setActiveAnn(ann);
                      setDeleteModalOpen(true);
                    }}
                    className="text-[#9CA3AF] hover:text-[#D94B4B] p-1 rounded transition-colors cursor-pointer"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-[#374151] leading-relaxed">
              {ann.content}
            </p>

            <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-1">
              <span>
                Authorized by: <strong className="text-[#202124]">{ann.authorName}</strong> ({ann.authorRole})
              </span>
              <span>
                {currentInstitution.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Announcement Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Post New Campus Announcement"
        size="md"
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Announcement Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="e.g. Annual Sports Meet 2026 Registration"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Target Audience *
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="all">Entire Institution (All)</option>
                <option value="students">Students Only</option>
                <option value="parents">Parents Only</option>
                <option value="teachers">Faculty Only</option>
                <option value="class">Specific Class</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                <option value="normal">Normal</option>
                <option value="important">Important</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {targetAudience === "class" && (
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Select Class
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">
              Notice Content *
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
              placeholder="Enter full announcement details..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Announcement"
        message={`Are you sure you want to delete "${activeAnn?.title}"? It will no longer appear on student or parent boards.`}
      />
    </div>
  );
}
