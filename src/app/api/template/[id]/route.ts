import {
  readTemplateStructureFromJson,
  saveTemplateStructureToJson,
} from "@/features/playground/lib/path-to-json";
import prisma from "@/lib/db";
import { templatePath } from "@/lib/template";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

/**
 * VALIDATE JSON STRUCTURE
 */
function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Test if data is serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const param = await params;
  const id = param.id;

  /**
   * WHY WE VALIDATE THE PLAYGROUND ID
   */
  if (!id) {
    return NextResponse.json(
      {
        error: "Missing playground ID",
        code: "MISSING_ID",
      },
      { status: 400 }
    );
  }

  let outputFile: string | null = null;

  try {
    /**
     * FETCH FROM DATABASE FIRST
     */
    const playground = await prisma.playground.findUnique({
      where: { id },
    });

    if (!playground) {
      return NextResponse.json(
        {
          error: "Playground not found",
          code: "PLAYGROUND_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    /**
     *  MAP TEMPLATE ENUM TO FILE PATHS
     */
    const templateKey = playground.template as keyof typeof templatePath;

    const templatesPath = templatePath[templateKey];

    if (!templatesPath) {
      return NextResponse.json(
        {
          error: "Invalid template type",
          code: "INVALID_TEMPLATE",
        },
        { status: 404 }
      );
    }

    /**
     * PROCESS FILES DYNAMICALLY
     */
    const inputPath = path.join(process.cwd(), templatesPath);
    outputFile = path.join(
      process.cwd(),
      `output/${templateKey}-${Date.now()}.json`
    );

    console.log("Processing template:", { templateKey, inputPath, outputFile });

    /**
     * USE TEMPORARY FILES
     */
    await saveTemplateStructureToJson(inputPath, outputFile);
    const result = await readTemplateStructureFromJson(outputFile);

    /**
     * VALIDATE THE RESULT
     */
    if (!validateJsonStructure(result.items)) {
      return NextResponse.json(
        {
          error: "Generated template has invalid structure",
          code: "INVALID_JSON_STRUCTURE",
        },
        { status: 500 }
      );
    }

    /**
     * WHY WE ADD CACHING HEADERS
     *
     * Performance Optimization:
     * - Templates don't change frequently, so cache them
     * - Reduces server load and processing time
     * - Improves user experience with faster loading
     * - CDN can cache responses globally
     *
     * Cache-Control breakdown:
     * - public: Can be cached by browsers and CDNs
     * - s-maxage=3600: Cache for 1 hour on CDN/proxy
     * - stale-while-revalidate=86400: Serve stale version while updating
     */
    return NextResponse.json(
      { success: true, templateJson: result },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    /**
     * WHY WE HAVE COMPREHENSIVE ERROR HANDLING
     *
     * Reliability & Debugging:
     * - File system operations can fail (permissions, disk space)
     * - Template processing might encounter corrupt files
     * - Network issues can cause database timeouts
     * - Structured errors help frontend handle failures gracefully
     * - Detailed logging helps developers debug issues
     */
    console.error("Error generating template JSON:", error);

    return NextResponse.json(
      {
        error: "Failed to generate template structure",
        code: "TEMPLATE_GENERATION_FAILED",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    /**
     * WHY WE CLEANUP TEMPORARY FILES
     *
     * Resource Management:
     * - Prevents disk space from filling up over time
     * - Removes sensitive template data from server
     * - Ensures no leftover files from failed operations
     * - Good practice for production server hygiene
     *
     * The finally block ensures cleanup happens even if errors occur
     */
    if (outputFile) {
      try {
        await fs.unlink(outputFile);
      } catch (cleanupError) {
        console.warn(
          "Failed to cleanup temporary file:",
          outputFile,
          cleanupError
        );
      }
    }
  }
}
