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
        const userName = formData.has('userName') ? formData.get('userName') : '';
        const attachments = formData.has('attachments') ? formData.getAll('attachments') : null;
        // console.log('ATTACHMENTS > POST > attachments', attachments)

        const attachmentsArr = attachments ? Array.from(attachments).map((item) => {
            return {
                file: item,
                fileName: `${userName}_${moment().format('MM-DD-YYYY')}_${item.name}`.replace(' ', ''),
                name: item?.name,
                type: item?.type, 
                size: item?.size, 
                lastModified: item?.lastModified, 
                // lastModifiedDate: item?.lastModifiedDate
            }
        }) : [];
        // console.log('ATTACHMENTS > POST > attachmentsArr', attachmentsArr)

        if(attachmentsArr.length > 0) {
            for await (const item of attachmentsArr) {
                const filePath = `${dirAttachments}/${item.fileName}`;
                await pump(item.file.stream(), fs.createWriteStream(filePath));
            }
    
            let newAttachmentsArr = JSON.parse(JSON.stringify(attachmentsArr));
            newAttachmentsArr.map((item) => {
                item.name = item.fileName;
                delete item['file'];
                delete item['fileName'];
    
                return item;
            })
            // console.log('ATTACHMENTS > POST > newAttachmentsArr', newAttachmentsArr)
    
            return NextResponse.json({
                status: 200,
                message: "Upload successful.",
                data: newAttachmentsArr,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                status: 400,
                message: "No attachment to upload.",
            }, { status: 400 });
        }
    } catch (e) {
        return NextResponse.json({
            status: 500,
            message: "An unexpected error occured.",
        }, { status: 500 });
    }
}