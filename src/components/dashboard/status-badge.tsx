import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let colors = "bg-[#E9EDF3] text-[#475569] border-[#DDE3EC]";

  switch (normalized) {
    case "ACTIVE":
    case "OPEN":
    case "PAID":
    case "APPROVED":
      colors = "bg-[#DDF8EC] text-[#087A55] border-[#DDF8EC]";
      break;
    case "PENDING":
      colors = "bg-[#FFF2CC] text-[#A15C00] border-[#FFF2CC]";
      break;
    case "CLOSED":
    case "INACTIVE":
    case "REJECTED":
    case "ARCHIVED":
      colors = "bg-[#E9EDF3] text-[#475569] border-[#E9EDF3]";
      break;
    case "DISABLED":
    case "SUSPENDED":
    case "FAILED":
    case "OVERDUE":
    case "CANCELLED":
      colors = "bg-[#FEE4E2] text-[#B42318] border-[#FEE4E2]";
      break;
    case "INFORMATION":
    case "COMPLETED":
      colors = "bg-[#E8F1FF] text-[#175CD3] border-[#E8F1FF]";
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border",
        colors,
        className
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
