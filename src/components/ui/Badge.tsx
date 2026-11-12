import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "secondary"
    | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  dot = false,
  ...props
}) => {
  const variantStyles = {
    default: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]",
    primary: "bg-[#EEF2FC] text-[#4667D5] border-[#D6E0FA]",
    success: "bg-[#ECFDF5] text-[#1E714C] border-[#A7F3D0]",
    warning: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    danger: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    info: "bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]",
    secondary: "bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]",
    outline: "bg-transparent text-[#4B5563] border-[#E5E7EB]",
  };

  const dotColors = {
    default: "bg-[#9CA3AF]",
    primary: "bg-[#4667D5]",
    success: "bg-[#25845A]",
    warning: "bg-[#D69B36]",
    danger: "bg-[#D94B4B]",
    info: "bg-[#0EA5E9]",
    secondary: "bg-[#71717A]",
    outline: "bg-[#9CA3AF]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium leading-4",
    md: "px-2.5 py-0.5 text-xs font-medium leading-5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
};
