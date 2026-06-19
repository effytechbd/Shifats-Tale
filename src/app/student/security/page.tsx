"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema } from "@/lib/validations/profiles";
import { changePasswordAction, logoutAction } from "@/app/actions/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { supabase } from "@/lib/supabase/client";
import { Shield, KeyRound, Mail, LogOut, Loader2, CheckCircle2, AlertCircle, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentSecurityPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState<"current" | "all" | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword", "");

  // Load current email
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserEmail(data.user.email || null);
      }
    };
    loadSession();
  }, []);

  // Password strength checks
  const checks = {
    length: newPassword.length >= 8,
    lowercase: /[a-z]/.test(newPassword),
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };

  const handlePasswordChange = async (data: any) => {
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await changePasswordAction(data);
      if (res.success) {
        setStatusMessage({ type: "success", text: "Your password has been changed successfully." });
        reset();
      } else {
        setStatusMessage({ type: "error", text: res.message || "Failed to change password." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async (scope: "current" | "all") => {
    setLoggingOut(scope);
    try {
      const res = await logoutAction(scope);
      if (res.success) {
        router.push("/login");
        router.refresh();
      } else {
        alert(res.message || "Logout failed.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during logout.");
    } finally {
      setLoggingOut(null);
    }
  };

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title="Security & Account"
        description="Manage your account password, view your registered email address, or securely sign out of sessions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Email Info & Logouts */}
        <div className="space-y-6">
          {/* Email Card */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-primary font-display uppercase tracking-wider border-b border-border/30 pb-2 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-primary" />
              <span>Registered Email</span>
            </h4>
            <div className="p-3 bg-slate-50/50 rounded-xl border border-border/20">
              <span className="text-[10px] text-muted block font-semibold leading-none mb-1">
                Active Email (Read-Only)
              </span>
              <span className="text-xs font-bold text-slate-800 break-all">{userEmail || "Loading..."}</span>
            </div>
            <p className="text-[10px] text-muted font-normal leading-normal">
              To request a secure email change, please submit an application to the center administration.
            </p>
          </div>

          {/* Sessions Card */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-primary font-display uppercase tracking-wider border-b border-border/30 pb-2 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              <span>Session Management</span>
            </h4>
            <p className="text-[10px] text-muted font-normal leading-normal">
              If you suspect unauthorized access, you can sign out of your current session or clear sessions on all devices.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => handleLogout("current")}
                disabled={loggingOut !== null}
                className="w-full border border-border/80 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {loggingOut === "current" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 text-muted" />
                )}
                <span>Sign Out Current Device</span>
              </button>

              <button
                onClick={() => handleLogout("all")}
                disabled={loggingOut !== null}
                className="w-full bg-rose-50 border border-rose-200/60 hover:bg-rose-100/50 text-rose-700 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {loggingOut === "all" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4 text-rose-500" />
                )}
                <span>Sign Out All Devices</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Change Password Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(handlePasswordChange)}
            className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-5"
          >
            <h4 className="text-sm font-extrabold text-primary font-display border-b border-border/30 pb-3 flex items-center gap-1.5">
              <KeyRound className="h-4.5 w-4.5 text-primary" />
              <span>Change Password</span>
            </h4>

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
              {/* Current Password */}
              <div>
                <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your current account password..."
                  {...register("currentPassword")}
                  className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                    errors.currentPassword ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                  }`}
                />
                {errors.currentPassword && (
                  <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter a strong new password..."
                    {...register("newPassword")}
                    className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                      errors.newPassword ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-[10px] text-muted uppercase tracking-wider block font-semibold leading-none mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Verify your new password..."
                    {...register("confirmPassword")}
                    className={`w-full bg-slate-50/50 border rounded-xl px-3 py-2.5 font-bold text-slate-800 text-xs focus:outline-none focus:border-primary transition-all ${
                      errors.confirmPassword ? "border-rose-400 focus:border-rose-500" : "border-border/60"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {/* Password strength visual guidelines */}
              <div className="bg-slate-50 p-4 rounded-xl border border-border/20 space-y-2">
                <span className="text-[10px] text-muted uppercase tracking-wider block font-semibold">
                  Password Strength Requirements:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className={`flex items-center gap-1.5 ${checks.length ? "text-emerald-700" : "text-muted"}`}>
                    {checks.length ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.number ? "text-emerald-700" : "text-muted"}`}>
                    {checks.number ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    <span>At least one number (0-9)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.lowercase ? "text-emerald-700" : "text-muted"}`}>
                    {checks.lowercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    <span>At least one lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${checks.uppercase ? "text-emerald-700" : "text-muted"}`}>
                    {checks.uppercase ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    <span>At least one uppercase letter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-3 border-t border-border/30">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
