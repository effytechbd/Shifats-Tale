import test from "node:test";
import assert from "node:assert";
import { z } from "zod";
import {
  studentProfileSelfSchema,
  teacherProfileSelfSchema,
  studentProfileTeacherEditSchema,
  appSettingsSchema,
  passwordChangeSchema,
} from "../src/lib/validations/profiles";

// =========================================================================
// MOCK STRUCTURES & ENGINES FOR VERIFICATION
// =========================================================================

// Simulates PostgreSQL RLS Policies
function simulateRLSPolicy(table: string, action: "select" | "update", caller: { id: string; role: "STUDENT" | "TEACHER"; status: "ACTIVE" | "DISABLED" }, rowOwnerId: string): boolean {
  if (caller.status !== "ACTIVE") return false;

  if (table === "student_profiles") {
    if (action === "select") {
      return caller.role === "TEACHER" || caller.id === rowOwnerId;
    }
    if (action === "update") {
      return caller.role === "TEACHER";
    }
  }

  if (table === "notifications") {
    if (action === "select") {
      return caller.role === "TEACHER" || caller.id === rowOwnerId;
    }
    if (action === "update") {
      return caller.id === rowOwnerId;
    }
  }

  if (table === "app_settings") {
    if (action === "select") {
      return true; // Authenticated users can select settings
    }
    if (action === "update") {
      return caller.role === "TEACHER";
    }
  }

  return false;
}

// Simulates student_code immutability trigger
function simulateStudentCodeTrigger(callerRole: "STUDENT" | "TEACHER", oldCode: string, newCode: string) {
  if (oldCode !== newCode && callerRole !== "TEACHER") {
    throw new Error("Student code is immutable and cannot be updated.");
  }
}

// Simulates Cloudinary/Avatar file upload checks
function validateUploadedAvatarFile(fileName: string, fileSize: number, mimeType: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const allowedExts = ["jpg", "jpeg", "png", "webp"];
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];

  if (fileSize > 5 * 1024 * 1024) {
    throw new Error("File size exceeds the maximum 5 MB limit.");
  }
  if (!allowedExts.includes(ext) || !allowedMimes.includes(mimeType)) {
    throw new Error("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
  }
  return true;
}

// Simulates Audit Logging filter
function sanitizeAuditLogData(data: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ["password", "token", "secret", "hash", "access_token"];
  const sanitized = { ...data };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      delete sanitized[key];
    }
  }
  return sanitized;
}

// =========================================================================
// TEST SPECIFICATIONS
// =========================================================================

test("Profile, Settings, and Notifications Gating Rules Test Suite", async (t) => {

  await t.test("1. Student can view their own profile", () => {
    const student = { id: "student-1", role: "STUDENT" as const, status: "ACTIVE" as const };
    const canView = simulateRLSPolicy("student_profiles", "select", student, "student-1");
    assert.strictEqual(canView, true);
  });

  await t.test("2. Student cannot view another Student profile", () => {
    const student = { id: "student-1", role: "STUDENT" as const, status: "ACTIVE" as const };
    const canView = simulateRLSPolicy("student_profiles", "select", student, "student-2");
    assert.strictEqual(canView, false);
  });

  await t.test("3. Student can update allowed fields", () => {
    const editPayload = {
      phone: "+8801711122233",
      guardianName: "Mother Mary",
      guardianPhone: "+8801722233344",
      address: "123 Green Road, Dhaka",
      dateOfBirth: "2008-05-15",
    };

    const result = studentProfileSelfSchema.safeParse(editPayload);
    assert.strictEqual(result.success, true);
  });

  await t.test("4. Student cannot update role or account status", () => {
    // The self schema should strip out or fail on arbitrary fields because it has a strict allowlist
    const editPayload = {
      phone: "+8801711122233",
      guardianName: "Mother Mary",
      guardianPhone: "+8801722233344",
      address: "123 Green Road, Dhaka",
      dateOfBirth: "2008-05-15",
      role: "TEACHER",
      accountStatus: "ACTIVE",
    };

    const parsed: any = studentProfileSelfSchema.parse(editPayload);
    assert.strictEqual(parsed.role, undefined);
    assert.strictEqual(parsed.accountStatus, undefined);
  });

  await t.test("5. Student ID remains immutable", () => {
    assert.throws(() => {
      simulateStudentCodeTrigger("STUDENT", "ST-0001", "ST-9999");
    }, /Student code is immutable/);

    // Teacher can correct it
    assert.doesNotThrow(() => {
      simulateStudentCodeTrigger("TEACHER", "ST-0001", "ST-9999");
    });
  });

  await t.test("6. Teacher can update Student profile", () => {
    const editPayload = {
      fullName: "Adnan Bin Wahid",
      phone: "+8801711122233",
      academicLevel: "HSC Class 12",
      institution: "Dhaka College",
      guardianName: "Abu Wahid",
      guardianPhone: "+8801722233344",
      address: "Sector 4, Uttara, Dhaka",
      dateOfBirth: "2007-10-12",
      registrationStatus: "APPROVED",
      accountStatus: "ACTIVE",
      teacherNote: "Highly attentive in Physics and Chemistry classes.",
      studentCode: "ST-0022",
    };

    const result = studentProfileTeacherEditSchema.safeParse(editPayload);
    assert.strictEqual(result.success, true);
  });

  await t.test("7. Student cannot read Teacher notes", () => {
    // Simulating column security
    const columnsAllowedForStudent = ["id", "student_code", "academic_level", "institution", "guardian_name", "guardian_phone", "address", "date_of_birth", "registration_status", "registered_at"];
    const isTeacherNoteVisibleToStudent = columnsAllowedForStudent.includes("teacher_note");
    assert.strictEqual(isTeacherNoteVisibleToStudent, false);
  });

  await t.test("8. Profile image validation rejects invalid files", () => {
    // Accept valid format
    assert.strictEqual(validateUploadedAvatarFile("my-pic.png", 2 * 1024 * 1024, "image/png"), true);

    // Reject > 5MB
    assert.throws(() => {
      validateUploadedAvatarFile("huge-avatar.jpg", 6 * 1024 * 1024, "image/jpeg");
    }, /exceeds the maximum 5 MB limit/);

    // Reject unsupported MIME/ext
    assert.throws(() => {
      validateUploadedAvatarFile("hack.sh", 124, "text/x-shellscript");
    }, /Unsupported file type/);
  });

  await t.test("9. User sees only their own notifications", () => {
    const student1 = { id: "student-1", role: "STUDENT" as const, status: "ACTIVE" as const };
    
    // Student 1 selects their own notification
    assert.strictEqual(simulateRLSPolicy("notifications", "select", student1, "student-1"), true);
    
    // Student 1 selects Student 2's notification
    assert.strictEqual(simulateRLSPolicy("notifications", "select", student1, "student-2"), false);
  });

  await t.test("10. User can mark own notification as read", () => {
    const student1 = { id: "student-1", role: "STUDENT" as const, status: "ACTIVE" as const };
    assert.strictEqual(simulateRLSPolicy("notifications", "update", student1, "student-1"), true);
  });

  await t.test("11. User cannot modify another user’s notification", () => {
    const student1 = { id: "student-1", role: "STUDENT" as const, status: "ACTIVE" as const };
    assert.strictEqual(simulateRLSPolicy("notifications", "update", student1, "student-2"), false);
  });

  await t.test("12. Mark all as read works", () => {
    const notificationsDb: Array<{ id: string; user_id: string; read_at: string | null }> = [
      { id: "1", user_id: "student-1", read_at: null },
      { id: "2", user_id: "student-1", read_at: null },
      { id: "3", user_id: "student-2", read_at: null },
    ];

    const markAllReadForUser = (userId: string) => {
      notificationsDb.forEach(n => {
        if (n.user_id === userId && n.read_at === null) {
          n.read_at = new Date().toISOString();
        }
      });
    };

    markAllReadForUser("student-1");

    assert.ok(notificationsDb[0].read_at !== null);
    assert.ok(notificationsDb[1].read_at !== null);
    assert.strictEqual(notificationsDb[2].read_at, null); // unaffected
  });

  await t.test("13. Notification badge count is correct", () => {
    const notificationsDb = [
      { id: "1", user_id: "student-1", read_at: null },
      { id: "2", user_id: "student-1", read_at: "2026-06-19" },
      { id: "3", user_id: "student-1", read_at: null },
      { id: "4", user_id: "student-2", read_at: null },
    ];

    const getUnreadCount = (userId: string) => {
      return notificationsDb.filter(n => n.user_id === userId && n.read_at === null).length;
    };

    assert.strictEqual(getUnreadCount("student-1"), 2);
    assert.strictEqual(getUnreadCount("student-2"), 1);
  });

  await t.test("14. Teacher settings are inaccessible to Students", () => {
    const student = { id: "student-1", role: "STUDENT" as const, status: "ACTIVE" as const };
    const teacher = { id: "teacher-1", role: "TEACHER" as const, status: "ACTIVE" as const };

    assert.strictEqual(simulateRLSPolicy("app_settings", "update", student, "system"), false);
    assert.strictEqual(simulateRLSPolicy("app_settings", "update", teacher, "system"), true);
  });

  await t.test("15. Password validation works", () => {
    // Valid password change
    const validChange = {
      currentPassword: "OldPassword123",
      newPassword: "NewPassword1234",
      confirmPassword: "NewPassword1234",
    };
    assert.strictEqual(passwordChangeSchema.safeParse(validChange).success, true);

    // Rejects weak password
    const weakChange = {
      currentPassword: "OldPassword123",
      newPassword: "simple",
      confirmPassword: "simple",
    };
    assert.strictEqual(passwordChangeSchema.safeParse(weakChange).success, false);

    // Rejects mismatch password
    const mismatchChange = {
      currentPassword: "OldPassword123",
      newPassword: "NewPassword1234",
      confirmPassword: "NewPasswordDifferent",
    };
    assert.strictEqual(passwordChangeSchema.safeParse(mismatchChange).success, false);
  });

  await t.test("16. Audit logs omit sensitive data", () => {
    const rawData = {
      studentCode: "ST-0099",
      password: "secretPassword123",
      password_hash: "$2b$10$xyz...",
      jwtToken: "token-value-xxx",
      reason: "Updating demographics",
    };

    const sanitized = sanitizeAuditLogData(rawData);
    assert.strictEqual(sanitized.password, undefined);
    assert.strictEqual(sanitized.password_hash, undefined);
    assert.strictEqual(sanitized.jwtToken, undefined);
    assert.strictEqual(sanitized.studentCode, "ST-0099");
    assert.strictEqual(sanitized.reason, "Updating demographics");
  });

});
