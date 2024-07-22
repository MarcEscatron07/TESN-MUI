import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/posts.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    return NextResponse.json({
        status: 200,
        message: "Data fetch successful.",
        data: jsonData,
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json({
        status: 500,
        message: "An unexpected error occured.",
    }, { status: 500 });
  }
}

export async function POST(req, res) {

}
