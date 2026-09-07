import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { saveUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "glovax-uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image file too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await saveUploadedFile(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: result.fileName,
      size: result.size,
      type: result.type,
      provider: result.provider,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

