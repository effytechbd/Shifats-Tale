"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherProfileSelfSchema } from "@/lib/validations/profiles";
import { updateTeacherProfileSelfAction, uploadAvatarAction } from "@/app/actions/profiles";
import { Phone, Mail, User, Shield, Briefcase, Building, Contact, UploadCloud, Loader2, Save, X, CheckCircle2, AlertCircle } from "lucide-react";

interface TeacherProfileFormProps {
  initialData: {
    fullName: string;
    phone: string;
    email: string;
    designation: string;
    coachingCenterName: string;
    publicContactInfo: string;
    avatarUrl: string | null;
  };
}

export function TeacherProfileForm({ initialData }: TeacherProfileFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(initialData.avatarUrl);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teacherProfileSelfSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      designation: initialData.designation || "",
      coachingCenterName: initialData.coachingCenterName || "",
      publicContactInfo: initialData.publicContactInfo || "",
      avatarUrl: initialData.avatarUrl || null,
    },
  });

  // Handle on-change Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadAvatarAction(formData);
      if (res.success && res.avatarUrl) {
        setCurrentAvatarUrl(res.avatarUrl);
        setStatusMessage({ type: "success", text: "Profile photograph updated successfully." });
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to upload photograph." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to upload photograph." });
    } finally {
      setUploading(false);
    }
  };

  // Handle Form Submission
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await updateTeacherProfileSelfAction(data);
      if (res.success) {
        let msg = "Your profile details have been saved successfully.";
        if (res.emailChangeTriggered) {
          msg += " A confirmation email has been sent to your new address to verify the change.";
        }
        setStatusMessage({ type: "success", text: msg });
        router.refresh();
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to save profile." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-bold text-primary">
      {/* Left Column: Photograph Upload Box */}
      <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm flex flex-col items-center text-center space-y-4 h-fit">
        <h4 className="text-xs font-extrabold text-primary font-display uppercase tracking-wider self-start border-b border-border/30 pb-2 w-full text-left">
          Profile Photograph
        </h4>
        <div className="relative group">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt={initialData.fullName}
              className="h-28 w-28 rounded-2xl object-cover border border-border shadow-inner"
            />
          ) : (
            <div className="h-28 w-28 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-display text-3xl font-extrabold flex items-center justify-center border shadow-md">
              {getInitials(initialData.fullName)}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            </div>
          )}
        </div>

        <div className="w-full">
          <label className="w-full primary-btn hover:bg-slate-50 py-2.5 px-4 rounded-xl border border-border/60 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-sm">
            <UploadCloud className="h-4 w-4 text-muted" />
            <span>{uploading ? "Uploading..." : "Change Photo"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-[10px] text-muted font-normal mt-2 leading-relaxed">
            Supports JPG, PNG or WEBP. Max size 5MB. Photo will be auto-cropped to a square.
          </p>
        </div>
      </div>

      {/* Right Column: Editable Profile Fields Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-6">
          <div className="border-b border-border/30 pb-3">
            <h4 className="text-sm font-extrabold text-primary font-display leading-none">
              Edit Teacher Profile
            </h4>
          </div>

          {/* Status Message Alerts */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                statusMessage.type === "success"
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-800"
                  : "bg-rose-50/50 border-rose-200 text-rose-800"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <span className="font-semibold text-xs leading-normal">{statusMessage.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Teacher Full Name"
                  {...register("fullName")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.fullName ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.fullName && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>Email Address</span>
                </label>
                <input
                  type="text"
                  placeholder="teacher@example.com"
                  {...register("email")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.email ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.email && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.email.message}</p>}
                <p className="text-[9px] text-muted font-normal mt-1">Changing email requires verifying the new email address.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone number */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  placeholder="+8801XXXXXXXXX"
                  {...register("phone")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.phone ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.phone && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.phone.message}</p>}
              </div>

              {/* Designation */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  <span>Designation</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder & Head Instructor"
                  {...register("designation")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.designation ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.designation && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.designation.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coaching Center Name */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>Coaching Center Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shifat's Tales"
                  {...register("coachingCenterName")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.coachingCenterName ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.coachingCenterName && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.coachingCenterName.message}</p>}
              </div>

              {/* Public Contact Information */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Contact className="h-3 w-3" />
                  <span>Public Contact Info</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. +8801700000000, contact@shifatstales.com"
                  {...register("publicContactInfo")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.publicContactInfo ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.publicContactInfo && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.publicContactInfo.message}</p>}
              </div>
            </div>

            {/* Role Info Lock warning */}
            <div className="bg-slate-50 p-4 rounded-xl border border-border/20 flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-primary uppercase tracking-wider block font-extrabold">
                  System Role Locked
                </span>
                <p className="text-[10px] text-muted font-normal mt-0.5 leading-normal">
                  Your system role is <strong>TEACHER</strong>. Role modifications are prohibited via the user interface.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
            <button
              type="button"
              onClick={() => router.push("/teacher")}
              className="px-4 py-2.5 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
