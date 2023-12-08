import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authOptions } from "../auth/[...nextauth]";
import formidable, { Fields, Files } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Session, getServerSession } from "next-auth";
import AmazonS3Client from "@/lib/amazonS3Client";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface FormData {
  error?: string;
  fields: Fields<string>;
  files: Files<string>;
}

export default async function awsUploader(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405);
  }

  const session: Session | null = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) return res.status(401);
  // const s3Client = new S3Client({});
  const s3Client = AmazonS3Client.getInstance("yrrb");

  const formData: FormData = await new Promise((resolve, reject) => {
    const form = formidable();

    form.parse(req, (error, fields, files) => {
      if (error) reject({ error });
      resolve({ error, fields, files });
    });
  });

  const { fields, files } = formData;

  if (!files || !fields || !files.fileBlob || !fields.fileType) {
    return res.status(400).json({ message: "Image not received by API" });
  }

  const picturePath = files.fileBlob[0].filepath;
  const pictureType = fields.fileType[0];

  if (pictureType !== "image/jpeg" && pictureType !== "image/png") {
    return res.status(400).json({ message: "Wrong file type" });
  }

  const userId: string = session.user.id;

  const uuid = uuidv4();
  const photoKey = uuid + (pictureType === "image/jpeg" ? ".jpeg" : ".png");

  const pictureBlob = fs.readFileSync(picturePath);

  // const command = new PutObjectCommand({
  //   Bucket: "yrrb",
  //   Key: `${userId}/${photoKey}`,
  //   ContentType: pictureType,
  //   Body: pictureBlob,
  // });

  try {
    const response = await s3Client.uploadFile(
      userId,
      photoKey,
      pictureType,
      pictureBlob
    );
    // const response = await s3Client.send(command);
    console.log(response);
    res.status(200).json({ key: photoKey });
  } catch (error) {
    console.error(error);
  }
}
