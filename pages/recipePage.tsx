import { getSession } from "next-auth/react";
import clientPromise from "@/lib/db";
import Link from "next/link";
import mongoose from "mongoose"
import { NextPageContext } from "next";


export default function RecipePage({ 
    recipe
 }: {
    recipe: {
        _id: string
        title: string
        source?: string
        ingredients: string[]
        instructions: string[]
    }
 }) {


    return (
        <div className="pageContainer">
        <div className="page">
        <div className="pageLeft">
            <h1 className="labelLeft">Title: {recipe.title}</h1>
            {recipe.source && recipe.source.startsWith('http') ?
            <h2 className="labelLeft">Source: <a href={recipe.source}>Link</a></h2> 
            : <h2 className="labelLeft">Source: {recipe.source}</h2>}
        <hr className="border-black my-4 w-full shadow col-start-1"></hr>
        <Link className="flex-none border-2 col-start-1 w-1/2 bg-purple"
             href={{
                pathname: `/editRecipe`,
                query: {
                    id: recipe._id
                }
            }}>Edit Recipe</Link>
        </div>

        <div className="pageRight">
            <h3 className="iWord">Ingredients</h3>
            <ul>
                {recipe.ingredients.map((item, index) => {
                   return <li key={index}
                            className="label">{item}</li>
                })}
            </ul>
            <h3 className="iWord mt-6">Instructions</h3>
            <ul>
                {recipe.instructions.map((item, index) => {
                   return <li className="label" key={index}>{(index + 1)}. {item}</li>
                })}
            </ul>

        </div>
        </div>
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    try{
        console.log( typeof context.query.id)
        const session = await getSession(context)
        const client = await clientPromise;
        const db = client.db(`data`)

        console.log(session)
        
        const query = context?.query?.id as string
        
        const _id = new mongoose.Types.ObjectId(query)

        const userId = session?.user?.id as string

        const recipes = await db.collection(`${session?.user?.id}`).findOne({
            _id: _id,
        })
        
      return { 
        props: { recipe: JSON.parse(JSON.stringify(recipes)) }
      }
    } catch (e) {
        console.log(e)
    }
  }