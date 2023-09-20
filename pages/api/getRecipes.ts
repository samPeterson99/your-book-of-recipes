import clientPromise from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { RecipeArraySchema } from "@/types/zod";
import { authOptions } from "./auth/[...nextauth]";

export default async function getRecipes(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const client = await clientPromise;
  const db = client.db(`data`);
  const userId: string | undefined = session?.user?.id;

  const recipes = await db.collection(`${userId}`).find({}).toArray();

  const returnRecipes = RecipeArraySchema.parse(recipes);
  res.json(returnRecipes);
}
