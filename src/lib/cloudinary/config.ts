import { v2 as cloudinary } from "cloudinary";
if (process.env.NODE_ENV !== "test" && !process.env.NODE_TEST_CONTEXT) {
  require("server-only");
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (process.env.NODE_ENV !== "test" && (!cloudName || !apiKey || !apiSecret)) {
  throw new Error(
    "Missing required Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)"
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };
