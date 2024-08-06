import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/chats.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.has('userId') ? searchParams.get('userId') : -1;

    for (const key in jsonData) {
      if (
        jsonData[key]?.userId == userId && jsonData[key]?.friends && jsonData[key]?.groups
      ) {
        return NextResponse.json({
          status: 200,
          message: "Data fetch successful.",
          data: {
            friends: jsonData[key]?.friends,
            groups: jsonData[key]?.groups
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

}

export async function PATCH(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/chats.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    const formData = await req.formData();
    const userId = formData.has('userId') ? parseInt(formData.get('userId')) : -1;
    const chatId = formData.has('chatId') ? parseInt(formData.get('chatId')) : -1;
    const chatType = formData.has('chatType') ? formData.get('chatType') : '';
    const chatInput = formData.has('chatInput') ? JSON.parse(formData.get('chatInput')) : null;
    console.log('CHATS > PATCH > formData', formData)
    console.log('CHATS > PATCH > userId', userId)
    console.log('CHATS > PATCH > chatId', chatId)
    console.log('CHATS > PATCH > chatType', chatType)
    console.log('CHATS > PATCH > chatInput', chatInput)

    let dataArr = [];
    let dataObj = {};

    switch (chatType) {
      case 'single':
        for (const key in jsonData) {
          if (jsonData[key]?.userId == chatId) {
            dataArr = jsonData[key]['friends'] ?? [];

            dataArr.forEach((item) => {
              if (item?.id == userId && item['notifs'] && item['notifs']['messages']) {
                item['notifs']['messages']['count'] = parseInt(item['notifs']['messages']['count']) + 1
                item['notifs']['messages']['data'] = [...item['notifs']['messages']['data'], chatInput];

                dataObj = item['notifs'];

                console.log('CHATS > PATCH > single > count', parseInt(item['notifs']['messages']['count']))
                console.log('CHATS > PATCH > single > data', item['notifs']['messages']['data'])
              }
            });

            jsonData[key]['friends'] = dataArr;
          }
        }

        await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));

        return NextResponse.json({
          status: 200,
          message: "Patch chat successful.",
          data: {
            ...dataObj,
            chatType: chatType
          }
        }, { status: 200 });
      case 'multiple':
        for (const key in jsonData) {
          if (jsonData[key]?.userId != userId) {
            dataArr = jsonData[key]['groups'] ?? [];
  
            dataArr.forEach((item) => {
              if(item?.id == chatId && item['notifs'] && item['notifs']['messages']) {
                item['notifs']['messages']['count'] = parseInt(item['notifs']['messages']['count']) + 1
                item['notifs']['messages']['data'] = [...item['notifs']['messages']['data'], chatInput];
  
                dataObj = item['notifs'];
  
                console.log('CHATS > PATCH > multiple > count', parseInt(item['notifs']['messages']['count']))
                console.log('CHATS > PATCH > multiple > data', item['notifs']['messages']['data'])
              }
            });
  
            jsonData[key]['groups'] = dataArr;
          };
        }

        await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));

        return NextResponse.json({
          status: 200,
          message: "Patch chat successful.",
          data: {
            ...dataObj,
            chatType: chatType
          }
        }, { status: 200 });
    }

    return NextResponse.json({
      status: 400,
      message: "Unable to patch chat.",
    }, { status: 400 });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}
