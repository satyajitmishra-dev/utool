import { NextRequest, NextResponse } from "next/server";
import { converterProviders } from "@/config/converters";
import { getToolBySlug } from "@/config/tool-registry";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { fileKey, originalName, options, rawContent } = body;

    if (!fileKey && rawContent === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: fileKey or rawContent" },
        { status: 400 }
      );
    }

    const config = getToolBySlug(id);
    if (!config || !config.isConverter) {
      return NextResponse.json(
        { error: "Converter not found" },
        { status: 404 }
      );
    }

    const provider = converterProviders[id];
    if (!provider) {
      return NextResponse.json(
        { error: "No provider configured for this converter" },
        { status: 501 }
      );
    }

    // Determine formats
    const ext = originalName.split('.').pop()?.toLowerCase();
    const inputFormat = `.${ext}`;
    const outputFormat = config.supportedOutputFormats?.[0] || '.txt'; // Default fallback

    if (!config.supportedInputFormats?.includes(inputFormat)) {
      return NextResponse.json(
        { error: `Unsupported input format: ${inputFormat}` },
        { status: 400 }
      );
    }

    // Execute Conversion
    const jobId = uuidv4();
    const result = await provider.convert({
      id: jobId,
      inputFileKey: fileKey,
      rawContent,
      inputFormat,
      outputFormat,
      options
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Conversion failed" },
        { status: 500 }
      );
    }

    // Return the result
    // We provide a download URL pointing to a new endpoint or directly to R2 if public (which it shouldn't be).
    // For now, let's assume we have a download endpoint `/api/download?key=`
    return NextResponse.json({
      success: true,
      downloadUrl: result.rawOutputContent !== undefined ? undefined : `/api/download?key=${result.outputFileKey}&format=${outputFormat.replace('.', '')}`,
      rawOutputContent: result.rawOutputContent,
      timeTakenMs: result.timeTakenMs
    });

  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Internal server error during conversion" },
      { status: 500 }
    );
  }
}
