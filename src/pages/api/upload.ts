import type { APIRoute } from "astro";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import fs from "node:fs/promises";
import path from "node:path";

cloudinary.config({
  cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.CLOUDINARY_API_KEY,
  api_secret: import.meta.env.CLOUDINARY_API_SECRET,
});

const outputDir = path.join(process.cwd(), "public/text");

const uploadStream = async (
  buffer: Uint8Array,
  options: { folder: string; ocr?: string }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (file === null) {
    return new Response("No file found", { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(buffer);

  const result = await uploadStream(fileBuffer, {
    folder: "chat-with-pdf",
    ocr: "adv_ocr",
  });

  if (!result) {
    return new Response("Upload failed", { status: 400 });
  }

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;

  const text = data
    .map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks["textAnnotations"] ?? {};
      const first = annotations[0] ?? {};
      const content = first["description"] ?? "";
      return content.trim();
    })
    .filter(Boolean)
    .join("\n");

  fs.writeFile(`${outputDir}/${id}.txt`, text, "utf-8");

  return new Response(JSON.stringify({ id, url, pages }));
};
