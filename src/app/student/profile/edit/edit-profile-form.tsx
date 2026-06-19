"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentProfileSelfSchema } from "@/lib/validations/profiles";
import { updateStudentProfileSelfAction, uploadAvatarAction } from "@/app/actions/profiles";
import { Phone, MapPin, Calendar, User, HeartHandshake, UploadCloud, Loader2, Save, X, CheckCircle2, AlertCircle } from "lucide-react";

interface EditProfileFormProps {
  initialData: {
    fullName: string;
    phone: string;
    guardianName: string;
    guardianPhone: string;
    address: string;
    dateOfBirth: string | null;
    avatarUrl: string | null;
    studentCode: string;
  };
}

export function EditProfileForm({ initialData }: EditProfileFormProps) {
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
    resolver: zodResolver(studentProfileSelfSchema),
    defaultValues: {
      phone: initialData.phone || "",
      guardianName: initialData.guardianName || "",
      guardianPhone: initialData.guardianPhone || "",
      address: initialData.address || "",
      dateOfBirth: initialData.dateOfBirth || "",
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
      const res = await updateStudentProfileSelfAction(data);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Your profile details have been saved successfully." });
        router.refresh();
        setTimeout(() => {
          router.push("/student/profile");
        }, 1500);
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
          <div className="flex justify-between items-center border-b border-border/30 pb-3">
            <h4 className="text-sm font-extrabold text-primary font-display leading-none">
              Edit Personal Details
            </h4>
            <span className="text-[10px] text-muted uppercase tracking-wider font-extrabold">
              ID: {initialData.studentCode}
            </span>
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

          {/* Locked Fields Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-border/20">
            <div>
              <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                Full Name (Locked)
              </label>
              <input
                type="text"
                disabled
                value={initialData.fullName}
                className="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-2 text-slate-500 font-bold cursor-not-allowed text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                Email Address (Locked)
              </label>
              <input
                type="text"
                disabled
                value={initialData.fullName}
                className="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-2 text-slate-500 font-bold cursor-not-allowed text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone number */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>Mobile Number</span>
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

              {/* Date of birth */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.dateOfBirth ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.dateOfBirth && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.dateOfBirth.message}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Home Address</span>
              </label>
              <textarea
                rows={2}
                placeholder="Enter your current street address, city, and zip code..."
                {...register("address")}
                className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all resize-none ${
                  errors.address ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                }`}
              />
              {errors.address && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.address.message}</p>}
            </div>

            <div className="border-t border-border/30 pt-4">
              <h5 className="text-[11px] uppercase tracking-wider font-extrabold text-muted mb-3 flex items-center gap-1">
                <HeartHandshake className="h-3.5 w-3.5 text-primary" />
                <span>Guardian details</span>
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guardian Name */}
                <div>
                  <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>Guardian Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Father/Mother/Guardian name"
                    {...register("guardianName")}
                    className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                      errors.guardianName ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                    }`}
                  />
                  {errors.guardianName && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.guardianName.message}</p>}
                </div>

                {/* Guardian Phone */}
                <div>
                  <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>Guardian Mobile Number</span>
                  </label>
                  <input
                    type="text"
                    placeholder="+8801XXXXXXXXX"
                    {...register("guardianPhone")}
                    className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                      errors.guardianPhone ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                    }`}
                  />
                  {errors.guardianPhone && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.guardianPhone.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
            <button
              type="button"
              onClick={() => router.push("/student/profile")}
              className="px-4 py-2.5 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 primary-btn text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
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
