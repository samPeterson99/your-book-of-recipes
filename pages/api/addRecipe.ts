import clientPromise from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { SingleRecipeSchema } from "@/types/zod";
import { NextApiRequest, NextApiResponse } from "next";
import MongoDBClient from "@/lib/mongoDBClient";

export default async function handler(
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

  const userId: string = session.user.id;
  const post = client.insertOne(userId, recipeBody);

  res.json(post);
}
