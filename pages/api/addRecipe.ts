import clientPromise from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler( req: NextApiRequest, res: NextApiResponse) {


    try {
        //@ts-ignore
        const session = await getServerSession(req, res, authOptions);
        
        const client = await clientPromise
        const db = client.db("data")
        const {title, source, ingredients, instructions }= req.body
        console.log(title)
        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ data: 'Incomplete recipe'})
        } 

        const userId: string = session?.user?.id

        const post = await db.collection(`${userId}`).insertOne({
            title,
            source,
            ingredients,
            instructions
        })
        res.json(post)
    } catch (error) {
        console.log(error)
    }
}