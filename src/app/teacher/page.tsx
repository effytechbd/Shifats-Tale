import React from "react";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users, Plus, CheckSquare } from "lucide-react";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Title & Portal Stats */}
      <DashboardPageHeader
        title="Teacher Portal Overview"
        description="Admin dashboard for batch scheduling, enrollments, student approvals, and portal updates."
        actions={
          <button
            type="button"
            className="primary-btn py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-accent/15 hover:shadow-accent/25 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Create Batch</span>
          </button>
        }
      />

      {/* Grid of detail summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending approvals section */}
        <DashboardCard
          title="Student Approvals"
          description="Verification requests from new registrations"
          icon={<Users className="h-5 w-5 text-primary" />}
        >
          <EmptyState
            title="No Approvals Pending"
            description="When new students sign up, their registration verification requests will list here."
            className="border-none p-6 bg-slate-50/50"
          />
        </DashboardCard>

        {/* Action item checklists */}
        <DashboardCard
          title="Administrative Checklist"
          description="Portal status task checklist"
          icon={<CheckSquare className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3 p-3 bg-bg/40 border border-border/50 rounded-xl">
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/30"
              />
              <span className="text-xs font-bold text-primary/80 line-through">
                Establish Supabase Auth integration
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-bg/40 border border-border/50 rounded-xl">
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/30"
              />
              <span className="text-xs font-bold text-primary/80 line-through">
                Design custom dashboard layout frameworks
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-bg/40 border border-border/50 rounded-xl">
              <input
                type="checkbox"
                disabled
                className="h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/30"
              />
              <span className="text-xs font-bold text-primary">
                Configure database policies and access controls
              </span>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
