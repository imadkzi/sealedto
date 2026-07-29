import { readFile, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { resolveUploadPath } from "@/lib/uploads";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const segments = (await context.params).path ?? [];
  if (segments.length !== 2) {
    return new Response("Not found", { status: 404 });
  }

  const [userId, filename] = segments;
  const filePath = resolveUploadPath(userId, filename);

  try {
    await access(filePath, constants.R_OK);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const buffer = await readFile(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
