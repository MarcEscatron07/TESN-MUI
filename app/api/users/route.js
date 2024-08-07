import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/users.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.has('userId') ? searchParams.get('userId') : -1;

    for (const key in jsonData) {
        if (jsonData[key]?.id == userId) {
            return NextResponse.json({
              status: 200,
              message: "Data fetch successful.",
              data: jsonData[key],
            }, { status: 200 });
        }
      }

      return NextResponse.json({
        status: 400,
        message: "Data fetch failed.",
      }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
        status: 500,
        message: "An unexpected error occured.",
        data: e
    }, { status: 500 });
  }
}

export async function POST(req, res) {

}
