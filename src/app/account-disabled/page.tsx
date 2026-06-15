"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut, Loader2, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { siteInfo } from "@/data/site";

export default function AccountDisabledPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert icon */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/60 animate-bounce">
        <ShieldAlert className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold font-display text-primary leading-tight">
          Account Disabled
        </h2>
        <p className="text-sm text-muted font-medium leading-relaxed max-w-sm mx-auto">
          Your portal access credentials have been locked or archived. Please contact Sir to reactivate your student access status.
        </p>
      </div>

      <div className="pt-4 border-t border-border/40 space-y-3">
        <a
          href={`tel:${siteInfo.phone.replace(/[\s-]/g, "")}`}
          className="w-full primary-btn py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
        >
          <Phone className="h-4 w-4" />
          <span>Call Sir</span>
        </a>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted hover:text-primary py-2.5 rounded-xl transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
