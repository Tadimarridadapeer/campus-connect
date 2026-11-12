"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  collapsed?: boolean;
  variant?: "dark" | "light";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  size = "md",
  showTagline = false,
  collapsed = false,
  variant = "dark",
}) => {
  const isLight = variant === "light";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Icon: Modern Connected Campus Node / Monogram */}
      <div
        className={cn(
          "rounded-xl flex items-center justify-center font-bold tracking-tight shadow-2xs transition-transform duration-200 shrink-0",
          isLight ? "bg-white text-[#202124]" : "bg-[#202124] text-white",
          size === "sm" && "w-8 h-8 text-xs",
          size === "md" && "w-9 h-9 text-sm",
          size === "lg" && "w-11 h-11 text-base"
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            size === "sm" && "w-4 h-4",
            size === "md" && "w-5 h-5",
            size === "lg" && "w-6 h-6"
          )}
        >
          {/* Graduation Cap + Connected Links geometric emblem */}
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {!collapsed && (
        <div className="leading-none text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-extrabold tracking-tight",
                isLight ? "text-white" : "text-[#202124]",
                size === "sm" && "text-sm",
                size === "md" && "text-base",
                size === "lg" && "text-xl"
              )}
            >
              CAMPUS
            </span>
            <span
              className={cn(
                "font-semibold tracking-tight text-[#4667D5]",
                size === "sm" && "text-sm",
                size === "md" && "text-base",
                size === "lg" && "text-xl"
              )}
            >
              CONNECT
            </span>
          </div>
          {showTagline && (
            <p
              className={cn(
                "text-[10px] tracking-wide mt-1 font-medium",
                isLight ? "text-gray-300" : "text-[#6B7280]"
              )}
            >
              Connecting Every Classroom.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
