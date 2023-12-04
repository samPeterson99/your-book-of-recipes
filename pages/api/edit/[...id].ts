import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "@/lib/db";
import mongoose from "mongoose";
import { SingleRecipeSchema } from "@/types/zod";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import MongoDBClient from "@/lib/mongoDBClient";

export default async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) return res.status(401);

  const client = MongoDBClient.getInstance();
  client.connect();

  const parseResult = SingleRecipeSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.log(parseResult.error);
    return res.status(400).json({ data: "Incomplete recipe" });
  } else {
    var recipeBody = parseResult.data;
  }

  const idCheck = z.string();
  const objectId = idCheck.parse(req?.query?.id?.[0]);

  const post = await client.updateOne(session.user.id, objectId, recipeBody);

  if (post.modifiedCount === 0) {
    return res.status(404).json({ message: "recipe not found" });
  }

  res.status(200).json(post);
}
