import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { TeacherProfileForm } from "./teacher-profile-form";
import { ShieldAlert } from "lucide-react";

export default async function TeacherProfilePage() {
  const { profile, destination } = await resolveAuthenticatedDestination();

  if (destination !== "TEACHER_DASHBOARD" || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch teacher profile
  const { data: teacherProfile } = await supabase
    .from("teacher_profiles")
    .select("*")
    .eq("profile_id", profile.id)
    .maybeSingle();

  const initialData = {
    fullName: profile.full_name,
    phone: profile.phone || "",
    email: profile.email,
    designation: teacherProfile?.designation || "Founder & Head Instructor",
    coachingCenterName: teacherProfile?.coaching_center_name || "Shifat's Tales",
    publicContactInfo: teacherProfile?.public_contact_info || profile.phone || "",
    avatarUrl: profile.avatar_url,
  };

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Teacher Profile"
        description="Update your personal identification, public contact methods, and designation credentials."
      />

      <TeacherProfileForm initialData={initialData} />
    </div>
  );
}
