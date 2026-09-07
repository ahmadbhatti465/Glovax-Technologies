import { v2 as cloudinary } from "cloudinary";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

// Initialize Cloudinary if environment variables are present
function initCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });
    return true;
  }
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    return true;
  }
  return false;
}

/**
 * Optimizes an image using sharp if available.
 * Resizes large dimensions to max 1920px width and converts to high-quality WebP.
 */
export async function optimizeImage(
  buffer: Buffer,
  mimeType: string,
  maxWidth = 1920
): Promise<{ buffer: Buffer; mimeType: string; extension: string }> {
  try {
    // Skip SVG, GIF animation preservation
    if (mimeType.includes("svg") || mimeType.includes("gif")) {
      return {
        buffer,
        mimeType,
        extension: mimeType.includes("svg") ? ".svg" : ".gif",
      };
    }

    // Dynamically load sharp to avoid issues in environments where binary bindings are optional
    const sharp = (await import("sharp")).default;
    const img = sharp(buffer);
    const meta = await img.metadata();

    let pipeline = img;
    if (meta.width && meta.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }

    const optimized = await pipeline.webp({ quality: 85, effort: 4 }).toBuffer();
    return {
      buffer: optimized,
      mimeType: "image/webp",
      extension: ".webp",
    };
  } catch {
    // If sharp fails or is unavailable, fallback to original buffer
    const extension = mimeType.includes("png")
      ? ".png"
      : mimeType.includes("webp")
      ? ".webp"
      : mimeType.includes("svg")
      ? ".svg"
      : ".jpg";
    return { buffer, mimeType, extension };
  }
}

/**
 * Uploads a buffer to Cloudinary.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  folder = "glovax-uploads"
): Promise<{ url: string; publicId: string }> {
  initCloudinary();
  const baseName = fileName.replace(/\.[^/.]+$/, "");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: baseName,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve({
            url: result.secure_url || result.url,
            publicId: result.public_id,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Uploads a buffer to Vercel Blob.
 */
export async function uploadToVercelBlob(
  buffer: Buffer,
  fileName: string
): Promise<{ url: string }> {
  const blob = await put(`uploads/${fileName}`, buffer, {
    access: "public",
  });
  return { url: blob.url };
}

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  type: string;
  provider: "cloudinary" | "vercel-blob" | "local" | "base64";
}

/**
 * Robust multi-tier file storage handler:
 * 1. Cloudinary (if configured via env vars)
 * 2. Vercel Blob (if configured via BLOB_READ_WRITE_TOKEN)
 * 3. Local disk storage (in local dev / writable filesystem)
 * 4. Fallback to optimized Base64 data URL (prevents serverless ENOENT crashes)
 */
export async function saveUploadedFile(
  rawBuffer: Buffer,
  originalFileName: string,
  rawMimeType: string,
  folder = "glovax-uploads"
): Promise<UploadResult> {
  const { buffer, mimeType, extension } = await optimizeImage(rawBuffer, rawMimeType);

  const cleanName = originalFileName
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .toLowerCase()
    .replace(/\.[^/.]+$/, "");
  const fileName = `${cleanName}_${Date.now()}${extension}`;

  // 1. Cloudinary
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
  );

  if (isCloudinaryConfigured) {
    try {
      const res = await uploadToCloudinary(buffer, fileName, folder);
      return {
        url: res.url,
        fileName,
        size: buffer.length,
        type: mimeType,
        provider: "cloudinary",
      };
    } catch (err) {
      console.warn("Cloudinary upload failed, falling back to next provider:", err);
    }
  }

  // 2. Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const res = await uploadToVercelBlob(buffer, fileName);
      return {
        url: res.url,
        fileName,
        size: buffer.length,
        type: mimeType,
        provider: "vercel-blob",
      };
    } catch (err) {
      console.warn("Vercel Blob upload failed, falling back to next provider:", err);
    }
  }

  // 3. Local filesystem (if writable and not serverless)
  const isServerless = Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.cwd().startsWith("/var/task")
  );

  if (!isServerless) {
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return {
        url: `/uploads/${fileName}`,
        fileName,
        size: buffer.length,
        type: mimeType,
        provider: "local",
      };
    } catch (err) {
      console.warn("Local disk write failed, falling back to base64 data URL:", err);
    }
  }

  // 4. Guaranteed zero-failure fallback: Base64 Data URL
  // Works immediately on serverless hosting (Vercel, AWS Lambda) without requiring extra storage setup
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return {
    url: dataUrl,
    fileName,
    size: buffer.length,
    type: mimeType,
    provider: "base64",
  };
}
