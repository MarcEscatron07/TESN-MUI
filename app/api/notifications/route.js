import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req, res) {
  try {
    /** temporary code **/
    const jsonPath = "/public/json/tests/notifications.json";
    const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
    const jsonData = JSON.parse(jsonFile);
    /** temporary code **/

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.has('userId') ? searchParams.get('userId') : -1;

    for (const key in jsonData) {
      if (
        jsonData[key]?.userId == userId && jsonData[key]?.notifications
      ) {
        return NextResponse.json({
          status: 200,
          message: "Data fetch successful.",
          data: jsonData[key]?.notifications,
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
        const jsonPath = "/public/json/tests/notifications.json";
        const jsonFile = await fs.readFile(path.join(process.cwd(), jsonPath), "utf8");
        const jsonData = JSON.parse(jsonFile);
        /** temporary code **/
    
        const formData = await req.formData();
        const userId = formData.has('userId') ? parseInt(formData.get('userId')) : -1;
        const chatId = formData.has('chatId') ? parseInt(formData.get('chatId')) : -1;
        const chatType = formData.has('chatType') ? formData.get('chatType') : '';
        const chatObj = formData.has('chatObj') ? JSON.parse(formData.get('chatObj')) : null;
        const chatInput = formData.has('chatInput') ? JSON.parse(formData.get('chatInput')) : null;
        console.log('NOTIFICATIONS > POST > formData', formData)
        console.log('NOTIFICATIONS > POST > userId', userId)
        console.log('NOTIFICATIONS > POST > chatId', chatId)
        console.log('NOTIFICATIONS > POST > chatType', chatType)
        console.log('NOTIFICATIONS > POST > chatObj', chatObj)
        console.log('NOTIFICATIONS > POST > chatInput', chatInput)
    
        let dataArr = [];
        let dataIdx = -1;
        let dataObj = {};
    
        switch (chatType) {
          case 'single':
            for (const key in jsonData) {
              if(jsonData[key]?.userId == chatId && jsonData[key]['notifications'] && jsonData[key]['notifications']['messages']) {
                dataArr = jsonData[key]['notifications']['messages']['data'];
                dataIdx = dataArr.map((i) => i?.chatInput?.sender).indexOf(chatInput?.sender);

                if(dataIdx != -1) {
                  dataArr[dataIdx] = { chatObj: chatObj, chatInput: chatInput };
                } else {
                  dataArr = [...jsonData[key]['notifications']['messages']['data'], { chatObj: chatObj, chatInput: chatInput }];
                }

                jsonData[key]['notifications']['messages']['data'] = dataArr;
                jsonData[key]['notifications']['messages']['count'] = dataArr.map((i) => i?.chatInput?.status == 'unread').length;
    
                dataObj = jsonData[key]['notifications'];
        
                console.log('NOTIFICATIONS > POST > single > count', parseInt(jsonData[key]['notifications']['messages']['count']))
                console.log('NOTIFICATIONS > POST > single > data', jsonData[key]['notifications']['messages']['data'])
              }
            }
    
            await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));
    
            return NextResponse.json({
              status: 200,
              message: "Post notification successful.",
              data: {
                ...dataObj,
                chatType: chatType
              }
            }, { status: 200 });
          case 'multiple':
            for (const key in jsonData) {
              if(jsonData[key]?.userId != userId && jsonData[key]?.groupIds && jsonData[key]?.groupIds.includes(chatId) && jsonData[key]['notifications'] && jsonData[key]['notifications']['messages']) {
                dataArr = jsonData[key]['notifications']['messages']['data'];
                dataIdx = dataArr.map((i) => i?.chatInput?.receiver).indexOf(chatInput?.receiver);

                if(dataIdx != -1) {
                  dataArr[dataIdx] = { chatObj: chatObj, chatInput: chatInput };
                } else {
                  dataArr = [...jsonData[key]['notifications']['messages']['data'], { chatObj: chatObj, chatInput: chatInput }];
                }

                jsonData[key]['notifications']['messages']['data'] = dataArr;
                jsonData[key]['notifications']['messages']['count'] = dataArr.map((i) => i?.chatInput?.status == 'unread').length;
    
                dataObj = jsonData[key]['notifications'];
        
                console.log('NOTIFICATIONS > POST > multiple > count', parseInt(jsonData[key]['notifications']['messages']['count']))
                console.log('NOTIFICATIONS > POST > multiple > data', jsonData[key]['notifications']['messages']['data'])
              }
            }
    
            await fs.writeFile(path.join(process.cwd(), jsonPath), JSON.stringify(jsonData));
        
            return NextResponse.json({
              status: 200,
              message: "Post notification successful.",
              data: {
                ...dataObj,
                chatType: chatType
              }
            }, { status: 200 });
        }
    
        return NextResponse.json({
          status: 400,
          message: "Unable to post notification.",
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
    // TO-DO: code logic for patching notification on ChatBox > Focus

    return NextResponse.json({
      status: 200,
      message: "Patch notification successful.",
      data: null
    }, { status: 200 });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}