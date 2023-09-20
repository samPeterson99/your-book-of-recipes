import clientPromise from "@/lib/db";
import mongoose, { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  const client = await clientPromise;
  const db = client.db("data");

  const recipeId: string = req?.query?.id?.[0] ?? "";

  const o_id: Types.ObjectId = new mongoose.Types.ObjectId(recipeId);

  if (!req.query || !session) {
    return res.status(400).json({ data: "no request" });
  }

  const post = await db.collection(`${session.user.id}`).deleteOne({
    _id: o_id,
  });

  res.status(200).json(post);
}
