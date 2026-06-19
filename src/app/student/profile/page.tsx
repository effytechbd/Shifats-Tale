import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { User, Phone, MapPin, Calendar, Mail, ShieldAlert, GraduationCap, School, HeartHandshake, Edit2 } from "lucide-react";

export default async function StudentProfilePage() {
  const { profile, studentProfile } = await resolveAuthenticatedDestination();
  const supabase = await createClient();

  if (!profile || !studentProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert className="h-10 w-10 text-rose-500 mb-3" />
        <h4 className="text-sm font-bold text-primary">Failed to load profile</h4>
        <p className="text-xs text-muted mt-1">Please sign in again to access your account.</p>
      </div>
    );
  }

  // Fetch coaching center settings
  const { data: settings } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", true)
    .single();

  // Fetch enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, batches(*)")
    .eq("student_id", studentProfile.id);

  const activeEnrollments = enrollments?.filter((e) => e.status === "ACTIVE") || [];
  const completedEnrollments = enrollments?.filter((e) => e.status === "COMPLETED") || [];

  const registrationDate = studentProfile.registered_at
    ? new Date(studentProfile.registered_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Available";

  const dob = studentProfile.date_of_birth
    ? new Date(studentProfile.date_of_birth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Set";

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title="My Profile"
        description="View your enrollment status, personal information, and guardian details."
        actions={
          <Link
            href="/student/profile/edit"
            className="primary-btn py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02]"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Basic Status Card */}
        <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="h-28 w-28 rounded-2xl object-cover border-2 border-primary/10 shadow-inner"
              />
            ) : (
              <div className="h-28 w-28 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-display text-3xl font-extrabold flex items-center justify-center border-2 border-primary/10 shadow-md">
                {getInitials(profile.full_name)}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary leading-tight font-display">{profile.full_name}</h3>
            <p className="text-muted text-[10px] uppercase font-extrabold tracking-wider mt-1">
              ID: {studentProfile.student_code}
            </p>
          </div>

          <div className="w-full border-t border-border/30 pt-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted font-semibold">Account status:</span>
              <StatusBadge status={profile.account_status} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted font-semibold">Registration:</span>
              <StatusBadge status={studentProfile.registration_status} />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted font-semibold">Joined Date:</span>
              <span className="font-bold text-slate-800">{registrationDate}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Detailed Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detailed Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-6">
            <div>
              <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 mb-4">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Email address</span>
                    <span className="text-xs font-bold text-slate-800">{profile.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Mobile number</span>
                    <span className="text-xs font-bold text-slate-800">{profile.phone || "Not Set"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Academic level</span>
                    <span className="text-xs font-bold text-slate-800">{studentProfile.academic_level}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <School className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Educational institution</span>
                    <span className="text-xs font-bold text-slate-800">{studentProfile.institution}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Date of Birth</span>
                    <span className="text-xs font-bold text-slate-800">{dob}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Address</span>
                    <span className="text-xs font-bold text-slate-800 leading-normal">{studentProfile.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 mb-4">
                Guardian Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Guardian name</span>
                    <span className="text-xs font-bold text-slate-800">{studentProfile.guardian_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted block font-semibold leading-none mb-0.5">Guardian mobile number</span>
                    <span className="text-xs font-bold text-slate-800">{studentProfile.guardian_phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Batches Enrollments Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Batches */}
        <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2">
            Active Batch Enrollments
          </h4>
          {activeEnrollments.length > 0 ? (
            <div className="space-y-3">
              {activeEnrollments.map((enr) => (
                <div key={enr.id} className="p-3 bg-slate-50/50 rounded-xl border border-border/20 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold text-xs text-slate-800 font-display leading-none mb-1">
                      {enr.batches?.name}
                    </p>
                    <p className="text-[10px] font-semibold text-muted leading-none">
                      Code: {enr.batches?.code} &bull; Class: {enr.batches?.academic_level}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100">
                    Active
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted font-medium text-[11px]">
              No active batches enrollments found.
            </div>
          )}
        </div>

        {/* Completed Batches (Conditional) */}
        {(!settings || settings.completed_batches_visible) && (
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2">
              Completed Batches
            </h4>
            {completedEnrollments.length > 0 ? (
              <div className="space-y-3">
                {completedEnrollments.map((enr) => (
                  <div key={enr.id} className="p-3 bg-slate-50/50 rounded-xl border border-border/20 flex justify-between items-center">
                    <div>
                      <p className="font-extrabold text-xs text-slate-800 font-display leading-none mb-1">
                        {enr.batches?.name}
                      </p>
                      <p className="text-[10px] font-semibold text-muted leading-none">
                        Code: {enr.batches?.code} &bull; Class: {enr.batches?.academic_level}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-200">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted font-medium text-[11px]">
                No completed batches found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
