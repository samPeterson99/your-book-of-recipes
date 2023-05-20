import clientPromise from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function getRecipes(req: NextApiRequest, res: NextApiResponse) {
    
    try{
        //@ts-ignore
        const session = await getServerSession(req, res, authOptions)
        
        const client = await clientPromise;
        const db = client.db(`data`)
        const userId: string|undefined = session?.user?.id

        const recipes = await db.collection(`${userId}`).find({}).toArray()
        res.json(recipes)
    } catch (e) {
        console.log(e)
    }
}