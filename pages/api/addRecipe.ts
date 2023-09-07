import clientPromise from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);

    const client = await clientPromise;
    const db = client.db("data");
    let { title, source, ingredients, instructions } = req.body;
    console.log(title);
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ data: "Incomplete recipe" });
    }

    console.log(title);
    console.log(source), console.log(ingredients);
    console.log(instructions);

    const userId: string | undefined = session?.user?.id;

    const post = await db.collection(`${userId}`).insertOne({
      title,
      source,
      ingredients,
      instructions,
    });
    res.json(post);
  } catch (error) {
    console.log(error);
  }
}
