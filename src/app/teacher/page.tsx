import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency } from "@/lib/currency";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  GraduationCap, 
  FileText, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Search, 
  CheckSquare, 
  FileDown, 
  ChevronRight,
  UserX,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export default async function TeacherDashboardPage() {
  const { profile, destination } = await resolveAuthenticatedDestination();

  if (destination !== "TEACHER_DASHBOARD" || !profile || profile.role !== "TEACHER") {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch coaching center settings for currency and defaults
  const { data: settings } = await supabase
    .from("app_settings")
    .select("*")
    .eq("id", true)
    .single();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYearVal = currentDate.getFullYear();
  const todayStr = currentDate.toISOString().split("T")[0];

  // 1. Fetch Students count statistics
  const { data: allStudents } = await supabase
    .from("student_profiles")
    .select("id, registration_status, profile:profiles(account_status)");

  const studentCount = allStudents?.length || 0;
  const pendingCount = allStudents?.filter((s) => s.registration_status === "PENDING").length || 0;
  const approvedCount = allStudents?.filter((s) => s.registration_status === "APPROVED").length || 0;
  const activeCount = allStudents?.filter((s) => s.registration_status === "APPROVED" && (s.profile as any)?.account_status === "ACTIVE").length || 0;
  const disabledCount = allStudents?.filter((s) => (s.profile as any)?.account_status === "DISABLED").length || 0;

  // Query active enrollments to count students with no active batches
  const { data: activeEnrollments } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("status", "ACTIVE");

  const enrolledStudentIds = new Set(activeEnrollments?.map((e) => e.student_id) || []);
  const noActiveBatchCount = allStudents?.filter((s) => s.registration_status === "APPROVED" && !enrolledStudentIds.has(s.id)).length || 0;

  // 2. Fetch Batches count statistics
  const { data: allBatches } = await supabase
    .from("batches")
    .select("id, status");

  const totalBatches = allBatches?.length || 0;
  const runningBatches = allBatches?.filter((b) => b.status === "OPEN").length || 0; // open admission running batches
  const openAdmissionBatches = allBatches?.filter((b) => b.status === "OPEN").length || 0;

  // 3. Fetch Current Month Revenues
  const { data: payments } = await supabase
    .from("payments")
    .select("expected_amount, paid_amount, status")
    .eq("billing_month", currentMonth)
    .eq("billing_year", currentYearVal);

  let expectedRevenue = 0;
  let collectedRevenue = 0;
  let outstandingDues = 0;

  payments?.forEach((p) => {
    const exp = Number(p.expected_amount) || 0;
    const paid = Number(p.paid_amount) || 0;
    expectedRevenue += exp;
    collectedRevenue += paid;
    if (p.status !== "WAIVED" && p.status !== "REFUNDED") {
      outstandingDues += Math.max(exp - paid, 0);
    }
  });

  // 4. Fetch Exam Counts & Results
  const { data: allExams } = await supabase
    .from("exams")
    .select("id, status, exam_date");

  const upcomingExamsCount = allExams?.filter((e) => e.status === "SCHEDULED" && e.exam_date >= todayStr).length || 0;
  const draftResultsCount = allExams?.filter((e) => e.status === "RESULT_DRAFT").length || 0;
  const publishedResultsCount = allExams?.filter((e) => e.status === "RESULT_PUBLISHED").length || 0;

  // 5. Fetch Study Materials count
  const { count: materialsCount } = await supabase
    .from("batch_contents")
    .select("id", { count: "exact", head: true })
    .eq("status", "PUBLISHED");

  // =========================================================================
  // PRIORITY ACTIONS QUERIES
  // =========================================================================

  // A. Pending student approvals (limit 5)
  const { data: pendingApprovalsList } = await supabase
    .from("student_profiles")
    .select("id, student_code, academic_level, institution, registered_at, profile:profiles(full_name, email)")
    .eq("registration_status", "PENDING")
    .limit(5);

  // B. Students with incomplete enrollment (Approved but 0 active batches, limit 5)
  const incompleteEnrollmentsList = allStudents
    ?.filter((s) => s.registration_status === "APPROVED" && !enrolledStudentIds.has(s.id))
    .slice(0, 5)
    .map((s) => {
      // Find full student details
      const detail = allStudents.find((d) => d.id === s.id) as any;
      return {
        id: s.id,
        fullName: detail?.profile?.full_name || "Unknown Student",
        studentCode: detail?.student_code,
      };
    }) || [];

  // C. Unpaid/Partially Paid Current Month Invoices (limit 5)
  const { data: unpaidInvoicesList } = await supabase
    .from("payments")
    .select(`
      id,
      expected_amount,
      paid_amount,
      status,
      batch:batches(name),
      student:student_profiles(
        id,
        student_code,
        profile:profiles(full_name)
      )
    `)
    .eq("billing_month", currentMonth)
    .eq("billing_year", currentYearVal)
    .in("status", ["UNPAID", "PARTIALLY_PAID"])
    .limit(5);

  // D. Results waiting for publication (RESULT_DRAFT exams, limit 5)
  const { data: resultDraftsList } = await supabase
    .from("exams")
    .select("id, name, exam_date, total_marks, batch:batches(name)")
    .eq("status", "RESULT_DRAFT")
    .limit(5);

  // E. Recently disabled enrollments (limit 5)
  const { data: disabledEnrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      disabled_at,
      disable_reason,
      batch:batches(name),
      student:student_profiles(
        id,
        student_code,
        profile:profiles(full_name)
      )
    `)
    .eq("status", "DISABLED")
    .order("disabled_at", { ascending: false })
    .limit(5);

  // =========================================================================
  // RECENT AUDIT LOGS QUERIES
  // =========================================================================
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const actorIds = Array.from(new Set(auditLogs?.map((l) => l.actor_user_id).filter(Boolean) || [])) as string[];
  const actorMap: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: actors } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", actorIds);
    actors?.forEach((a) => {
      actorMap[a.id] = a.full_name;
    });
  }

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Page Header */}
      <DashboardPageHeader
        title={`Overview Dashboard`}
        description="Portal administration console to review enrollments, track payments, publish scores, and inspect system audit trails."
      />

      {/* 1. Metric Counts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Students */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-[10px] text-muted uppercase tracking-wider block">Student Register</span>
          <div className="flex justify-between items-baseline">
            <span className="text-[28px] font-extrabold text-slate-800 leading-none">{activeCount}</span>
            <span className="text-[10px] text-slate-500 font-semibold">Active &bull; {studentCount} total</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[9px] font-bold text-slate-500 pt-1.5 border-t">
            <span>Pending: {pendingCount}</span>
            <span>Disabled: {disabledCount}</span>
          </div>
        </div>

        {/* Total Batches */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm space-y-2">
          <span className="text-[10px] text-muted uppercase tracking-wider block">Class Batches</span>
          <div className="flex justify-between items-baseline">
            <span className="text-[28px] font-extrabold text-slate-800 leading-none">{totalBatches}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{runningBatches} Running</span>
          </div>
          <div className="pt-1.5 border-t text-[9px] text-slate-500 font-bold">
            No Active Batches: {noActiveBatchCount} Students
          </div>
        </div>

        {/* Expected/Collected Revenue */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm space-y-2 col-span-1 md:col-span-2">
          <span className="text-[10px] text-muted uppercase tracking-wider block">Revenue - Month {currentMonth}</span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[9px] text-muted font-bold block mb-0.5">Expected</span>
              <span className="text-[18px] font-black text-slate-800 leading-none">{formatCurrency(expectedRevenue, settings?.default_currency)}</span>
            </div>
            <div>
              <span className="text-[9px] text-emerald-600 font-bold block mb-0.5">Collected</span>
              <span className="text-[18px] font-black text-emerald-700 leading-none">{formatCurrency(collectedRevenue, settings?.default_currency)}</span>
            </div>
            <div>
              <span className="text-[9px] text-rose-600 font-bold block mb-0.5">Outstanding Due</span>
              <span className="text-[18px] font-black text-rose-700 leading-none">{formatCurrency(outstandingDues, settings?.default_currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Exam statistics */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[20px] font-extrabold text-slate-800 leading-none block">{upcomingExamsCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mt-1">Upcoming Exams</span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        {/* Draft Results */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[20px] font-extrabold text-slate-800 leading-none block">{draftResultsCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mt-1">Draft Marks Sheets</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Published results */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[20px] font-extrabold text-slate-800 leading-none block">{publishedResultsCount}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mt-1">Published Marks Sheets</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        {/* Uploaded materials */}
        <div className="bg-white border border-border/40 p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[20px] font-extrabold text-slate-800 leading-none block">{materialsCount || 0}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted font-bold block mt-1">Shared Handouts</span>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. Priority Actions Section */}
      <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-5">
        <h3 className="text-sm font-extrabold font-display border-b border-border/20 pb-3 flex items-center gap-1.5 text-rose-700 bg-rose-50/20 p-2.5 rounded-xl border border-rose-100/50">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>Priority Action Required Ledger</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* A. Pending Approvals list */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted font-extrabold border-b pb-1 flex justify-between items-center">
              <span>Pending Registrations ({pendingCount})</span>
              <Link href="/teacher/students" className="text-[10px] text-primary hover:text-accent font-extrabold flex items-center">
                <span>View All</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </h4>
            {pendingApprovalsList && pendingApprovalsList.length > 0 ? (
              <div className="space-y-2">
                {pendingApprovalsList.map((stud) => (
                  <div key={stud.id} className="p-3 bg-slate-50/40 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800">{(stud.profile as any)?.full_name}</span>
                      <span className="text-[10px] text-muted block mt-0.5">
                        Class: {stud.academic_level} &bull; Code: {stud.student_code}
                      </span>
                    </div>
                    <Link href={`/teacher/students/${stud.id}`} className="px-2.5 py-1 bg-primary text-white text-[10px] font-black rounded-lg hover:bg-primary-dark transition-all">
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted font-normal py-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No pending registration approvals.</p>
            )}
          </div>

          {/* B. Students with incomplete enrollment (0 active batches) */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted font-extrabold border-b pb-1 flex justify-between items-center">
              <span>Incomplete Enrollments ({noActiveBatchCount})</span>
              <Link href="/teacher/students" className="text-[10px] text-primary hover:text-accent font-extrabold flex items-center">
                <span>Find Student</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </h4>
            {incompleteEnrollmentsList.length > 0 ? (
              <div className="space-y-2">
                {incompleteEnrollmentsList.map((stud) => (
                  <div key={stud.id} className="p-3 bg-slate-50/40 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800">{stud.fullName}</span>
                      <span className="text-[10px] text-muted block mt-0.5">Code: {stud.studentCode}</span>
                    </div>
                    <Link href={`/teacher/students/${stud.id}`} className="px-2.5 py-1 bg-primary text-white text-[10px] font-black rounded-lg hover:bg-primary-dark transition-all">
                      Add to Class
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted font-normal py-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> All approved students are enrolled.</p>
            )}
          </div>

          {/* C. Current Month Outstanding Invoices */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted font-extrabold border-b pb-1 flex justify-between items-center">
              <span>Unpaid Dues - Current Month</span>
              <Link href="/teacher/payments" className="text-[10px] text-primary hover:text-accent font-extrabold flex items-center">
                <span>Ledger</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </h4>
            {unpaidInvoicesList && unpaidInvoicesList.length > 0 ? (
              <div className="space-y-2">
                {unpaidInvoicesList.map((pay) => (
                  <div key={pay.id} className="p-3 bg-slate-50/40 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800">{(pay.student as any)?.profile?.full_name}</span>
                      <span className="text-[10px] text-muted block mt-0.5">
                        Batch: {(pay.batch as any)?.name} &bull; Expected: {formatCurrency(pay.expected_amount, settings?.default_currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={pay.status} />
                      <Link href={`/teacher/payments/${pay.id}`} className="px-2.5 py-1 bg-slate-100 text-[10px] border font-black rounded-lg hover:bg-slate-200 transition-all">
                        Record
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted font-normal py-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No unpaid current-month records found.</p>
            )}
          </div>

          {/* D. Marks Sheets Drafts waiting publication */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-muted font-extrabold border-b pb-1 flex justify-between items-center">
              <span>Waiting Result Publication ({draftResultsCount})</span>
              <Link href="/teacher/exams" className="text-[10px] text-primary hover:text-accent font-extrabold flex items-center">
                <span>View Exams</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </h4>
            {resultDraftsList && resultDraftsList.length > 0 ? (
              <div className="space-y-2">
                {resultDraftsList.map((exam) => (
                  <div key={exam.id} className="p-3 bg-slate-50/40 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800">{exam.name}</span>
                      <span className="text-[10px] text-muted block mt-0.5">
                        Batch: {(exam.batch as any)?.name} &bull; Date: {exam.exam_date}
                      </span>
                    </div>
                    <Link href={`/teacher/exams/${exam.id}`} className="px-2.5 py-1 bg-amber-600 text-white text-[10px] font-black rounded-lg hover:bg-amber-700 transition-all">
                      Publish
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted font-normal py-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No marks sheets waiting publication.</p>
            )}
          </div>

          {/* E. Recently disabled enrollments */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs uppercase tracking-wider text-muted font-extrabold border-b pb-1 flex justify-between items-center">
              <span>Disabled Enrollments (Locked Class Access)</span>
              <Link href="/teacher/enrollments" className="text-[10px] text-primary hover:text-accent font-extrabold flex items-center">
                <span>View Enrollments</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </h4>
            {disabledEnrollments && disabledEnrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {disabledEnrollments.map((enr) => (
                  <div key={enr.id} className="p-3 bg-rose-50/20 border border-rose-100 rounded-xl flex justify-between items-start text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800">{(enr.student as any)?.profile?.full_name}</span>
                      <span className="text-[9px] text-rose-700 font-extrabold block mt-0.5">Batch: {(enr.batch as any)?.name}</span>
                      {enr.disable_reason && (
                        <p className="text-[9px] text-muted font-normal leading-tight mt-1">Reason: {enr.disable_reason}</p>
                      )}
                    </div>
                    <Link href={`/teacher/students/${(enr.student as any)?.id}`} className="px-2 py-0.5 border text-[9px] font-bold rounded hover:bg-slate-50">Manage</Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted font-normal py-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No disabled batch enrollments.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Grid & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted border-b border-border/20 pb-2">
            Portal Administration Links
          </h3>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <Link href="/teacher/batches/new" className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-primary hover:text-white transition-colors flex flex-col items-center gap-1">
              <Plus className="h-4 w-4 text-muted group-hover:text-white" />
              <span>Add Batch</span>
            </Link>
            <Link href="/teacher/students" className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-primary hover:text-white transition-colors flex flex-col items-center gap-1">
              <Search className="h-4 w-4 text-muted group-hover:text-white" />
              <span>Find Student</span>
            </Link>
            <Link href="/teacher/payments/new" className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-primary hover:text-white transition-colors flex flex-col items-center gap-1">
              <CreditCard className="h-4 w-4 text-muted group-hover:text-white" />
              <span>Record Payment</span>
            </Link>
            <Link href="/teacher/materials/new" className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-primary hover:text-white transition-colors flex flex-col items-center gap-1">
              <FileText className="h-4 w-4 text-muted group-hover:text-white" />
              <span>Upload Material</span>
            </Link>
            <Link href="/teacher/exams/new" className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-primary hover:text-white transition-colors flex flex-col items-center gap-1">
              <GraduationCap className="h-4 w-4 text-muted group-hover:text-white" />
              <span>New Exam</span>
            </Link>
            <Link href="/teacher/reports" className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-primary hover:text-white transition-colors flex flex-col items-center gap-1">
              <FileDown className="h-4 w-4 text-muted group-hover:text-white" />
              <span>View Reports</span>
            </Link>
          </div>
        </div>

        {/* Audit Log Trail Ledger */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border/20 pb-3">
            <h3 className="text-sm font-extrabold font-display">
              Recent Portal Audit Logs
            </h3>
            <span className="text-[9px] uppercase tracking-wider text-muted font-black">
              Security Trail
            </span>
          </div>

          {auditLogs && auditLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-primary">
                <thead>
                  <tr className="border-b border-border/20 text-muted uppercase text-[9px] font-extrabold">
                    <th className="pb-2">Action</th>
                    <th className="pb-2">Actor</th>
                    <th className="pb-2 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 text-primary">
                  {auditLogs.map((log: any) => (
                    <tr key={log.id}>
                      <td className="py-2.5 font-display font-extrabold text-[11px] text-slate-800 uppercase tracking-wider">
                        {log.action.replace(/_/g, " ")}
                      </td>
                      <td className="py-2.5 text-slate-700">
                        {log.actor_user_id ? actorMap[log.actor_user_id] || "System Admin" : "System Trigger"}
                      </td>
                      <td className="py-2.5 text-right text-muted text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-muted font-semibold">
              No recent audit activity registered.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
