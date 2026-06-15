import React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = <FolderOpen className="h-10 w-10 text-muted/65" />,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border/80 rounded-2xl bg-bg/25",
        className
      )}
      {...props}
    >
      <div className="p-4 bg-bg border border-border/40 rounded-full mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-primary font-display mb-1.5">{title}</h3>
      <p className="text-sm text-muted font-medium max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
