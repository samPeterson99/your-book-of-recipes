import clientPromise from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { RecipeArraySchema } from "@/types/zod";
import { authOptions } from "./auth/[...nextauth]";
import MongoDBClient from "@/lib/mongoDBClient";

export default async function getRecipes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) return res.status(401);

  const client = MongoDBClient.getInstance();
  client.connect();

  const userId: string = session.user.id;

  const recipes = await client.getRecipes(userId);

  const returnRecipes = RecipeArraySchema.parse(recipes);
  res.json(returnRecipes);
}
