"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const toastVariants = cva(
  "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-all",
  {
    variants: {
      variant: {
        error: "border-red-500/30 bg-red-500/10 text-red-400",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  onClose: () => void;
}

export function Toast({ variant, message, onClose }: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }))}>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="shrink-0 rounded p-0.5 hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
