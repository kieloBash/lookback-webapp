import { Province } from "@/types/lib.type";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Force this route to be dynamic, allowing dynamic server-side logic
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/lookback/regions/{regCode}/provinces:
 *  get:
 *    description: Returns all provinces in the Philippines for specific regCode
 *    parameters:
 *      - name: regCode
 *        in: path
 *        required: true
 *        description: The regCode of the region
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 */

export async function GET(
  req: Request,
  { params }: { params: { regCode: string } }
) {
  try {
    const jsonDirectory = path.join(
      process.cwd(),
      process.env.DATA_PATH ?? "public/data"
    ); // Ensure correct base directory
    const filePath = path.join(jsonDirectory, "refprovince.json");

    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return new NextResponse("File for provinces not found", { status: 400 });
    }

    const fileContents = await fs.readFile(filePath, "utf-8");
    const provinces = JSON.parse(fileContents).filter(
      (x: Province) => x.regCode === params.regCode
    );

    return NextResponse.json({ payload: provinces });
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
