"use client";

import React, { useState, useEffect } from "react";
import { TeacherSidebar } from "@/components/dashboard/teacher-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MobileDashboardNav } from "@/components/dashboard/mobile-dashboard-nav";
import { supabase } from "@/lib/supabase/client";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "Teacher",
    email: "teacher@coaching.com",
  });

  useEffect(() => {
    async function getUserDetails() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Teacher",
          email: authUser.email || "teacher@coaching.com",
        });
      }
    }
    getUserDetails();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-bg-soft text-text overflow-hidden">
      {/* Desktop sidebar */}
      <TeacherSidebar className="hidden lg:flex lg:w-64 lg:shrink-0" />

      {/* Mobile sidebar drawer */}
      <MobileDashboardNav
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="TEACHER"
      />

      {/* Main viewport area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Portal Header */}
        <DashboardHeader
          role="TEACHER"
          userName={user.name}
          userEmail={user.email}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 focus:outline-none">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
