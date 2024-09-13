import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/threads.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.has('userId') ? parseInt(searchParams.get('userId')) : -1;
    const chatId = searchParams.has('chatId') ? parseInt(searchParams.get('chatId')) : -1;
    const chatType = searchParams.has('chatType') ? searchParams.get('chatType') : '';
  
    for (const key in jsonData) {
        if (
            jsonData[key]?.chatIds?.includes(userId) && jsonData[key]?.chatIds?.includes(chatId) &&
            jsonData[key]?.type == chatType && 
            jsonData[key]?.threads
        ) {
            return NextResponse.json({
              status: 200,
              message: "Data fetch successful.",
              data: {
                threads: jsonData[key]?.threads,
                chatId: chatId
              },
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
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/threads.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/
  
    const formData = await req.formData();
    const userId = formData.has('userId') ? parseInt(formData.get('userId')) : -1;
    const chatId = formData.has('chatId') ? parseInt(formData.get('chatId')) : -1;
    const chatType = formData.has('chatType') ? formData.get('chatType') : '';
    const chatInput = formData.has('chatInput') ? JSON.parse(formData.get('chatInput')) : null;
    console.log('THREADS > POST > formData', formData)
    console.log('THREADS > POST > chatInput', chatInput)
  
    for (const key in jsonData) {
      if (
        jsonData[key]?.chatIds?.includes(userId) && jsonData[key]?.chatIds?.includes(chatId) &&
        jsonData[key]?.type == chatType && 
        jsonData[key]?.threads && 
        chatInput
      ) {
        jsonData[key]?.threads?.push(chatInput);

        await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));

        return NextResponse.json({
          status: 200,
          message: "Post thread successful.",
          data: chatInput
        }, { status: 200 });
      }
    }
  
    return NextResponse.json({
      status: 400,
      message: "Unable to post thread.",
    }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}

export async function PATCH(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/threads.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/
  
    const formData = await req.formData();
    const userId = formData.has('userId') ? parseInt(formData.get('userId')) : -1;
    const chatId = formData.has('chatId') ? parseInt(formData.get('chatId')) : -1;
    const chatType = formData.has('chatType') ? formData.get('chatType') : '';
    console.log('THREADS > PATCH > formData', formData)
  
    for (const key in jsonData) {
      if (
        jsonData[key]?.chatIds?.includes(userId) && jsonData[key]?.chatIds?.includes(chatId) &&
        jsonData[key]?.type == chatType && 
        jsonData[key]?.threads
      ) {
        // UPDATE TARGET THREAD HERE

        // await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));

        return NextResponse.json({
          status: 200,
          message: "Patch thread successful.",
          data: chatInput
        }, { status: 200 });
      }
    }
  
    return NextResponse.json({
      status: 400,
      message: "Unable to patch thread.",
    }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}
