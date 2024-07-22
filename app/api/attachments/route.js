import { NextResponse } from 'next/server';
import moment from 'moment-timezone';
// import { promises as fs } from "fs";
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
const pump = promisify(pipeline);

const dirAttachments = path.join(process.cwd(), 'public/attachments');

export async function GET(req, res) {
    const attachmentsArr = fs.readdirSync(dirAttachments) ?? [];

    return NextResponse.json(JSON.stringify(attachmentsArr));
}

export async function POST(req, res) {
    try {
        const formData = await req.formData();
        const user = formData.get('user');
        const files = formData.getAll('files');
        // console.log('ATTACHMENTS > POST > files', files)
        const filesArr = Array.from(files).map((item) => {
            return {
                file: item,
                fileName: `${user}_${moment().format('MM-DD-YYYY')}_${item.name}`.replace(' ', ''),
                name: item?.name,
                type: item?.type, 
                size: item?.size, 
                lastModified: item?.lastModified, 
                // lastModifiedDate: item?.lastModifiedDate
            }
        });
        // console.log('ATTACHMENTS > POST > filesArr', filesArr)

        for await (const item of filesArr) {
            const filePath = `${dirAttachments}/${item.fileName}`;
            await pump(item.file.stream(), fs.createWriteStream(filePath));
        }

        let newFilesArr = JSON.parse(JSON.stringify(filesArr));
        newFilesArr.map((item) => {
            item.name = item.fileName;
            delete item['file'];
            delete item['fileName'];

            return item;
        })
        // console.log('ATTACHMENTS > POST > newFilesArr', newFilesArr)

        return NextResponse.json({
            status: 200,
            message: "Upload successful.",
            data: newFilesArr,
          }, { status: 200 });
    } catch (e) {
        return NextResponse.json({
            status: 500,
            message: "An unexpected error occured.",
        }, { status: 500 });
    }
}