"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { markNotificationReadAction, markAllNotificationsReadAction } from "@/app/actions/notifications";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import {
  Bell,
  Check,
  CheckSquare,
  UserPlus,
  AlertTriangle,
  Clock,
  ListTodo,
  ChevronRight,
  Loader2,
  MailOpen,
  Mail,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  read_at: string | null;
  created_at: string;
}

export default function TeacherNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchNotifications = async () => {
    try {
      // Get the current user ID
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", userData.user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to load teacher notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time notification changes
    const channel = supabase
      .channel("teacher-notifications-inbox-" + Math.random().toString(36).substring(7))
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    setUpdatingId(id);
    try {
      const res = await markNotificationReadAction(id);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await markAllNotificationsReadAction();
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingAll(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getExactTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryStyles = (type: string) => {
    const t = type.toUpperCase();
    if (t.includes("REGISTRATION") || t.includes("APPROVAL")) {
      return {
        icon: UserPlus,
        bg: "bg-emerald-50 text-emerald-700 border-emerald-100",
        label: "Registration",
      };
    }
    if (t.includes("WARNING") || t.includes("FAILED") || t.includes("SYSTEM")) {
      return {
        icon: AlertTriangle,
        bg: "bg-rose-50 text-rose-700 border-rose-100",
        label: "Warning",
      };
    }
    if (t.includes("SETTINGS")) {
      return {
        icon: Settings,
        bg: "bg-blue-50 text-blue-700 border-blue-100",
        label: "Settings",
      };
    }
    return {
      icon: Bell,
      bg: "bg-slate-50 text-slate-700 border-slate-200",
      label: "General",
    };
  };

  const getRedirectUrl = (entityType: string | null, entityId: string | null) => {
    if (!entityType || !entityId) return null;
    const type = entityType.toLowerCase();

    if (type === "student_profiles" || type === "profiles") {
      return `/teacher/students/${entityId}`;
    }
    if (type === "app_settings") {
      return "/teacher/settings";
    }
    return null;
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.read_at) return false;
    if (filter === "read" && !n.read_at) return false;

    if (categoryFilter !== "all") {
      const styles = getCategoryStyles(n.type);
      if (styles.label.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    }

    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title="Teacher Notifications"
        description="Review student registrations, pending batch admission requests, and system-level alerts."
        actions={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="primary-btn py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckSquare className="h-3.5 w-3.5" />
              )}
              <span>Mark All as Read</span>
            </button>
          )
        }
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border/40 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
              filter === "all"
                ? "bg-primary text-white border-primary"
                : "bg-white border-border hover:bg-slate-50 text-muted"
            }`}
          >
            All Alerts
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 ${
              filter === "unread"
                ? "bg-primary text-white border-primary"
                : "bg-white border-border hover:bg-slate-50 text-muted"
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-lg bg-accent text-[9px] font-extrabold text-white leading-none">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
              filter === "read"
                ? "bg-primary text-white border-primary"
                : "bg-white border-border hover:bg-slate-50 text-muted"
            }`}
          >
            Read
          </button>
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-muted shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-border rounded-xl text-[11px] font-bold text-primary bg-slate-50/50 focus:border-primary focus:outline-none w-full sm:w-44"
          >
            <option value="all">All Categories</option>
            <option value="registration">Registration</option>
            <option value="warning">System Warning</option>
            <option value="settings">Settings Changes</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      {/* Notifications Ledger List */}
      <div className="bg-white border border-border/40 rounded-2xl shadow-sm overflow-hidden divide-y divide-border/20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="h-8 w-8 text-primary/40 animate-spin mb-2" />
            <span className="text-muted font-semibold">Loading teacher notifications...</span>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const styles = getCategoryStyles(notif.type);
            const CatIcon = styles.icon;
            const redirectUrl = getRedirectUrl(notif.related_entity_type, notif.related_entity_id);
            const isRead = !!notif.read_at;

            return (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id, isRead)}
                className={`p-4 flex gap-4 transition-all duration-200 cursor-pointer ${
                  isRead ? "bg-white" : "bg-slate-50/40 hover:bg-slate-50/80"
                }`}
              >
                {/* Category Icon Badge */}
                <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${styles.bg}`}>
                  <CatIcon className="h-4.5 w-4.5" />
                </div>

                {/* Body Text */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className={`text-xs font-extrabold leading-tight ${isRead ? "text-slate-700" : "text-primary font-display"}`}>
                      {notif.title}
                    </h5>
                    {!isRead && (
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-muted leading-relaxed font-normal">
                    {notif.message}
                  </p>

                  {/* Redirection link if valid */}
                  {redirectUrl && (
                    <Link
                      href={redirectUrl}
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold text-primary hover:text-accent transition-colors mt-1.5"
                    >
                      <span>Action Link</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}

                  {/* Dates & States */}
                  <div className="flex items-center gap-2 text-[10px] text-muted font-bold pt-1">
                    <Clock className="h-3.5 w-3.5 text-muted/60" />
                    <span title={getExactTime(notif.created_at)}>{getRelativeTime(notif.created_at)}</span>
                    <span className="text-muted/30">&bull;</span>
                    <span className="font-normal">{getExactTime(notif.created_at)}</span>
                  </div>
                </div>

                {/* Right: Mark Read button indicator */}
                <div className="flex items-center shrink-0 pl-2">
                  {updatingId === notif.id ? (
                    <Loader2 className="h-4.5 w-4.5 text-primary animate-spin" />
                  ) : isRead ? (
                    <div className="p-1 hover:bg-slate-100 rounded-lg text-muted/40 cursor-default" title="Read">
                      <MailOpen className="h-4 w-4" />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(notif.id, isRead);
                      }}
                      className="p-1 hover:bg-primary/5 text-primary hover:text-accent rounded-lg transition-all"
                      title="Mark as Read"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <Bell className="h-10 w-10 text-muted/50 stroke-1 mb-3" />
            <h4 className="text-sm font-bold text-primary">No teacher alerts found</h4>
            <p className="text-xs text-muted font-medium mt-1 max-w-xs leading-relaxed font-normal">
              {filter === "unread"
                ? "No unread student registration tasks or operational notices."
                : "No announcements logged for portal operations."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
