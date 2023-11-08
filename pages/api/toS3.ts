import clientPromise from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { RecipeArraySchema } from "@/types/zod";
import { authOptions } from "./auth/[...nextauth]";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export default async function getRecipes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const s3Client = new S3Client({});

  const command = new GetObjectCommand({
    Bucket: "yrrb",
    Key: "hello",
  });

  try {
    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    console.log(response);
    console.log(str);
  } catch (err) {
    console.error(err);
  }
}
