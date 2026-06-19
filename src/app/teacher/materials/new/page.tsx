import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { MaterialForm } from "@/components/materials/material-form";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";

interface NewPageProps {
  searchParams: Promise<{
    batchId?: string;
  }>;
}

export default async function NewMaterialPage({ searchParams }: NewPageProps) {
  const sp = await searchParams;
  const preselectedBatchId = sp.batchId || "";

  const { destination } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination === "STUDENT_DASHBOARD") {
    redirect("/student");
  }
  if (destination === "PENDING_APPROVAL") {
    redirect("/pending-approval");
  }
  if (destination === "ACCOUNT_DISABLED") {
    redirect("/account-disabled");
  }
  if (destination === "INVALID_PROFILE") {
    redirect("/login?error=invalid_profile");
  }

  const admin = createAdminClient();

  // Load all batches for the dropdown
  const { data: batches } = await admin
    .from("batches")
    .select("id, name")
    .order("name", { ascending: true });

  const initialData = preselectedBatchId
    ? {
        batch_id: preselectedBatchId,
      } as any
    : undefined;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Add New Study Material"
        description="Upload handouts, secure PDF notes, homework assignments, or link reference videos to your student batches."
      />
      <MaterialForm batches={batches || []} initialData={initialData} />
    </div>
  );
}
