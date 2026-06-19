import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EditProfileForm } from "./edit-profile-form";
import { ShieldAlert } from "lucide-react";

export default async function StudentProfileEditPage() {
  const { profile, studentProfile } = await resolveAuthenticatedDestination();

  if (!profile || !studentProfile) {
    redirect("/login");
  }

  const initialData = {
    fullName: profile.full_name,
    phone: profile.phone || "",
    guardianName: studentProfile.guardian_name,
    guardianPhone: studentProfile.guardian_phone,
    address: studentProfile.address,
    dateOfBirth: studentProfile.date_of_birth,
    avatarUrl: profile.avatar_url,
    studentCode: studentProfile.student_code,
  };

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title="Edit Profile"
        description="Update your contact number, home address, guardian contact, or upload a new profile photograph."
      />

      <EditProfileForm initialData={initialData} />
    </div>
  );
}
