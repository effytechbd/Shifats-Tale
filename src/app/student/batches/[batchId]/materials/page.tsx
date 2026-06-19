import React from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { FileText, Download, Eye, ExternalLink, ArrowLeft, Calendar, Info } from "lucide-react";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
}

export default async function StudentBatchMaterialsPage({ params }: PageProps) {
  const { batchId } = await params;

  // 1. Authoritative Auth Check
  const { destination, profile, studentProfile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination === "PENDING_APPROVAL") {
    redirect("/pending-approval");
  }
  if (destination === "ACCOUNT_DISABLED") {
    redirect("/account-disabled");
  }
  if (destination === "INVALID_PROFILE") {
    redirect("/login?error=invalid_profile");
  }

  const supabase = await createClient();

  // 2. Fetch Batch details
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError || !batch) {
    notFound();
  }

  // 3. Authorization Check: Must have an ACTIVE enrollment in this batch
  if (!studentProfile) {
    redirect("/login?error=invalid_profile");
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", studentProfile.id)
    .eq("batch_id", batchId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (enrollError || !enrollment) {
    redirect("/student?error=unauthorized_batch");
  }

  // 4. Fetch published, released and unexpired materials for this batch
  const nowStr = new Date().toISOString();
  
  // Use admin client or client. RLS allows select for active enrollment + published + released + unexpired.
  const { data: materials, error: materialsError } = await supabase
    .from("batch_contents")
    .select("*")
    .eq("batch_id", batchId)
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false });

  if (materialsError) {
    console.error("Error loading batch materials:", materialsError);
  }

  // Extra application-level filtering to guarantee safety in case RLS is bypassed or misconfigured
  const activeMaterials = (materials || []).filter((m) => {
    const isReleased = !m.release_at || new Date(m.release_at) <= new Date();
    const isNotExpired = !m.expires_at || new Date(m.expires_at) > new Date();
    return isReleased && isNotExpired;
  });

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 text-xs font-bold text-slate-800">
      {/* Back button and page header */}
      <div className="space-y-4">
        <Link
          href={`/student/batches/${batchId}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Batch Details
        </Link>
        <DashboardPageHeader
          title={`${batch.name} - Study Materials`}
          description="Access handouts, lectures, PDF slides, homework sheets, and class notes."
        />
      </div>

      {activeMaterials.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-border/40 shadow-sm text-center max-w-lg mx-auto">
          <FileText className="h-12 w-12 text-slate-300 mx-auto stroke-1 mb-4" />
          <h3 className="text-sm font-extrabold text-slate-700">No materials available yet</h3>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
            When the teacher uploads PDF handouts, notes, or links for this batch, they will be listed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMaterials.map((material) => {
            const isFile = ["PDF", "DOC", "DOCX", "IMAGE"].includes(material.content_type);
            const isPreviewable = ["PDF", "IMAGE"].includes(material.content_type);
            const isExternal = ["LINK", "YOUTUBE"].includes(material.content_type);
            const isText = ["NOTE", "ANNOUNCEMENT"].includes(material.content_type);

            return (
              <div
                key={material.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                {/* Upper info body */}
                <div className="p-5 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {material.content_type}
                    </span>
                    {material.file_size && (
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {formatBytes(material.file_size)}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                      {material.title}
                    </h3>
                    {material.description && (
                      <p className="text-[11px] text-slate-500 font-semibold mt-1.5 leading-relaxed line-clamp-2">
                        {material.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Published: {new Date(material.published_at || material.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Lower action footer */}
                <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/50 flex gap-2 justify-end">
                  {isPreviewable && (
                    <Link
                      href={`/student/batches/${batchId}/materials/${material.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200/80 hover:bg-slate-200 text-slate-800 rounded-xl transition-all font-bold text-[10px]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Link>
                  )}

                  {isFile && material.allow_download && (
                    <a
                      href={`/api/materials/${material.id}/access?mode=download`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-xl transition-all font-bold text-[10px]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  )}

                  {isExternal && material.external_url && (
                    <a
                      href={material.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-primary hover:bg-accent/80 rounded-xl transition-all font-bold text-[10px]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Resource
                    </a>
                  )}

                  {isText && (
                    <div className="w-full bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-[10px] font-semibold text-slate-600 flex items-start gap-1.5">
                      <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-slate-700 block mb-0.5">Read Note</span>
                        <p className="leading-relaxed whitespace-pre-wrap">{material.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
