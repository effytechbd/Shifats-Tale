import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let colors = "bg-gray-100 text-gray-800 border-gray-200";

  switch (normalized) {
    case "ACTIVE":
    case "APPROVED":
      colors = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      break;
    case "PENDING":
      colors = "bg-amber-50 text-amber-700 border-amber-200/60";
      break;
    case "DISABLED":
    case "REJECTED":
    case "CANCELLED":
      colors = "bg-rose-50 text-rose-700 border-rose-200/60";
      break;
    case "COMPLETED":
      colors = "bg-blue-50 text-blue-700 border-blue-200/60";
      break;
    case "ARCHIVED":
      colors = "bg-slate-100 text-slate-700 border-slate-200/60";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border",
        colors,
        className
      )}
    >
      {status}
    </span>
  );
}
