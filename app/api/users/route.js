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

    let usersArr = jsonData ? jsonData.map((item) => {
      return {
        id: item.id ?? -1,
        name: item.name ?? '',
        image: item.image ?? ''
      }
    }) : [];

    if(userId != -1) {
      usersArr = usersArr.filter((i) => i.id != userId);
    }

    return NextResponse.json({
      status: 200,
      message: "Data fetch successful.",
      data: usersArr,
    }, { status: 200 });
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
