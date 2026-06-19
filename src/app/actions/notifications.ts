"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

/**
 * Marks a specific notification as read.
 */
export async function markNotificationReadAction(notificationId: string) {
  try {
    const { profile } = await resolveAuthenticatedDestination();
    if (!profile) {
      return { success: false, message: "Unauthorized" };
    }

    const admin = createAdminClient();

    // Verify ownership of the notification
    const { data: notif, error: fetchErr } = await admin
      .from("notifications")
      .select("user_id")
      .eq("id", notificationId)
      .single();

    if (fetchErr || !notif) {
      return { success: false, message: "Notification not found." };
    }

    if (notif.user_id !== profile.id) {
      return { success: false, message: "Unauthorized: You can only modify your own notifications." };
    }

    // Update read_at timestamp
    const { error: updateErr } = await admin
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (updateErr) {
      return { success: false, message: `Failed to mark notification as read: ${updateErr.message}` };
    }

    revalidatePath("/student/notifications");
    revalidatePath("/teacher/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || "Internal server error" };
  }
}

/**
 * Marks all notifications for the active user as read.
 */
export async function markAllNotificationsReadAction() {
  try {
    const { profile } = await resolveAuthenticatedDestination();
    if (!profile) {
      return { success: false, message: "Unauthorized" };
    }

    const admin = createAdminClient();

    // Update all unread notifications for this user
    const { error: updateErr } = await admin
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", profile.id)
      .is("read_at", null);

    if (updateErr) {
      return { success: false, message: `Failed to mark all as read: ${updateErr.message}` };
    }

    revalidatePath("/student/notifications");
    revalidatePath("/teacher/notifications");
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || "Internal server error" };
  }
}
