import { cloudinary } from "./config";
if (process.env.NODE_ENV !== "test" && !process.env.NODE_TEST_CONTEXT) {
  require("server-only");
}

/**
 * Deletes a private/authenticated asset from Cloudinary.
 * 
 * @param publicId The unique Cloudinary public ID.
 * @param resourceType The Cloudinary resource type ('image' or 'raw').
 */
export async function deletePrivateAsset(
  publicId: string,
  resourceType: "image" | "raw"
): Promise<any> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: resourceType,
        type: "authenticated",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
