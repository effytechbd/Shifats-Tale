import { cloudinary } from "./config";
if (process.env.NODE_ENV !== "test" && !process.env.NODE_TEST_CONTEXT) {
  require("server-only");
}

/**
 * Generates a short-lived authenticated signed URL for a Cloudinary asset.
 * 
 * @param publicId The unique Cloudinary public ID.
 * @param resourceType The Cloudinary resource type ('image' or 'raw').
 * @param format Optional file format extension (e.g. 'pdf', 'png').
 * @param allowDownload If true, will configure the URL to trigger browser download attachment where supported.
 * @param expiresInSeconds Duration before the signed URL expires (default: 120 seconds / 2 minutes).
 */
export function generateSignedAccessUrl(
  publicId: string,
  resourceType: "image" | "raw",
  format: string | null,
  allowDownload: boolean,
  expiresInSeconds: number = 120
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  // For 'raw' files, Cloudinary doesn't support transformations or format extension suffixes in the url helper.
  // For 'image' resource_types (like pdf or png), we suffix the format.
  const publicIdWithFormat = format && resourceType !== "raw" ? `${publicId}.${format}` : publicId;

  const options: any = {
    resource_type: resourceType,
    type: "authenticated",
    sign_url: true,
    expires_at: expiresAt,
  };

  // Only apply attachment flags to image-resource types (images & PDFs) if download is requested
  if (resourceType === "image" && allowDownload) {
    options.flags = "attachment";
  }

  return cloudinary.url(publicIdWithFormat, options);
}
