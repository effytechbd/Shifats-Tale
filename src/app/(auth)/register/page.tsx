"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, User, Phone, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  role: z.enum(["STUDENT", "TEACHER"]),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: data.role,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-border/60 rounded-2xl p-8 shadow-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold font-display text-primary mb-2">
          Registration Complete
        </h2>
        <p className="text-sm text-muted font-medium mb-6 leading-relaxed">
          Please check your email to verify your account before logging in.
        </p>
        <Link
          href="/login"
          className="w-full primary-btn py-2.5 rounded-xl text-sm font-bold block"
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-border/60 rounded-2xl p-8 shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-display text-primary leading-tight">
          Create Account
        </h2>
        <p className="text-xs text-muted font-medium mt-1">
          Register your details to access the coaching portal
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200/60 rounded-xl text-rose-700 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              {...register("fullName")}
              className="w-full pl-10 pr-4 py-2.5 bg-bg/30 border border-border/80 focus:border-primary/40 focus:ring-1 focus:ring-primary/45 rounded-xl text-sm transition-all focus:outline-none placeholder-muted font-medium"
              placeholder="Adnan Wahid"
            />
          </div>
          {errors.fullName && (
            <p className="text-rose-600 text-xs font-bold mt-1.5 leading-none pl-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
              <Mail className="h-4 w-4" />
            </span>
            <input
              type="email"
              {...register("email")}
              className="w-full pl-10 pr-4 py-2.5 bg-bg/30 border border-border/80 focus:border-primary/40 focus:ring-1 focus:ring-primary/45 rounded-xl text-sm transition-all focus:outline-none placeholder-muted font-medium"
              placeholder="adnan@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-rose-600 text-xs font-bold mt-1.5 leading-none pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
              <Phone className="h-4 w-4" />
            </span>
            <input
              type="tel"
              {...register("phone")}
              className="w-full pl-10 pr-4 py-2.5 bg-bg/30 border border-border/80 focus:border-primary/40 focus:ring-1 focus:ring-primary/45 rounded-xl text-sm transition-all focus:outline-none placeholder-muted font-medium"
              placeholder="01700000000"
            />
          </div>
          {errors.phone && (
            <p className="text-rose-600 text-xs font-bold mt-1.5 leading-none pl-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Role Toggle Selector */}
        <div>
          <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setValue("role", "STUDENT")}
              className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all ${
                selectedRole === "STUDENT"
                  ? "bg-accent border-accent text-primary shadow-sm"
                  : "bg-bg/30 border-border/80 text-muted hover:border-primary/20 hover:text-primary"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setValue("role", "TEACHER")}
              className={`py-2 px-4 rounded-xl text-sm font-bold border transition-all ${
                selectedRole === "TEACHER"
                  ? "bg-accent border-accent text-primary shadow-sm"
                  : "bg-bg/30 border-border/80 text-muted hover:border-primary/20 hover:text-primary"
              }`}
            >
              Teacher / Admin
            </button>
          </div>
          {errors.role && (
            <p className="text-rose-600 text-xs font-bold mt-1.5 leading-none pl-1">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Passwords grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                {...register("password")}
                className="w-full pl-10 pr-4 py-2.5 bg-bg/30 border border-border/80 focus:border-primary/40 focus:ring-1 focus:ring-primary/45 rounded-xl text-sm transition-all focus:outline-none placeholder-muted font-medium text-xs sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-[10px] sm:text-xs font-bold mt-1.5 leading-none pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-primary mb-1.5 uppercase tracking-wide">
              Confirm
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full pl-10 pr-4 py-2.5 bg-bg/30 border border-border/80 focus:border-primary/40 focus:ring-1 focus:ring-primary/45 rounded-xl text-sm transition-all focus:outline-none placeholder-muted font-medium text-xs sm:text-sm"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-rose-600 text-[10px] sm:text-xs font-bold mt-1.5 leading-none pl-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full primary-btn py-2.5 mt-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-border/30 text-center">
        <p className="text-xs text-muted font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:text-accent transition-colors"
          >
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
}
