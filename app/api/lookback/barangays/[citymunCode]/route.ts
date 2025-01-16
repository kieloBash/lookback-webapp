import { Barangay } from "@/types/lib.type";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Force this route to be dynamic, allowing dynamic server-side logic
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/lookback/city-municipalities/{citymunCode}/barangays:
 *  get:
 *    description: Returns all barangays in the Philippines for specific citymunCode
 *    parameters:
 *      - name: citymunCode
 *        in: path
 *        required: true
 *        description: The citymunCode of the city-municipality
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 */
export async function GET(
  req: Request,
  { params }: { params: { citymunCode: string } }
) {
  try {
    const jsonDirectory = path.join(
      process.cwd(),
      process.env.DATA_PATH ?? "public/data"
    ); // Ensure correct base directory
    const filePath = path.join(jsonDirectory, "refbrgy.json");

    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return new NextResponse("File for barangays not found", {
        status: 400,
      });
    }

    const fileContents = await fs.readFile(filePath, "utf-8");
    const barangays = JSON.parse(fileContents).filter(
      (x: Barangay) => x.citymunCode === params.citymunCode
    );

    return NextResponse.json({ payload: barangays });
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
