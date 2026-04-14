import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(file: Buffer, folder: string = "affordable-wigs"): Promise<UploadResult> {
  try {
    // Convert buffer to base64
    const base64 = file.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" }, // Limit max dimensions
        { quality: "auto", fetch_format: "auto" }, // Optimize quality and format
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image",
    };
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

export default cloudinary;