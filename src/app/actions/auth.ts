"use server";

import { createClient } from "@/lib/supabase/server";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { passwordChangeSchema } from "@/lib/validations/profiles";
import { createAuditLog } from "@/lib/audit";

/**
 * Changes the current user's password securely using Supabase Auth.
 */
export async function changePasswordAction(rawInput: any) {
  try {
    const { profile } = await resolveAuthenticatedDestination();
    if (!profile) {
      return { success: false, message: "Unauthorized" };
    }

    const validated = passwordChangeSchema.safeParse(rawInput);
    if (!validated.success) {
      return { success: false, errors: validated.error.flatten().fieldErrors };
    }

    const { currentPassword, newPassword } = validated.data;
    const supabase = await createClient();

    // Verify current password by attempting a silent sign-in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    });

    if (verifyError) {
      return { success: false, message: "Invalid current password. Please try again." };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { success: false, message: `Failed to update password: ${updateError.message}` };
    }

    // Audit log
    await createAuditLog({
      actorProfileId: profile.id,
      action: "USER_PASSWORD_CHANGED",
      entityType: "profiles",
      entityId: profile.id,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || "Internal server error" };
  }
}

/**
 * Logs out the current user session or all sessions globally.
 */
export async function logoutAction(scope: "current" | "all" = "current") {
  try {
    const supabase = await createClient();
    
    // Log audit log before sign out if we have session info
    const { profile } = await resolveAuthenticatedDestination();
    if (profile) {
      await createAuditLog({
        actorProfileId: profile.id,
        action: scope === "all" ? "USER_LOGGED_OUT_GLOBAL" : "USER_LOGGED_OUT",
        entityType: "profiles",
        entityId: profile.id,
      });
    }

    const { error } = await supabase.auth.signOut({
      scope: scope === "all" ? "global" : "local",
    });

    if (error) {
      return { success: false, message: `Logout failed: ${error.message}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || "Internal server error" };
  }
}
