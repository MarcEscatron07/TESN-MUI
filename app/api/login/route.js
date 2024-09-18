import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import CryptoJS from 'crypto-js';
import { cookies } from 'next/headers';

export async function GET(req, res) {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken');

    if (authToken && authToken.value) {
      const tokenString = authToken.value;
      const tokenValue = CryptoJS.AES.decrypt(tokenString, 'secret-key').toString(CryptoJS.enc.Utf8);

      let dataObj = {
        id: tokenValue && tokenValue.split('|')[0]
          && !isNaN(tokenValue.split('|')[0]) ? parseInt(tokenValue.split('|')[0]) : '',
        username: tokenValue && tokenValue.split('|')[1] ? tokenValue.split('|')[1] : '',
        password: tokenValue && tokenValue.split('|')[2] ? tokenValue.split('|')[2] : '',
      }

      return NextResponse.json({
        status: 200,
        message: "Get login successful.",
        data: dataObj
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 400,
        message: "Unable to get login.",
      }, { status: 400 });
    }
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
    const jsonPath = "/public/json/users.json";
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
        const tokenString = `${jsonData[key]?.id}|${username}|${password}`;
        const tokenValue = CryptoJS.AES.encrypt(tokenString, 'secret-key').toString();

        const response = NextResponse.json({
          status: 200,
          message: "Post login successful.",
          data: jsonData[key]?.id
        }, { status: 200 });

        response.cookies.set('authToken', tokenValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24,
          path: '/',
        });

        return response;
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

export async function DELETE(req, res) {
  try {
    const response = NextResponse.json({
      status: 200,
      message: "Delete login successful.",
    }, { status: 200 });

    response.cookies.set('authToken', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1,
      path: '/',
    });

    return response;
  } catch (e) {
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occured.",
      data: e
    }, { status: 500 });
  }
}
