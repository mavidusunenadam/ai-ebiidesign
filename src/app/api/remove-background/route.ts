import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageUrl = body?.imageUrl as string | undefined;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "imageUrl gerekli." },
        { status: 400 }
      );
    }

    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error("Görsel indirilemedi.");
    }

    const imageArrayBuffer = await imageRes.arrayBuffer();
    const inputFile = new File([imageArrayBuffer], "input.png", {
      type: "image/png"
    });

    const result = await openai.images.edit({
      model: "gpt-image-1.5",
      image: inputFile,
      prompt:
        "Remove the background completely and keep only the main subject cleanly cut out. Preserve all subject details.",
      background: "transparent",
      output_format: "png",
      quality: "medium",
      size: "auto"
    });

    const base64 = result.data?.[0]?.b64_json;
    if (!base64) {
      throw new Error("Arka plan kaldırılmış görsel üretilemedi.");
    }

    const buffer = Buffer.from(base64, "base64");

    const blob = await put(`exports/bg-removed-${Date.now()}.png`, buffer, {
      access: "public",
      addRandomSuffix: true,
      contentType: "image/png"
    });

    return NextResponse.json({
      success: true,
      url: blob.url
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