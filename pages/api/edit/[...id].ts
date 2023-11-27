import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "@/lib/db";
import mongoose from "mongoose";
import { SingleRecipeSchema } from "@/types/zod";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user.id) return res.status(401)

  const client = await clientPromise;
  const db = client.db("data");

  const parseResult = SingleRecipeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ data: "Incomplete recipe" });
  } else {
    var requestBody = parseResult.data;
  }

  const idCheck = z.string();
  const recipeId = idCheck.parse(req?.query?.id?.[0]);

  const { title, source, ingredients, instructions } = requestBody;
  const o_id = new mongoose.Types.ObjectId(recipeId);

  const post = await db.collection(`${session.user.id}`).updateOne(
    {
      _id: o_id,
    },
    {
      $set: {
        title: title,
        source: source,
        ingredients: ingredients,
        instructions: instructions,
      },
    }
  );

  if (post.modifiedCount === 0) {
    return res.status(404).json({ message: "recipe not found" });
  }

  res.status(200).json(post);
}
