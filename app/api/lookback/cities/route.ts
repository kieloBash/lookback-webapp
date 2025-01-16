import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Force this route to be dynamic, allowing dynamic server-side logic
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/lookback/city-municipalities:
 *  get:
 *    description: Returns all city/municipalities in the Philippines
 *    responses:
 *      200:
 *        description: Success
 */
export async function GET() {
  try {
    const jsonDirectory = path.join(
      process.cwd(),
      process.env.DATA_PATH ?? "public/data"
    ); // Ensure correct base directory
    const filePath = path.join(jsonDirectory, "refcitymun.json");

    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return new NextResponse("File for city/municipalities not found", {
        status: 400,
      });
    }

    const fileContents = await fs.readFile(filePath, "utf-8");
    const cityMunicipalities = JSON.parse(fileContents);

    return NextResponse.json({ payload: cityMunicipalities });
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
