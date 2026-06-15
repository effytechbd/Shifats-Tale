import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  hoverEffect?: boolean;
}

export function DashboardCard({
  children,
  title,
  description,
  icon,
  footer,
  hoverEffect = true,
  className,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-border/60 rounded-2xl p-6 shadow-sm shadow-primary/5 transition-all duration-300",
        hoverEffect && "hover:shadow-md hover:border-primary/15 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-bold text-primary font-display leading-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-muted leading-relaxed font-sans font-medium">
                {description}
              </p>
            )}
          </div>
          {icon && (
            <div className="p-3 bg-bg border border-border/40 rounded-xl text-primary flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
        </div>
      )}
      <div className="text-text font-sans">{children}</div>
      {footer && (
        <div className="mt-5 pt-4 border-t border-border/40 text-xs text-muted flex items-center font-medium">
          {footer}
        </div>
      )}
    </div>
  );
}
