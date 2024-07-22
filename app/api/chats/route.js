import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {

}

export async function POST(req, res) {
    try {
      const formData = await req.formData();
      const friendId = formData.get("friendId");
      const chatType = formData.get("chatType");

      /** temporary code **/
      const jsonPath = "/public/json/chats.json";
      const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
      const jsonData = JSON.parse(jsonFile);
      /** temporary code **/
    
      for (const key in jsonData) {
          const authUserData = sessionStorage.getItem('authuser_data') ? JSON.parse(sessionStorage.getItem('authuser_data')) : null;
    
          if (
              jsonData[key]?.userIds?.includes(authUserData?.id) && jsonData[key]?.userIds?.includes(friendId) &&
              jsonData[key]?.type == chatType && 
              jsonData[key]?.chats
          ) {
              return NextResponse.json({
                  status: 200,
                  message: "Data fetch successful.",
                  data: jsonData[key]?.chats,
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
