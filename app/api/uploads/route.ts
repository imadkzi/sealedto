import { getSessionUser } from "@/lib/session";
import { getUploadProvider, saveUserUpload } from "@/lib/uploads";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const url = await saveUserUpload(user.id, file);
    return Response.json({ url, provider: getUploadProvider() });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not upload image",
      },
      { status: 400 },
    );
  }
}
