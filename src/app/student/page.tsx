import React from "react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Calendar, Bell, BookOpen, Clock } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <DashboardPageHeader
        title="Student Overview"
        description="Welcome to your learning dashboard. Here you can track your registered batches, payments, and notices."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase">Enrollment:</span>
            <StatusBadge status="ACTIVE" />
          </div>
        }
      />

      {/* Grid of details containers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notice/Announcement container */}
        <DashboardCard
          title="Announcements"
          description="Latest updates from your teacher"
          icon={<Bell className="h-5 w-5 text-accent" />}
        >
          <EmptyState
            title="No Announcements Today"
            description="All notices and notifications from your teacher will appear here."
            className="border-none p-6 bg-slate-50/50"
          />
        </DashboardCard>

        {/* Classes/Schedules list placeholder */}
        <DashboardCard
          title="Active Classes & Batches"
          description="Your scheduled session list"
          icon={<BookOpen className="h-5 w-5 text-accent" />}
        >
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center justify-between p-3.5 bg-bg/40 border border-border/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-primary shadow-sm border border-border/40">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">HSC Physics Admission</h4>
                  <p className="text-[11px] font-semibold text-muted mt-0.5">Every Saturday, Monday, Wednesday</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
                <Clock className="h-3.5 w-3.5" />
                <span>04:30 PM</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-bg/40 border border-border/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg text-primary shadow-sm border border-border/40">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Higher Mathematics Batch A</h4>
                  <p className="text-[11px] font-semibold text-muted mt-0.5">Every Sunday, Tuesday, Thursday</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
                <Clock className="h-3.5 w-3.5" />
                <span>06:00 PM</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
