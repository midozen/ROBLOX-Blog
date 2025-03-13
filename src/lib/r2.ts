import S3 from "aws-sdk/clients/s3.js";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3({
    endpoint: `https://${import.meta.env.R2_ACCOUNTID}.r2.cloudflarestorage.com`,
    accessKeyId: `${import.meta.env.R2_ACCESS_KEY_ID}`,
    secretAccessKey: `${import.meta.env.R2_SECRET_ACCESS_KEY}`,
    signatureVersion: "v4",
});

export async function uploadProfilePicture(image: File, fileName?: string | null): Promise<string> {

    console.log(import.meta.env.R2_ACCOUNTID);

    const buffer = await image.arrayBuffer();
    const resizedImage = await sharp(Buffer.from(buffer))
        .resize(152, 152)
        .png()
        .toBuffer();

    const key = fileName ? `${fileName}.png` : `${uuidv4()}.png`;

    const params = {
        Bucket: `${import.meta.env.R2_BUCKET_NAME}`,
        Key: `images/pfp/${key}`,
        Body: resizedImage,
        ContentType: "image/png",
    };

    await s3.upload(params).promise();

    return key;
}

export async function deleteProfilePicture(fileName: string): Promise<void> {
    const params = {
        Bucket: `${import.meta.env.R2_BUCKET_NAME}`,
        Key: `images/pfp/${fileName}`,
    };

    await s3.deleteObject(params).promise();
}

export async function uploadAttachment(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const params = {
        Bucket: `${import.meta.env.R2_BUCKET_NAME}`,
        Key: uuidv4(),
        Body: Buffer.from(buffer),
        ContentType: file.type,
    };

    await s3.upload(params).promise();

    return params.Key;
}