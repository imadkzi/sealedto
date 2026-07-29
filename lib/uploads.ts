import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";

export const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isAllowedUploadType(type: string) {
  return ALLOWED_UPLOAD_TYPES.has(type);
}

export type UploadProvider = "local" | "cloudinary";

export function getUploadProvider(): UploadProvider {
  return process.env.UPLOAD_PROVIDER?.toLowerCase() === "cloudinary"
    ? "cloudinary"
    : "local";
}

function validateUpload(file: File) {
  if (!isAllowedUploadType(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be 8MB or smaller");
  }
}

async function saveLocalUpload(userId: string, file: File) {
  const ext = EXTENSIONS[file.type] ?? "jpg";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const userDir = path.join(UPLOAD_ROOT, userId);
  await mkdir(userDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(userDir, filename), buffer);

  return `/api/uploads/${userId}/${filename}`;
}

async function saveCloudinaryUpload(userId: string, file: File) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is selected but CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET is missing",
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `sealedto/${userId}`;
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const form = new FormData();
  form.set("file", file);
  form.set("api_key", apiKey);
  form.set("timestamp", String(timestamp));
  form.set("folder", folder);
  form.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    { method: "POST", body: form },
  );
  const result = (await response.json().catch(() => null)) as {
    secure_url?: string;
    error?: { message?: string };
  } | null;
  if (!response.ok || !result?.secure_url) {
    throw new Error(result?.error?.message || "Cloudinary upload failed");
  }
  return result.secure_url;
}

export async function saveUserUpload(userId: string, file: File) {
  validateUpload(file);
  return getUploadProvider() === "cloudinary"
    ? saveCloudinaryUpload(userId, file)
    : saveLocalUpload(userId, file);
}

export function resolveUploadPath(userId: string, filename: string) {
  const safeUser = path.basename(userId);
  const safeFile = path.basename(filename);
  return path.join(UPLOAD_ROOT, safeUser, safeFile);
}
