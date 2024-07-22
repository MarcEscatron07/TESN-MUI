import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/friends.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    for (const key in jsonData) {
        const authUserData = sessionStorage.getItem('authuser_data') ? JSON.parse(sessionStorage.getItem('authuser_data')) : null;

        if (
            jsonData[key]?.userId == authUserData?.id && jsonData[key]?.friends
        ) {
            return NextResponse.json({
                status: 200,
                message: "Data fetch successful.",
                data: jsonData[key]?.friends,
              }, { status: 200 });
        } else {
            return NextResponse.json({
                status: 400,
                message: "Data fetch failed.",
              }, { status: 400 });
        }
    }
  } catch (e) {
    return NextResponse.json({
        status: 500,
        message: "An unexpected error occured.",
    }, { status: 500 });
  }
}

export async function POST(req, res) {

}
