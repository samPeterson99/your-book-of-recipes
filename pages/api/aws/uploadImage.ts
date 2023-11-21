import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authOptions } from "../auth/[...nextauth]";
import formidable, { Fields, Files } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { Session, getServerSession } from "next-auth";

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
    res.status(405).json({ success: false });
  }

  const session: Session | null = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401);
  const s3Client = new S3Client({});

  const formData: FormData = await new Promise((resolve, reject) => {
    const form = formidable();

    form.parse(req, (error, fields, files) => {
      if (error) reject({ error });
      resolve({ error, fields, files });
    });
  });

  const { error, fields, files } = formData;

  if (!files || !fields || !files.fileBlob || !fields.fileType) {
    return res.status(400).json({ success: false });
  }
  const picturePath = files.fileBlob[0].filepath;
  const pictureType = fields.fileType[0];

  console.log(pictureType);
  const userId: string | undefined = session?.user?.id;

  const uuid = uuidv4();
  const photoKey = uuid + (pictureType === "image/jpeg" ? ".jpeg" : ".png");

  const pictureBlob = fs.readFileSync(picturePath);

  console.log(pictureBlob);

  const command = new PutObjectCommand({
    Bucket: "yrrb",
    Key: `${userId}/${photoKey}`,
    ContentType: pictureType,
    Body: pictureBlob,
  });

  console.log(photoKey);
  try {
    const response = await s3Client.send(command);
    console.log(response);
    res.status(200).json({ key: photoKey });
  } catch (error) {
    console.error(error);
  }
}
