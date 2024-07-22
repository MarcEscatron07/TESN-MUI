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

    let dataArr = [];
    
    for (const key in jsonData) {
        const dataObj = JSON.parse(JSON.stringify(jsonData[key]));
        delete dataObj["username"];
        delete dataObj["password"];

        dataArr.push(dataObj);
    }

    return NextResponse.json({
        status: 200,
        message: "Data fetch successful.",
        data: dataArr,
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
