import clientPromise from "@/lib/db";
import mongoose, { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";
import { Recipe } from "@/types/zod";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import MongoDBClient from "@/lib/mongoDBClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user.id) return res.status(401);
  if (req.method !== "DELETE") return res.status(405);

  const s3Client = new S3Client({});
  // const mongoClient = await clientPromise;
  // const db = mongoClient.db("data");

  const client = MongoDBClient.getInstance();
  client.connect();

  const idCheck = z.string();
  const recipeId = idCheck.parse(req?.query?.id?.[0]);

  const deletion = await client.deleteOne(session.user.id, recipeId);

  if (deletion.ok && deletion.value && deletion.value.imageId) {
    //if this post has an image, delete it
    const command = new DeleteObjectCommand({
      Bucket: "yrrb",
      Key: `${session.user.id}/${deletion.value.imageId}`,
    });

    try {
      const response = await s3Client.send(command);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  res.status(200);
}
