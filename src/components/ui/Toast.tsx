"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, options?: { type?: ToastType; message?: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (title: string, options?: { type?: ToastType; message?: string; duration?: number }) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const type = options?.type || "success";
      const newToast: Toast = { id, type, title, message: options?.message };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, options?.duration || 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-4.5 h-4.5 text-[#25845A] shrink-0" />,
            error: <AlertCircle className="w-4.5 h-4.5 text-[#D94B4B] shrink-0" />,
            warning: <AlertCircle className="w-4.5 h-4.5 text-[#D69B36] shrink-0" />,
            info: <Info className="w-4.5 h-4.5 text-[#4667D5] shrink-0" />,
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-3.5 bg-white rounded-xl shadow-lg border border-[#E8EAED] animate-in slide-in-from-bottom-3 duration-200 transition-all",
                t.type === "success" && "border-l-4 border-l-[#25845A]",
                t.type === "error" && "border-l-4 border-l-[#D94B4B]",
                t.type === "warning" && "border-l-4 border-l-[#D69B36]",
                t.type === "info" && "border-l-4 border-l-[#4667D5]"
              )}
            >
              {icons[t.type]}
              <div className="flex-1 text-xs">
                <p className="font-semibold text-[#202124]">{t.title}</p>
                {t.message && (
                  <p className="text-[#6B7280] mt-0.5 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[#9CA3AF] hover:text-[#4B5563] p-0.5 rounded transition-colors -mr-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
