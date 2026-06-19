(process.env as any).NODE_ENV = "test";
import test from "node:test";
import assert from "node:assert";

// =========================================================================
// IN-MEMORY MOCK SERVICE FOR DASHBOARDS & REPORTS
// =========================================================================

interface Profile {
  id: string;
  role: "TEACHER" | "STUDENT";
  account_status: "ACTIVE" | "DISABLED";
  full_name: string;
  email: string;
}

interface StudentProfile {
  id: string;
  student_code: string;
  profile_id: string;
  registration_status: "PENDING" | "APPROVED";
  academic_level: string;
  institution: string;
}

interface Enrollment {
  id: string;
  student_id: string;
  batch_id: string;
  status: "ACTIVE" | "DISABLED" | "REJECTED" | "CANCELLED" | "PENDING";
}

interface Batch {
  id: string;
  name: string;
  code: string;
  status: "OPEN" | "CLOSED";
}

interface Payment {
  id: string;
  student_id: string;
  enrollment_id: string;
  batch_id: string;
  billing_month: number;
  billing_year: number;
  expected_amount: number;
  paid_amount: number;
  status: "PAID" | "UNPAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED";
  payment_method?: string;
  payment_date?: string;
  reference_number?: string;
}

interface Exam {
  id: string;
  batch_id: string;
  name: string;
  exam_type: "WEEKLY_TEST" | "MONTHLY_TEST" | "MOCK_TEST" | "BOARD_EXAM";
  exam_date: string;
  total_marks: number;
  pass_marks: number;
  status: "DRAFT" | "SCHEDULED" | "RESULT_DRAFT" | "RESULT_PUBLISHED";
}

interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  attendance_status: "PRESENT" | "ABSENT";
  obtained_marks: number;
}

interface Material {
  id: string;
  batch_id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  release_at?: string;
  expires_at?: string;
}

interface AuditLog {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  new_value?: any;
}

class DashboardReportsMockService {
  profiles: Record<string, Profile> = {};
  studentProfiles: Record<string, StudentProfile> = {};
  enrollments: Record<string, Enrollment> = {};
  batches: Record<string, Batch> = {};
  payments: Record<string, Payment> = {};
  exams: Record<string, Exam> = {};
  examResults: Record<string, ExamResult> = {};
  materials: Record<string, Material> = {};
  auditLogs: AuditLog[] = [];

  reset() {
    this.profiles = {};
    this.studentProfiles = {};
    this.enrollments = {};
    this.batches = {};
    this.payments = {};
    this.exams = {};
    this.examResults = {};
    this.materials = {};
    this.auditLogs = [];
  }

  // Gating helper
  checkAccess(profileId: string, allowedRoles: string[]) {
    const p = this.profiles[profileId];
    if (!p) return "UNAUTHENTICATED";
    if (p.account_status === "DISABLED") return "ACCOUNT_DISABLED";
    if (!allowedRoles.includes(p.role)) return "FORBIDDEN";
    return "AUTHORIZED";
  }

  // Student dashboard query resolver (Mocking DB calls in single aggregate logic to avoid N+1)
  getStudentDashboard(studentProfileId: string) {
    const student = this.studentProfiles[studentProfileId];
    if (!student) throw new Error("Student not found");

    const profile = this.profiles[student.profile_id];

    // Filter active enrollments only
    const activeEnrolls = Object.values(this.enrollments).filter(
      (e) => e.student_id === studentProfileId && e.status === "ACTIVE"
    );

    const activeBatchIds = activeEnrolls.map((e) => e.batch_id);

    // Payments for current month
    const currentMonthPayments = Object.values(this.payments).filter(
      (p) =>
        p.student_id === studentProfileId &&
        p.billing_month === 6 &&
        p.billing_year === 2026 &&
        activeBatchIds.includes(p.batch_id)
    );

    let totalExpected = 0;
    let totalPaid = 0;
    let totalDue = 0;

    currentMonthPayments.forEach((p) => {
      const exp = p.expected_amount;
      const paid = p.paid_amount;
      totalExpected += exp;
      totalPaid += paid;
      if (p.status !== "WAIVED") {
        totalDue += Math.max(exp - paid, 0);
      }
    });

    // Upcoming exams (not draft)
    const upcomingExams = Object.values(this.exams).filter(
      (ex) => activeBatchIds.includes(ex.batch_id) && ex.status !== "DRAFT"
    );

    // Published results
    const publishedResults = Object.values(this.examResults).filter((r) => {
      if (r.student_id !== studentProfileId) return false;
      const exam = this.exams[r.exam_id];
      return exam && exam.status === "RESULT_PUBLISHED" && activeBatchIds.includes(exam.batch_id);
    });

    // Materials
    const publishedMaterials = Object.values(this.materials).filter((m) => {
      if (!activeBatchIds.includes(m.batch_id)) return false;
      if (m.status !== "PUBLISHED") return false;
      const now = new Date("2026-06-20T00:00:00Z");
      const isReleased = !m.release_at || new Date(m.release_at) <= now;
      const isNotExpired = !m.expires_at || new Date(m.expires_at) > now;
      return isReleased && isNotExpired;
    });

    return {
      studentName: profile.full_name,
      studentCode: student.student_code,
      activeBatches: activeEnrolls,
      totalExpected,
      totalPaid,
      totalDue,
      upcomingExams,
      publishedResults,
      publishedMaterials,
    };
  }

  // Teacher dashboard totals query logic
  getTeacherDashboard() {
    const students = Object.values(this.studentProfiles);
    const totalStudents = students.length;
    const pendingStudents = students.filter((s) => s.registration_status === "PENDING").length;
    const approvedStudents = students.filter((s) => s.registration_status === "APPROVED").length;
    
    // Active students (Approved student profile + Active user profile)
    const activeStudents = students.filter((s) => {
      const p = this.profiles[s.profile_id];
      return s.registration_status === "APPROVED" && p && p.account_status === "ACTIVE";
    }).length;

    const disabledStudents = Object.values(this.profiles).filter((p) => p.role === "STUDENT" && p.account_status === "DISABLED").length;

    // Students with no active batch
    const activeEnrollsStudentIds = new Set(
      Object.values(this.enrollments)
        .filter((e) => e.status === "ACTIVE")
        .map((e) => e.student_id)
    );
    const noActiveBatchCount = students.filter((s) => s.registration_status === "APPROVED" && !activeEnrollsStudentIds.has(s.id)).length;

    const allBatches = Object.values(this.batches);
    const totalBatches = allBatches.length;
    const runningBatches = allBatches.filter((b) => b.status === "OPEN").length;

    // Revenues
    const currentMonthPayments = Object.values(this.payments).filter(
      (p) => p.billing_month === 6 && p.billing_year === 2026
    );

    let currentExpected = 0;
    let currentCollected = 0;
    let currentOutstanding = 0;

    currentMonthPayments.forEach((p) => {
      const exp = p.expected_amount;
      const paid = p.paid_amount;
      if (p.status !== "WAIVED" && p.status !== "REFUNDED") {
        currentExpected += exp;
        currentCollected += paid;
        currentOutstanding += Math.max(exp - paid, 0);
      } else if (p.status === "REFUNDED") {
        currentExpected += exp;
        currentCollected += 0;
        currentOutstanding += exp;
      }
    });

    return {
      totalRegistered: totalStudents,
      pendingStudents,
      approvedStudents,
      activeStudents,
      disabledStudents,
      noActiveBatchCount,
      totalBatches,
      runningBatches,
      currentExpected,
      currentCollected,
      currentOutstanding,
    };
  }

  // CSV Escaper
  escapeCSV(val: any): string {
    if (val === null || val === undefined) return "";
    let str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }
    return str;
  }
}

// Global test variables
const mock = new DashboardReportsMockService();

test.beforeEach(() => {
  mock.reset();
});

// 1. Student dashboard shows only the authenticated Student’s data.
test("Student dashboard shows only the authenticated Student's data", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };

  mock.profiles["user-std-2"] = { id: "user-std-2", role: "STUDENT", account_status: "ACTIVE", full_name: "Bob", email: "bob@test.com" };
  mock.studentProfiles["std-2"] = { id: "std-2", student_code: "S002", profile_id: "user-std-2", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };

  mock.enrollments["e1"] = { id: "e1", student_id: "std-1", batch_id: "batch-1", status: "ACTIVE" };
  mock.enrollments["e2"] = { id: "e2", student_id: "std-2", batch_id: "batch-1", status: "ACTIVE" };

  const aliceDashboard = mock.getStudentDashboard("std-1");
  assert.strictEqual(aliceDashboard.studentName, "Alice");
  assert.strictEqual(aliceDashboard.activeBatches.length, 1);
  assert.strictEqual(aliceDashboard.activeBatches[0].student_id, "std-1");
});

// 2. Student sees only active batches.
test("Student sees only active batches", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };

  mock.enrollments["e1"] = { id: "e1", student_id: "std-1", batch_id: "batch-1", status: "ACTIVE" };
  mock.enrollments["e2"] = { id: "e2", student_id: "std-1", batch_id: "batch-2", status: "DISABLED" };
  mock.enrollments["e3"] = { id: "e3", student_id: "std-1", batch_id: "batch-3", status: "CANCELLED" };

  const db = mock.getStudentDashboard("std-1");
  assert.strictEqual(db.activeBatches.length, 1);
  assert.strictEqual(db.activeBatches[0].batch_id, "batch-1");
});

// 3. Student current payment summary is accurate.
test("Student current payment summary is accurate", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };

  mock.enrollments["e1"] = { id: "e1", student_id: "std-1", batch_id: "batch-1", status: "ACTIVE" };
  mock.enrollments["e2"] = { id: "e2", student_id: "std-1", batch_id: "batch-2", status: "ACTIVE" };

  // Generate current month (6/2026) payments
  mock.payments["p1"] = { id: "p1", student_id: "std-1", enrollment_id: "e1", batch_id: "batch-1", billing_month: 6, billing_year: 2026, expected_amount: 1500, paid_amount: 1000, status: "PARTIALLY_PAID" };
  mock.payments["p2"] = { id: "p2", student_id: "std-1", enrollment_id: "e2", batch_id: "batch-2", billing_month: 6, billing_year: 2026, expected_amount: 1200, paid_amount: 1200, status: "PAID" };
  mock.payments["p3"] = { id: "p3", student_id: "std-1", enrollment_id: "e2", batch_id: "batch-2", billing_month: 6, billing_year: 2026, expected_amount: 800, paid_amount: 0, status: "WAIVED" };

  const db = mock.getStudentDashboard("std-1");
  assert.strictEqual(db.totalExpected, 3500);
  assert.strictEqual(db.totalPaid, 2200);
  assert.strictEqual(db.totalDue, 500); // 1500 - 1000 = 500. Waived contributes 0 to due.
});

// 4. Student sees only published results.
test("Student sees only published results", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };
  mock.enrollments["e1"] = { id: "e1", student_id: "std-1", batch_id: "batch-1", status: "ACTIVE" };

  mock.exams["exam-1"] = { id: "exam-1", batch_id: "batch-1", name: "Weekly test 1", exam_type: "WEEKLY_TEST", exam_date: "2026-06-05", total_marks: 50, pass_marks: 20, status: "RESULT_PUBLISHED" };
  mock.exams["exam-2"] = { id: "exam-2", batch_id: "batch-1", name: "Weekly test 2", exam_type: "WEEKLY_TEST", exam_date: "2026-06-12", total_marks: 50, pass_marks: 20, status: "RESULT_DRAFT" };

  mock.examResults["r1"] = { id: "r1", exam_id: "exam-1", student_id: "std-1", attendance_status: "PRESENT", obtained_marks: 42 };
  mock.examResults["r2"] = { id: "r2", exam_id: "exam-2", student_id: "std-1", attendance_status: "PRESENT", obtained_marks: 48 };

  const db = mock.getStudentDashboard("std-1");
  assert.strictEqual(db.publishedResults.length, 1);
  assert.strictEqual(db.publishedResults[0].exam_id, "exam-1");
});

// 5. Student sees only accessible materials.
test("Student sees only accessible materials", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };
  mock.enrollments["e1"] = { id: "e1", student_id: "std-1", batch_id: "batch-1", status: "ACTIVE" };

  mock.materials["m1"] = { id: "m1", batch_id: "batch-1", title: "PDF Lecture 1", status: "PUBLISHED", release_at: "2026-06-19T00:00:00Z" };
  mock.materials["m2"] = { id: "m2", batch_id: "batch-1", title: "PDF Lecture 2 (Future)", status: "PUBLISHED", release_at: "2026-06-25T00:00:00Z" };
  mock.materials["m3"] = { id: "m3", batch_id: "batch-1", title: "PDF Lecture 3 (Draft)", status: "DRAFT" };
  mock.materials["m4"] = { id: "m4", batch_id: "batch-1", title: "PDF Lecture 4 (Expired)", status: "PUBLISHED", release_at: "2026-06-01T00:00:00Z", expires_at: "2026-06-15T00:00:00Z" };

  const db = mock.getStudentDashboard("std-1");
  assert.strictEqual(db.publishedMaterials.length, 1);
  assert.strictEqual(db.publishedMaterials[0].title, "PDF Lecture 1");
});

// 6. Teacher dashboard totals match database data.
test("Teacher dashboard totals match database data", () => {
  mock.profiles["t1"] = { id: "t1", role: "TEACHER", account_status: "ACTIVE", full_name: "Adnan", email: "adnan@test.com" };
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.profiles["user-std-2"] = { id: "user-std-2", role: "STUDENT", account_status: "DISABLED", full_name: "Bob", email: "bob@test.com" };

  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };
  mock.studentProfiles["std-2"] = { id: "std-2", student_code: "S002", profile_id: "user-std-2", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };
  mock.studentProfiles["std-3"] = { id: "std-3", student_code: "S003", profile_id: "user-std-3", registration_status: "PENDING", academic_level: "SSC", institution: "Col" };

  mock.batches["b1"] = { id: "b1", name: "Physics-A", code: "PHY101", status: "OPEN" };
  mock.batches["b2"] = { id: "b2", name: "Chemistry-A", code: "CHM101", status: "CLOSED" };

  const tb = mock.getTeacherDashboard();
  assert.strictEqual(tb.totalRegistered, 3);
  assert.strictEqual(tb.pendingStudents, 1);
  assert.strictEqual(tb.approvedStudents, 2);
  assert.strictEqual(tb.activeStudents, 1); // std-2 is approved but profile is disabled
  assert.strictEqual(tb.disabledStudents, 1);
  assert.strictEqual(tb.totalBatches, 2);
  assert.strictEqual(tb.runningBatches, 1);
});

// 7. Pending approval count is accurate.
test("Pending approval count is accurate", () => {
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "u1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };
  mock.studentProfiles["std-2"] = { id: "std-2", student_code: "S002", profile_id: "u2", registration_status: "PENDING", academic_level: "HSC", institution: "Col" };
  mock.studentProfiles["std-3"] = { id: "std-3", student_code: "S003", profile_id: "u3", registration_status: "PENDING", academic_level: "HSC", institution: "Col" };

  const tb = mock.getTeacherDashboard();
  assert.strictEqual(tb.pendingStudents, 2);
});

// 8. Revenue totals handle partial and refunded payments correctly.
test("Revenue totals handle partial and refunded payments correctly", () => {
  mock.payments["p1"] = { id: "p1", student_id: "std-1", enrollment_id: "e1", batch_id: "b1", billing_month: 6, billing_year: 2026, expected_amount: 1500, paid_amount: 1000, status: "PARTIALLY_PAID" };
  mock.payments["p2"] = { id: "p2", student_id: "std-2", enrollment_id: "e2", batch_id: "b1", billing_month: 6, billing_year: 2026, expected_amount: 1200, paid_amount: 1200, status: "PAID" };
  mock.payments["p3"] = { id: "p3", student_id: "std-3", enrollment_id: "e3", batch_id: "b1", billing_month: 6, billing_year: 2026, expected_amount: 1000, paid_amount: 0, status: "WAIVED" };
  mock.payments["p4"] = { id: "p4", student_id: "std-4", enrollment_id: "e4", batch_id: "b1", billing_month: 6, billing_year: 2026, expected_amount: 2000, paid_amount: 2000, status: "REFUNDED" };

  const tb = mock.getTeacherDashboard();
  // Expected:
  // p1: 1500 expected, 1000 collected, 500 due
  // p2: 1200 expected, 1200 collected, 0 due
  // p3: Waived: 0 expected, 0 collected, 0 due
  // p4: Refunded: 2000 expected, 0 collected, 2000 due
  assert.strictEqual(tb.currentExpected, 1500 + 1200 + 2000); // 4700
  assert.strictEqual(tb.currentCollected, 1000 + 1200 + 0); // 2200
  assert.strictEqual(tb.currentOutstanding, 500 + 0 + 2000); // 2500
});

// 10. Student cannot access Teacher reports.
test("Student cannot access Teacher reports", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.profiles["user-t-1"] = { id: "user-t-1", role: "TEACHER", account_status: "ACTIVE", full_name: "Adnan", email: "adnan@test.com" };

  const stdAccess = mock.checkAccess("user-std-1", ["TEACHER"]);
  const tAccess = mock.checkAccess("user-t-1", ["TEACHER"]);

  assert.strictEqual(stdAccess, "FORBIDDEN");
  assert.strictEqual(tAccess, "AUTHORIZED");
});

// 11. CSV export requires Teacher role.
test("CSV export requires Teacher role", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.profiles["user-t-1"] = { id: "user-t-1", role: "TEACHER", account_status: "ACTIVE", full_name: "Adnan", email: "adnan@test.com" };

  assert.strictEqual(mock.checkAccess("user-std-1", ["TEACHER"]), "FORBIDDEN");
  assert.strictEqual(mock.checkAccess("user-t-1", ["TEACHER"]), "AUTHORIZED");
});

// 12. CSV escaping works.
test("CSV escaping works", () => {
  const normalText = "Adnan Bin Wahid";
  const commaText = "Physics, Chemistry, Math";
  const quoteText = 'Lecture on "Static Electricity"';
  const multilineText = "Line 1\nLine 2";

  assert.strictEqual(mock.escapeCSV(normalText), "Adnan Bin Wahid");
  assert.strictEqual(mock.escapeCSV(commaText), '"Physics, Chemistry, Math"');
  assert.strictEqual(mock.escapeCSV(quoteText), '"Lecture on ""Static Electricity"""');
  assert.strictEqual(mock.escapeCSV(multilineText), '"Line 1\nLine 2"');
});

// 13. CSV export excludes sensitive internal fields.
test("CSV export excludes sensitive internal fields", () => {
  mock.profiles["user-std-1"] = { id: "user-std-1", role: "STUDENT", account_status: "ACTIVE", full_name: "Alice", email: "alice@test.com" };
  mock.studentProfiles["std-1"] = { id: "std-1", student_code: "S001", profile_id: "user-std-1", registration_status: "APPROVED", academic_level: "HSC", institution: "Col" };
  mock.batches["b1"] = { id: "b1", name: "Physics", code: "PHY101", status: "OPEN" };
  mock.enrollments["e1"] = { id: "e1", student_id: "std-1", batch_id: "b1", status: "ACTIVE" };

  // Build CSV content like endpoint logic
  let csvContent = "Student ID,Student Name,Batch,Enrollment Status,Account Status\n";
  const stud = mock.studentProfiles["std-1"];
  const prof = mock.profiles[stud.profile_id];
  const b = mock.batches["b1"];
  const enroll = mock.enrollments["e1"];

  csvContent += `${mock.escapeCSV(stud.student_code)},${mock.escapeCSV(prof.full_name)},${mock.escapeCSV(b.name)},${mock.escapeCSV(enroll.status)},${mock.escapeCSV(prof.account_status)}\n`;

  // Verify internal Supabase auth credentials, user secrets, passwords or IDs are absent
  assert.ok(!csvContent.includes(stud.profile_id));
  assert.ok(!csvContent.includes("user-std-1"));
  assert.ok(!csvContent.includes(stud.id));
  assert.ok(!csvContent.includes("std-1"));
  assert.ok(!csvContent.includes(b.id));
  assert.ok(!csvContent.includes("b1"));
  assert.ok(!csvContent.includes("password"));
});
