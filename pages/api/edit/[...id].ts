import { getServerSession, getSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import clientPromise from "@/lib/db"
import mongoose from "mongoose"
import { useRouter } from "next/router";
import { NextApiRequest, NextApiResponse } from "next";

export default async function updateHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // @ts-ignore
        const session = await getServerSession(req, res, authOptions)
        const client = await clientPromise;
        const db = client.db("data");
        const { title, source, ingredients, instructions } = req.body
        const _id = new mongoose.Types.ObjectId(req.query.id[0])

        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ data: "Incomplete recipe"})
        }

        const post = await db.collection(`${session.user.id}`).updateOne(
            {
                _id: _id,
            },
            {
                $set: {
                    title: title,
                    source: source,
                    ingredients: ingredients,
                    instructions: instructions
                }
            }
        )

        if (post.modifiedCount === 0) {
            return res.status(404).json({ message: "recipe not found"})
        }
        console.log(post)
        res.json(post)
    } catch (error) {
        console.log(error)
    }
}