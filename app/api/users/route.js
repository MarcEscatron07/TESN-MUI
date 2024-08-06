import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/users.json";
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

export async function PATCH(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/users.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    const formData = await req.formData();
    const userId = formData.has('userId') ? parseInt(formData.get('userId')) : -1;
    const chatId = formData.has('chatId') ? parseInt(formData.get('chatId')) : -1;
    const chatType = formData.has('chatType') ? formData.get('chatType') : '';
    const chatInput = formData.has('chatInput') ? JSON.parse(formData.get('chatInput')) : null;
    console.log('USERS > PATCH > formData', formData)
    console.log('USERS > PATCH > userId', userId)
    console.log('USERS > PATCH > chatId', chatId)
    console.log('USERS > PATCH > chatType', chatType)
    console.log('USERS > PATCH > chatInput', chatInput)

    let dataObj = {};

    switch (chatType) {
      case 'single':
        for (const key in jsonData) {
          if(jsonData[key]?.id == chatId && jsonData[key]['notifs'] && jsonData[key]['notifs']['messages']) {
            jsonData[key]['notifs']['messages']['count'] = parseInt(jsonData[key]['notifs']['messages']['count']) + 1;
            jsonData[key]['notifs']['messages']['data'] = [...jsonData[key]['notifs']['messages']['data'], chatInput];

            dataObj = jsonData[key]['notifs'];
    
            console.log('USERS > PATCH > single > count', parseInt(jsonData[key]['notifs']['messages']['count']))
            console.log('USERS > PATCH > single > data', jsonData[key]['notifs']['messages']['data'])
          }
        }

        await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));

        return NextResponse.json({
          status: 200,
          message: "Patch user successful.",
          data: {
            ...dataObj,
            chatType: chatType
          }
        }, { status: 200 });
      case 'multiple':
        for (const key in jsonData) {
          if(jsonData[key]?.id != userId && jsonData[key]?.groupIds && jsonData[key]?.groupIds.includes(chatId) && jsonData[key]['notifs'] && jsonData[key]['notifs']['messages']) {
            jsonData[key]['notifs']['messages']['count'] = parseInt(jsonData[key]['notifs']['messages']['count']) + 1;
            jsonData[key]['notifs']['messages']['data'] = [...jsonData[key]['notifs']['messages']['data'], chatInput];

            dataObj = jsonData[key]['notifs'];
    
            console.log('USERS > PATCH > multiple > count', parseInt(jsonData[key]['notifs']['messages']['count']))
            console.log('USERS > PATCH > multiple > data', jsonData[key]['notifs']['messages']['data'])
          }
        }

        await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));
    
        return NextResponse.json({
          status: 200,
          message: "Patch user successful.",
          data: {
            ...dataObj,
            chatType: chatType
          }
        }, { status: 200 });
    }

    return NextResponse.json({
      status: 400,
      message: "Unable to patch user.",
    }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}
