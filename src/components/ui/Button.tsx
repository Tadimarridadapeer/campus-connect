import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "subtle";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        "bg-[#202124] text-white hover:bg-black border border-transparent shadow-xs transition-colors",
      secondary:
        "bg-[#F0F2F5] text-[#202124] hover:bg-[#E5E8EB] border border-[#E8EAED] transition-colors",
      outline:
        "bg-white text-[#374151] hover:bg-[#F9FAFB] border border-[#E8EAED] shadow-xs transition-colors",
      ghost:
        "bg-transparent text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827] border-transparent transition-colors",
      danger:
        "bg-[#D94B4B] text-white hover:bg-[#C53939] border border-transparent shadow-xs transition-colors",
      success:
        "bg-[#25845A] text-white hover:bg-[#1E6B49] border border-transparent shadow-xs transition-colors",
      subtle:
        "bg-[#EEF2FC] text-[#4667D5] hover:bg-[#E0E7FA] border border-transparent transition-colors font-medium",
    };

    const sizeStyles = {
      xs: "px-2 py-1 text-xs rounded-md gap-1",
      sm: "px-2.5 py-1.5 text-xs rounded-md gap-1.5 font-medium",
      md: "px-3.5 py-2 text-sm rounded-lg gap-2 font-medium",
      lg: "px-4.5 py-2.5 text-base rounded-lg gap-2.5 font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center select-none font-medium outline-hidden focus-visible:ring-2 focus-visible:ring-[#4667D5] focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 mr-2 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        ) : (
          icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
