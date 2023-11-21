import clientPromise from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { RecipeArraySchema } from "@/types/zod";
import { authOptions } from "../auth/[...nextauth]";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export default async function fromS3(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  console.log("hi");

  const s3Client = new S3Client({});

  const pictureFile = req.body;
  const command = new GetObjectCommand({
    Bucket: "yrrb",
    Key: "113.txt",
  });

  try {
    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    console.log(str);
    console.log(response);
    res.json(response);
  } catch (err) {
    console.error(err);
  }
}
