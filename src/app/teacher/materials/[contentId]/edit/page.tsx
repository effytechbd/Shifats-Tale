import React from "react";
import { redirect, notFound } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { MaterialForm } from "@/components/materials/material-form";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";

interface PageProps {
  params: Promise<{
    contentId: string;
  }>;
}

export default async function EditMaterialPage({ params }: PageProps) {
  const { contentId } = await params;
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

  // Load the target material
  const { data: material, error } = await admin
    .from("batch_contents")
    .select("*")
    .eq("id", contentId)
    .single();

  if (error || !material) {
    notFound();
  }

  // Load all batches for selection
  const { data: batches } = await admin
    .from("batches")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Edit Study Material"
        description={`Update metadata, status, release schedules, or replace the uploaded file for ${material.title}.`}
      />
      <MaterialForm
        batches={batches || []}
        initialData={material as any}
      />
    </div>
  );
}
