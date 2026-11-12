"use client";

import React, { useState, useMemo } from "react";
import { useEdu } from "@/context/EduContext";
import { TimetableSlot } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  AlertTriangle,
  Printer,
  Sparkles,
  BookOpen,
  Building,
  User,
  Trash2,
} from "lucide-react";

export default function TimetablePage() {
  const {
    timetable,
    classes,
    subjects,
    teachers,
    saveTimetableSlot,
    deleteTimetableSlot,
    currentInstitution,
  } = useEdu();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<"class" | "teacher">("class");
  const [selectedClassId, setSelectedClassId] = useState<string>("cls-8");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("sec-8a");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || "");
  const [selectedDay, setSelectedDay] = useState<
    "All" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
  >("All");

  // Modal
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Slot Form
  const [formDay, setFormDay] = useState<TimetableSlot["day"]>("Monday");
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formStartTime, setFormStartTime] = useState("09:00 AM");
  const [formEndTime, setFormEndTime] = useState("09:45 AM");
  const [formSubjectName, setFormSubjectName] = useState(subjects[0]?.name || "Mathematics");
  const [formTeacherId, setFormTeacherId] = useState(teachers[0]?.id || "");
  const [formRoom, setFormRoom] = useState("Room 301");
  const [formIsBreak, setFormIsBreak] = useState(false);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const periods = [1, 2, 3, 4, 5, 6, 7];

  const standardPeriods: Record<number, { start: string; end: string }> = {
    1: { start: "09:00 AM", end: "09:45 AM" },
    2: { start: "09:45 AM", end: "10:30 AM" },
    3: { start: "10:30 AM", end: "11:15 AM" },
    4: { start: "11:35 AM", end: "12:20 PM" },
    5: { start: "12:20 PM", end: "01:05 PM" },
    6: { start: "01:50 PM", end: "02:35 PM" },
    7: { start: "02:35 PM", end: "03:20 PM" },
  };

  // Active class & section objects
  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const activeSection =
    activeClass?.sections.find((s) => s.id === selectedSectionId) || activeClass?.sections[0];

  // Active slots filtered
  const activeSlots = useMemo(() => {
    if (viewMode === "class") {
      return timetable.filter(
        (t) =>
          t.classId === selectedClassId &&
          t.sectionId === selectedSectionId &&
          (selectedDay === "All" || t.day === selectedDay)
      );
    } else {
      return timetable.filter(
        (t) =>
          (t.teacherId === selectedTeacherId ||
            t.teacherName.toLowerCase().includes(
              teachers.find((tc) => tc.id === selectedTeacherId)?.name.toLowerCase() || ""
            )) &&
          (selectedDay === "All" || t.day === selectedDay)
      );
    }
  }, [
    timetable,
    viewMode,
    selectedClassId,
    selectedSectionId,
    selectedTeacherId,
    selectedDay,
    teachers,
  ]);

  const handleOpenAddSlot = (day: TimetableSlot["day"], period: number) => {
    setConflictWarning(null);
    setFormDay(day);
    setFormPeriod(period);
    setFormStartTime(standardPeriods[period]?.start || "09:00 AM");
    setFormEndTime(standardPeriods[period]?.end || "09:45 AM");
    setFormSubjectName(subjects[0]?.name || "Mathematics");
    setFormTeacherId(teachers[0]?.id || "");
    setFormRoom(activeSection?.roomNumber || "Room 301");
    setFormIsBreak(false);
    setSlotModalOpen(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    const tch = teachers.find((t) => t.id === formTeacherId);

    const result = saveTimetableSlot({
      institutionId: currentInstitution.id,
      classId: selectedClassId,
      className: activeClass.name,
      sectionId: selectedSectionId,
      sectionName: activeSection.name,
      day: formDay,
      periodNumber: formPeriod,
      startTime: formStartTime,
      endTime: formEndTime,
      subjectName: formIsBreak ? "Recess / Break" : formSubjectName,
      teacherId: formIsBreak ? "" : formTeacherId,
      teacherName: formIsBreak ? "-" : tch?.name || "Staff",
      roomNumber: formIsBreak ? "Cafeteria" : formRoom,
      isBreak: formIsBreak,
    });

    if (!result.success) {
      setConflictWarning(result.conflictMessage || "Schedule conflict detected.");
      return;
    }

    setSlotModalOpen(false);
    toast("Period Scheduled", {
      type: "success",
      message: `${formDay} Period ${formPeriod}: ${formSubjectName} confirmed without conflicts.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8EAED] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#202124]">
              Timetable &amp; Master Scheduling
            </h1>
            <Badge variant="primary" size="sm">
              Conflict-Free Engine
            </Badge>
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            Weekly grid schedules, period allocations, and room conflict prevention
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Grid
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenAddSlot("Monday", 1)}
            icon={<Plus className="w-4 h-4" />}
          >
            Schedule Slot
          </Button>
        </div>
      </div>

      {/* View Mode & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EAED] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-[#F7F8FA] rounded-lg border border-[#E8EAED] text-xs font-semibold">
            <button
              onClick={() => setViewMode("class")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "class"
                  ? "bg-white text-[#202124] shadow-xs border border-[#E8EAED]"
                  : "text-[#6B7280] hover:text-[#202124]"
              }`}
            >
              Class Schedule
            </button>
            <button
              onClick={() => setViewMode("teacher")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "teacher"
                  ? "bg-white text-[#202124] shadow-xs border border-[#E8EAED]"
                  : "text-[#6B7280] hover:text-[#202124]"
              }`}
            >
              Teacher Schedule
            </button>
          </div>

          {/* If Class View */}
          {viewMode === "class" ? (
            <>
              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    const c = classes.find((cls) => cls.id === e.target.value);
                    setSelectedSectionId(c?.sections[0]?.id || "");
                  }}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#374151]">
                <span className="text-[#6B7280]">Section:</span>
                <select
                  value={selectedSectionId}
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
                >
                  {activeClass?.sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      Section {s.name} ({s.roomNumber})
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            /* If Teacher View */
            <div className="flex items-center gap-1.5 text-xs text-[#374151]">
              <span className="text-[#6B7280]">Faculty:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer min-w-[200px]"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Day Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#374151]">
            <span className="text-[#6B7280]">Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white outline-hidden cursor-pointer"
            >
              <option value="All">All Weekdays</option>
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-[#6B7280]">
          {viewMode === "class" ? (
            <span>
              Room: <strong className="text-[#202124]">{activeSection?.roomNumber}</strong> • Class Teacher: <strong className="text-[#202124]">{activeSection?.classTeacherName}</strong>
            </span>
          ) : (
            <span>Weekly Workload: <strong>{activeSlots.length}</strong> Periods</span>
          )}
        </div>
      </div>

      {/* Timetable Weekly Matrix Grid */}
      <div className="bg-white rounded-xl border border-[#E8EAED] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E8EAED]">
              <tr>
                <th className="py-3.5 px-4 w-28 border-r border-[#E8EAED]">Day</th>
                {periods.map((p) => (
                  <th key={p} className="py-3 px-3 text-center border-r border-[#E8EAED] min-w-[135px]">
                    <div className="font-bold text-[#202124]">Period {p}</div>
                    <span className="text-[10px] text-[#9CA3AF] font-mono block">
                      {standardPeriods[p]?.start} - {standardPeriods[p]?.end}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAED]">
              {daysOfWeek
                .filter((d) => selectedDay === "All" || d === selectedDay)
                .map((day) => (
                  <tr key={day} className="hover:bg-[#FDFDFE]">
                    <td className="py-3 px-4 font-bold text-[#202124] bg-[#FAFAFA] border-r border-[#E8EAED]">
                      {day}
                    </td>
                    {periods.map((period) => {
                      const slot = activeSlots.find(
                        (s) => s.day === day && s.periodNumber === period
                      );

                      return (
                        <td
                          key={period}
                          className="py-2.5 px-2.5 border-r border-[#E8EAED] text-center align-top relative group"
                        >
                          {slot ? (
                            <div className="p-2 rounded-lg bg-[#EEF2FC]/70 border border-[#D6E0FA] text-left hover:border-[#4667D5] transition-all">
                              <p className="font-bold text-[11px] text-[#1E3A8A] leading-tight truncate">
                                {slot.subjectName}
                              </p>
                              <p className="text-[10px] text-[#6B7280] truncate mt-0.5">
                                {viewMode === "class" ? slot.teacherName : `${slot.className}-${slot.sectionName}`}
                              </p>
                              <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-[#9CA3AF]">
                                <span>{slot.roomNumber}</span>
                                <button
                                  onClick={() => deleteTimetableSlot(slot.id)}
                                  className="text-[#9CA3AF] hover:text-[#D94B4B] p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove slot"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAddSlot(day, period)}
                              className="w-full h-14 rounded-lg border border-dashed border-[#E5E7EB] hover:border-[#4667D5] hover:bg-[#F7F8FA] flex items-center justify-center text-[#9CA3AF] hover:text-[#4667D5] transition-all cursor-pointer text-xs"
                            >
                              <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Timetable Slot Modal with Conflict Warning Engine */}
      <Modal
        isOpen={slotModalOpen}
        onClose={() => setSlotModalOpen(false)}
        title={`Schedule Period — ${formDay} (Period ${formPeriod})`}
        size="md"
      >
        <form onSubmit={handleSaveSlot} className="space-y-3.5">
          {conflictWarning && (
            <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs text-[#B91C1C] flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Scheduling Conflict Alert:</p>
                <p className="mt-0.5">{conflictWarning}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-2 bg-[#F7F8FA] rounded-lg text-xs">
            <input
              type="checkbox"
              id="isBreakCheck"
              checked={formIsBreak}
              onChange={(e) => setFormIsBreak(e.target.checked)}
              className="rounded text-[#4667D5] cursor-pointer"
            />
            <label htmlFor="isBreakCheck" className="font-semibold text-[#202124] cursor-pointer">
              Mark this period slot as Recess / Break Interval
            </label>
          </div>

          {!formIsBreak && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Subject *
                </label>
                <select
                  value={formSubjectName}
                  onChange={(e) => setFormSubjectName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Assigned Teacher *
                </label>
                <select
                  value={formTeacherId}
                  onChange={(e) => setFormTeacherId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg bg-white"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} ({tch.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Room Allocation *
                </label>
                <input
                  type="text"
                  required
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Start Time
              </label>
              <input
                type="text"
                required
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                End Time
              </label>
              <input
                type="text"
                required
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8EAED] rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8EAED]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSlotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Period Slot
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
