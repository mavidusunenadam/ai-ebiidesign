import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

const BG_REMOVAL_API_URL = process.env.BG_REMOVAL_API_URL;

async function callBackgroundRemovalService(inputFile: File) {
  if (!BG_REMOVAL_API_URL) {
    throw new Error("BG_REMOVAL_API_URL tanımlı değil.");
  }

  const formData = new FormData();
  formData.append("file", inputFile);

  const res = await fetch(BG_REMOVAL_API_URL, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Background removal service hatası: ${errorText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const blob = await put(`exports/bg-removed-${Date.now()}.png`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType: "image/png"
  });

  return blob.url;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let inputFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json(
          { success: false, error: "Dosya bulunamadı." },
          { status: 400 }
        );
      }

      inputFile = file;
    } else {
      const body = await req.json();
      const imageUrl = body?.imageUrl as string | undefined;

      if (!imageUrl) {
        return NextResponse.json(
          { success: false, error: "imageUrl veya file gerekli." },
          { status: 400 }
        );
      }

      const imageRes = await fetch(imageUrl);

      if (!imageRes.ok) {
        throw new Error("Görsel indirilemedi.");
      }

      const imageArrayBuffer = await imageRes.arrayBuffer();

      inputFile = new File([imageArrayBuffer], "input.png", {
        type: "image/png"
      });
    }

    const url = await callBackgroundRemovalService(inputFile);

    return NextResponse.json({
      success: true,
      url
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Arka plan kaldırılırken hata oluştu."
      },
      { status: 500 }
    );
  }
}