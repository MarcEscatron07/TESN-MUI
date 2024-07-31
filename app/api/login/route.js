import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {

}

export async function POST(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/users.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/
    
    const formData = await req.formData();
    const username = formData.has('username') ? formData.get('username') : '';
    const password = formData.get('password') ? formData.get('password') : '';

    for (const key in jsonData) {
      if (
        jsonData[key]?.id &&
        jsonData[key]?.username == username &&
        jsonData[key]?.password == password
      ) {
        return NextResponse.json({
          status: 200,
          message: "Post login successful.",
          data: jsonData[key]?.id
        }, { status: 200 });
      }
    }

    return NextResponse.json({
      status: 400,
      message: "Unable to post login.",
    }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}
