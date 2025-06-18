import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const bucketName = import.meta.env.VITE_S3_BUCKET;
const region = import.meta.env.VITE_S3_REGION;

const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  },
});

export const UploadImageOnAWS = async (file: File) => {
  if (!file) return { error: "Please select file" };
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);
  const key = `uploads/${file.name}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    return { url: fileUrl };
  } catch (error) {
    console.log("Upload error:", error);
    return { error };
  }
};
