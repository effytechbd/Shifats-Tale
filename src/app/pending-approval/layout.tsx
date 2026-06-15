import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PendingApprovalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-soft flex flex-col justify-between p-6 selection:bg-accent selection:text-primary">
      {/* Top logo */}
      <div className="flex justify-center pt-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary text-white rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="font-extrabold text-base tracking-wide font-display text-primary leading-none">
            SHIFAT'S TALES
          </span>
        </div>
      </div>

      {/* Main card */}
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-white border border-border/60 rounded-2xl p-8 shadow-sm text-center">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="text-center text-[11px] font-semibold text-muted pb-4">
        &copy; {new Date().getFullYear()} Shifat's Tales &bull; Portal Access Verification
      </div>
    </div>
  );
}
