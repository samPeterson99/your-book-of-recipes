import { getSession } from "next-auth/react";
import clientPromise from "@/lib/db";
import Link from "next/link";
import { ExclamationTriangleIcon, MinusCircleIcon, PlusCircleIcon , ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import React, { useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import mongoose from "mongoose";
import { NextPageContext } from "next";

export default function EditRecipe({ 
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
    const [title, setTitle] = useState(recipe.title)
    const [source, setSource] = useState(recipe.source ? recipe.source : '')
    const [ingredients, setIngredients] = useState(recipe.ingredients)
    const [instructions, setInstructions] = useState(recipe.instructions)
    const router = useRouter()
    console.log(source)
    const id = recipe._id
    
    const handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let data = [...ingredients]
        data[index] = event.target.value
        setIngredients(data)
    }

    const handleInstructionChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let data = [...instructions]
        data[index] = event.target.value
        setInstructions(data)
    }

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let copiedIngredients: string[] = ingredients.filter(item => item.length > 0)
        let copiedInstructions: string[] = instructions.filter(item => item.length > 0)
        
        const recipeObject = {
            title: title,
            source: source,
            ingredients: copiedIngredients,
            instructions: copiedInstructions
        }

        const JSONrecipe= JSON.stringify(recipeObject)
        const endpoint = `/api/edit/${id}`
        const options = {
            method: 'PUT',
            headers:{
                'Content-Type': `application/json`
            },
            body: JSONrecipe
        }

        const response = await fetch(endpoint, options)
        const result = await response.json()
        router.push(`/recipePage/${id}`)
    }

    const addIngredient = () => {
        let data = [...ingredients]
        data.push('')
        setIngredients(data)
    }

    const addInstructionAbove = (index: number) => {
        let data = [...instructions]
        if (index === 0) {
            data.splice(0, 0, '')
        } else {
            data.splice(index, 0, '')
        }
        setInstructions(data)
    }

    const addInstructionBelow = (index: number) => {
        let data = [...instructions]
        if (index === instructions.length) {
            data.push('')
        } else {
            data.splice(index + 1, 0, '')
        }
        setInstructions(data)
    }

    const removeIngredientField = (index: number) => {
        let data = [...ingredients];
        data.splice(index, 1)
        setIngredients(data)
    }

    const removeInstructionField = (index: number) => {
        let data = [...instructions];
        data.splice(index, 1)
        setInstructions(data)
    }

    //add error checking
    return (
        <div className="pageContainer">
            <form className="page" onSubmit={submit}>

            <div className="pageLeft">
            <label className="labelLeft">Title: </label>
                <input name="title"
                className="inputBoxLeft w-10/12"
                value={title}
                onChange={event => setTitle(event.target.value)}/>
            <label className="labelLeft">Source: </label>
                <input name="source"
                className="inputBoxLeft w-10/12"
                value={source}
                onChange={event => setSource(event.target.value)}/>
            <hr className="border-black my-4 w-full shadow col-start-1"></hr>
            <button className="flex-none border-2 col-start-1 w-1/2 bg-purple"  type="submit">Submit changes</button>

            </div>
            <div className="pageRight">
            <h3 className="iWord">Ingredients</h3>
                {ingredients.map((form, index) => {
                    return (
                        <div className="flex flex-row my-1 items-center" key={index}>
                            <input
                                className="inputBox"
                                name='ingredient'
                                value={form}
                                onChange={event => handleIngredientChange(event, index)}
                            />
                            <MinusCircleIcon className="inputButton"
                                            onClick={()=> removeIngredientField(index)} />
                        </div>
                    )
                })}
                                <PlusCircleIcon className="addButton" onClick={addIngredient} />
            <h3 className="iWord">Instructions</h3>
                {instructions.map((form, index) => {
                    return (
                        <div className="flex flex-row mt-4" key={index}>
                            <h3 className="label">{index + 1}. </h3>
                            <input
                                className="inputBox"
                                name="instruction"
                                value={form}
                                onChange={event => handleInstructionChange(event, index)} />
                            <ArrowUpCircleIcon className="inputButton" type="button" onClick={()=> addInstructionAbove(index)}/>
                            <button className="add">ADD</button>
                            <ArrowDownCircleIcon className="inputButton" onClick={()=> addInstructionBelow(index)} />
                            <MinusCircleIcon className="inputButton" onClick={()=> removeInstructionField(index)} />
                        </div>
                    )
                })}
            </div>
            </form>
        </div>
    )
}

export async function getServerSideProps(context: NextPageContext) {
    try{
        const session = await getSession(context)
        const client = await clientPromise;
        const db = client.db(`data`)
        const id = `${context.query.id}`

        const o_id = new mongoose.Types.ObjectId(id)

  
        const recipe = await db.collection(`${session?.user?.id}`).findOne({
            _id: o_id
        })

      return { 
        props: { recipe: JSON.parse(JSON.stringify(recipe)) }
      }
    } catch (e) {
        console.log(e)
    }
}

/*

*/

