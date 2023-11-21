import clientPromise from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { SingleRecipeSchema } from "@/types/zod";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) return res.status(401);
  const client = await clientPromise;
  const db = client.db("data");

  const parseResult = SingleRecipeSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.log(parseResult.error);
    return res.status(400).json({ data: "Incomplete recipe" });
  } else {
    var body = parseResult.data;
  }

  let { title, source, ingredients, instructions, imageId } = body;

  const userId: string | undefined = session?.user?.id;

  const post = await db.collection(`${userId}`).insertOne({
    title,
    source,
    ingredients,
    instructions,
    imageId,
  });
  res.json(post);
}
