import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded bg-border/50", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="space-y-2.5 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full bg-white border border-border/60 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <div className="md:col-span-2 lg:col-span-3">
        <TableSkeleton />
      </div>
    </div>
  );
}
