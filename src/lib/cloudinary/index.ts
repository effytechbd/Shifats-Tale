if (process.env.NODE_ENV !== "test" && !process.env.NODE_TEST_CONTEXT) {
  require("server-only");
}

export { cloudinary } from "./config";
export {
  sanitizeFilename,
  generatePublicId,
  getCloudinaryResourceType,
  uploadPrivateAsset,
} from "./upload";
export { generateSignedAccessUrl } from "./access";
export { deletePrivateAsset } from "./delete";
export { validateUploadedFile, validateFileMagicBytes } from "./validation";

import { UploadApiResponse } from "cloudinary";

/**
 * Validates that the Cloudinary upload response contains the required identifiers.
 */
export function isValidUploadResponse(response: any): response is UploadApiResponse {
  return (
    response &&
    typeof response.public_id === "string" &&
    typeof response.asset_id === "string"
  );
}
