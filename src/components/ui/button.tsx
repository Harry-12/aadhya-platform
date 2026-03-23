"use client";

import { cn } from "@/lib/utils";
import { LoaderIcon } from "./icons";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses = {
  primary:
    "text-white bg-gradient-to-br from-burgundy to-burgundy-light shadow-lg shadow-burgundy/30 hover:shadow-xl hover:shadow-burgundy/40",
  secondary:
    "border-2 border-gold text-gold-muted bg-white hover:bg-cream",
  ghost: "text-charcoal-light hover:bg-cream",
  danger: "text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? <LoaderIcon size={18} /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
