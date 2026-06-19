import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSignedAccessUrl } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contentId: string }> }
) {
  const { contentId } = await params;

  // Prevent caching of signed URLs
  const headers = new Headers();
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Pragma", "no-cache");

  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
    }

    // 2. Fetch profile from DB
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 403, headers });
    }

    // 3. Verify profile status
    if (profile.account_status !== "ACTIVE") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403, headers });
    }

    // 4. Load the material details
    const admin = createAdminClient();
    const { data: material, error: materialError } = await admin
      .from("batch_contents")
      .select("*")
      .eq("id", contentId)
      .single();

    if (materialError || !material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404, headers });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "preview"; // 'preview' or 'download'

    const isTeacher = profile.role === "TEACHER";

    // 5. If user is student, enforce all gating rules
    if (!isTeacher) {
      if (profile.role !== "STUDENT") {
        return NextResponse.json({ error: "Access denied" }, { status: 403, headers });
      }

      // Check material status
      if (material.status !== "PUBLISHED") {
        return NextResponse.json({ error: "Material is not available" }, { status: 403, headers });
      }

      // Check scheduling
      const now = new Date();
      if (material.release_at && new Date(material.release_at) > now) {
        return NextResponse.json({ error: "Material is not yet released" }, { status: 403, headers });
      }
      if (material.expires_at && new Date(material.expires_at) <= now) {
        return NextResponse.json({ error: "Material has expired" }, { status: 403, headers });
      }

      // Fetch student profile details
      const { data: studentProfile, error: studentError } = await admin
        .from("student_profiles")
        .select("id, registration_status")
        .eq("profile_id", profile.id)
        .single();

      if (studentError || !studentProfile) {
        return NextResponse.json({ error: "Student profile not found" }, { status: 403, headers });
      }

      // Verify active enrollment in the target batch
      const { data: enrollment, error: enrollError } = await admin
        .from("enrollments")
        .select("id, status")
        .eq("student_id", studentProfile.id)
        .eq("batch_id", material.batch_id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (enrollError || !enrollment) {
        return NextResponse.json({ error: "No active enrollment in this batch" }, { status: 403, headers });
      }

      // If download requested, verify download permission
      if (mode === "download" && !material.allow_download) {
        return NextResponse.json({ error: "Download is not allowed for this material" }, { status: 403, headers });
      }
    }

    // 6. Generate signed Cloudinary URL
    if (!material.cloudinary_public_id) {
      return NextResponse.json({ error: "Material does not contain a file asset" }, { status: 400, headers });
    }

    const resourceType = (material.cloudinary_resource_type as "image" | "raw") || "raw";
    const allowDownload = mode === "download";

    const signedUrl = generateSignedAccessUrl(
      material.cloudinary_public_id,
      resourceType,
      material.cloudinary_format,
      allowDownload,
      120 // 2 minutes short-lived URL
    );

    // Redirect user to the signed URL safely
    return NextResponse.redirect(signedUrl, { headers });
  } catch (err: any) {
    console.error("Error in access route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers });
  }
}
