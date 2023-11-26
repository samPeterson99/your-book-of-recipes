import clientPromise from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { SingleRecipeSchema } from "@/types/zod";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req.body);
  const parseResult = SingleRecipeSchema.safeParse(req.body);
  if (!parseResult.success) {
    console.log("error");
    return res.status(400).json({ data: "Incomplete recipe" });
  } else {
    var body = parseResult.data;
  }

  const session = await getServerSession(req, res, authOptions);
  const client = await clientPromise;
  const db = client.db("data");

  let { title, source, ingredients, instructions } = body;

  const userId: string | undefined = session?.user?.id;

  const post = await db.collection(`${userId}`).insertOne({
    title,
    source,
    ingredients,
    instructions,
  });
  res.json(post);
}
