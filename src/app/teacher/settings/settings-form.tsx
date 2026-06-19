"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appSettingsSchema } from "@/lib/validations/profiles";
import { updateAppSettingsAction } from "@/app/actions/profiles";
import { 
  Building, 
  Code, 
  Phone, 
  Mail, 
  MapPin, 
  Coins, 
  Globe, 
  Calendar, 
  Award, 
  HelpCircle, 
  Eye, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  X
} from "lucide-react";

interface SettingsFormProps {
  initialData: {
    coachingCenterName: string;
    shortName: string;
    studentIdPrefix: string;
    publicPhone: string;
    publicEmail: string;
    address: string;
    defaultCurrency: string;
    defaultTimezone: string;
    academicSession: string;
    defaultGradingScale: string;
    pendingApprovalContactText: string;
    disabledAccountContactText: string;
    studentRankVisible: boolean;
    completedBatchesVisible: boolean;
    gradesDisplayed: boolean;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appSettingsSchema),
    defaultValues: {
      coachingCenterName: initialData.coachingCenterName || "",
      shortName: initialData.shortName || "",
      studentIdPrefix: initialData.studentIdPrefix || "",
      publicPhone: initialData.publicPhone || "",
      publicEmail: initialData.publicEmail || "",
      address: initialData.address || "",
      defaultCurrency: initialData.defaultCurrency || "BDT",
      defaultTimezone: initialData.defaultTimezone || "Asia/Dhaka",
      academicSession: initialData.academicSession || "2026",
      defaultGradingScale: initialData.defaultGradingScale || "STANDARD",
      pendingApprovalContactText: initialData.pendingApprovalContactText || "",
      disabledAccountContactText: initialData.disabledAccountContactText || "",
      studentRankVisible: initialData.studentRankVisible,
      completedBatchesVisible: initialData.completedBatchesVisible,
      gradesDisplayed: initialData.gradesDisplayed,
    },
  });

  const studentIdPrefix = watch("studentIdPrefix");
  const isPrefixModified = studentIdPrefix !== initialData.studentIdPrefix;

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await updateAppSettingsAction(data);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Application configurations saved successfully." });
        router.refresh();
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to update configurations." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-xs font-bold text-primary">
      {/* Warnings & Alerts */}
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

      {isPrefixModified && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <span className="text-[11px] font-extrabold uppercase text-amber-900 block leading-tight">
              Student ID Prefix Warning
            </span>
            <p className="text-[10px] text-amber-800 font-normal mt-1 leading-relaxed">
              Changing the Student ID prefix setting will affect future enrollments only. Existing Student IDs will remain unchanged. Please ensure this matches your administrative structure.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Fields Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coaching center Identity */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 flex items-center gap-1.5">
              <Building className="h-4.5 w-4.5 text-primary" />
              <span>Identity & Prefix Settings</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Coaching Center Name
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

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Short Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. ST"
                  {...register("shortName")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.shortName ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.shortName && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.shortName.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Student ID Prefix
                </label>
                <input
                  type="text"
                  placeholder="e.g. ST"
                  {...register("studentIdPrefix")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.studentIdPrefix ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.studentIdPrefix && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.studentIdPrefix.message}</p>}
              </div>
            </div>
          </div>

          {/* Contact settings */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 flex items-center gap-1.5">
              <Phone className="h-4.5 w-4.5 text-primary" />
              <span>Public Contact Details</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Public Phone
                </label>
                <input
                  type="text"
                  placeholder="+8801XXXXXXXXX"
                  {...register("publicPhone")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.publicPhone ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.publicPhone && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.publicPhone.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Public Email Address
                </label>
                <input
                  type="text"
                  placeholder="contact@center.com"
                  {...register("publicEmail")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.publicEmail ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.publicEmail && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.publicEmail.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Address Location
                </label>
                <input
                  type="text"
                  placeholder="Street details..."
                  {...register("address")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.address ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.address && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 flex items-center gap-1.5">
              <Globe className="h-4.5 w-4.5 text-primary" />
              <span>Localization & Grading Settings</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Default Currency
                </label>
                <select
                  {...register("defaultCurrency")}
                  className="w-full bg-slate-50/50 border border-border/60 rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                  <option value="USD">USD ($) - US Dollar</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Timezone
                </label>
                <select
                  {...register("defaultTimezone")}
                  className="w-full bg-slate-50/50 border border-border/60 rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                  <option value="UTC">UTC / GMT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Academic Session
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026"
                  {...register("academicSession")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.academicSession ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.academicSession && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.academicSession.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Default Grading Scale
                </label>
                <select
                  {...register("defaultGradingScale")}
                  className="w-full bg-slate-50/50 border border-border/60 rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="STANDARD">Standard Academic (GPA 5.0)</option>
                  <option value="PERCENTAGE">Percentage Points (0-100%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Locked status details */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5 text-primary" />
              <span>Gating System Message Text</span>
            </h4>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Contact Instructions (Pending Approval Gate Page)
                </label>
                <textarea
                  rows={2}
                  placeholder="Text shown when students are waiting for approval..."
                  {...register("pendingApprovalContactText")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all resize-none ${
                    errors.pendingApprovalContactText ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.pendingApprovalContactText && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.pendingApprovalContactText.message}</p>}
              </div>

              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Contact Instructions (Disabled Account Gate Page)
                </label>
                <textarea
                  rows={2}
                  placeholder="Text shown when accounts are suspended..."
                  {...register("disabledAccountContactText")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all resize-none ${
                    errors.disabledAccountContactText ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.disabledAccountContactText && <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.disabledAccountContactText.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Checkbox Options */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-2 flex items-center gap-1.5">
              <Eye className="h-4.5 w-4.5 text-primary" />
              <span>Portal Access Options</span>
            </h4>

            <div className="space-y-4">
              {/* Rank Visibility */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("studentRankVisible")}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-primary block leading-none">
                    Student Ranks Visible
                  </span>
                  <span className="text-[10px] text-muted font-normal mt-1 block leading-normal">
                    Allow students to view their class rankings on published examinations.
                  </span>
                </div>
              </label>

              {/* Completed Batches Visibility */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("completedBatchesVisible")}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-primary block leading-none">
                    Completed Batches Visible
                  </span>
                  <span className="text-[10px] text-muted font-normal mt-1 block leading-normal">
                    Show completed batches on student profile timelines.
                  </span>
                </div>
              </label>

              {/* Grades Displayed */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register("gradesDisplayed")}
                  className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-primary block leading-none">
                    Display Grades (e.g. GPA, Letter Grades)
                  </span>
                  <span className="text-[10px] text-muted font-normal mt-1 block leading-normal">
                    Display letter grades or raw scores to students rather than pass/fail status.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions Card */}
          <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Saving Settings...</span>
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push("/teacher")}
              className="w-full py-2.5 border border-border bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
            >
              <X className="h-4 w-4 text-muted" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
