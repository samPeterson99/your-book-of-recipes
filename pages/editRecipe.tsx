import { getSession } from "next-auth/react";
import clientPromise from "@/lib/db";
import { z } from "zod";
import {
  ExclamationTriangleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import mongoose from "mongoose";
import { NextPageContext } from "next";
import { Recipe } from "@/types/zod";

export default function EditRecipe({ recipe }: { recipe: Recipe }) {
  const emptyArray: string[] = [];

  const [title, setTitle] = useState(recipe.title);
  const [source, setSource] = useState(recipe.source ? recipe.source : "");
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
  const [instructions, setInstructions] = useState<string[]>(
    recipe.instructions
  );

  const [errors, setErrors] = useState(emptyArray);
  const router = useRouter();

  const handleIngredientChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...ingredients];
    data[index] = event.target.value;
    setIngredients(data);
  };

  const handleInstructionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    let data = [...instructions];
    data[index] = event.target.value;
    setInstructions(data);
  };

  //bring in line with recipeForm submit
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isString = z.string().trim().min(1);
    const isArray = z.string().array().min(1);

    let checkedTitle = isString.safeParse(title);

    let filteredIngredients = ingredients.filter((item) => item.length > 0);
    let filteredInstructions = instructions.filter((item) => item.length > 0);

    let checkedIngredients = isArray.safeParse(filteredIngredients);
    let checkedInstructions = isArray.safeParse(filteredInstructions);

    if (
      checkedTitle.success === true &&
      checkedIngredients.success === true &&
      checkedInstructions.success === true
    ) {
      const updatedRecipe = {
        title: checkedTitle.data,
        source: source.trim(),
        ingredients: checkedIngredients.data,
        instructions: checkedInstructions.data,
      };

      const JSONrecipe = JSON.stringify(updatedRecipe);
      const endpoint = `/api/edit/${recipe.id}`;
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSONrecipe,
      };

      const response = await fetch(endpoint, options);
      const result = await response.json();
      router.push({
        pathname: `/recipePage`,
        query: { id: recipe.id },
      });
    } else {
      let errorArray: string[] = [];

      if (checkedTitle.success === false) {
        errorArray.push("Please add a title");
      }

      if (checkedIngredients.success === false) {
        errorArray.push("Please add ingredients");
      }

      if (checkedInstructions.success === false) {
        errorArray.push("Please add instructions");
      }

      //set array to empty, if !errors
      setErrors(errorArray);
      if (errorArray.length) {
        return console.error(errorArray);
      }
    }
  };

  const addIngredient = () => {
    let data = [...ingredients];
    data.push("");
    setIngredients(data);
  };

  const addInstructionAbove = (index: number) => {
    let data = [...instructions];
    if (index === 0) {
      data.splice(0, 0, "");
    } else {
      data.splice(index, 0, "");
    }
    setInstructions(data);
  };

  const addInstructionBelow = (index: number) => {
    let data = [...instructions];
    if (index === instructions.length) {
      data.push("");
    } else {
      data.splice(index + 1, 0, "");
    }
    setInstructions(data);
  };

  const removeIngredientField = (index: number) => {
    let data = [...ingredients];
    data.splice(index, 1);
    setIngredients(data);
  };

  const removeInstructionField = (index: number) => {
    let data = [...instructions];
    data.splice(index, 1);
    setInstructions(data);
  };

  //add error checking
  return (
    <div className="pageContainer">
      <form
        className="page"
        onSubmit={submit}>
        <div className="pageLeft">
          <ul>
            {errors.map((error, index) => {
              return (
                <li
                  className="errorSign flex"
                  key={index}>
                  <p className="h-auto py-px px-2 mx-4">
                    <b>Error:</b> {error}
                  </p>
                </li>
              );
            })}
          </ul>
          <label className="labelLeft">Title: </label>
          <input
            name="title"
            type="text"
            className="inputBoxLeft w-10/12"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <label className="labelLeft">Source: </label>
          <input
            name="source"
            type="text"
            className="inputBoxLeft w-10/12"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
          <hr className="border-black my-4 w-full shadow col-start-1"></hr>
          <button
            className="flex-none border-2 col-start-1 w-1/2 bg-purple"
            type="submit">
            Submit changes
          </button>
        </div>
        <div className="pageRight">
          <h3 className="iWord">Ingredients</h3>
          {ingredients.map((form, index) => {
            return (
              <div
                className="flex flex-row my-1 items-center"
                key={index}>
                <input
                  className="ingredientBox"
                  name="ingredient"
                  value={form}
                  onChange={(event) => handleIngredientChange(event, index)}
                />
                <MinusCircleIcon
                  className="inputButton"
                  onClick={() => removeIngredientField(index)}
                />
              </div>
            );
          })}
          <PlusCircleIcon
            className="addButton"
            onClick={addIngredient}
          />
          <h3 className="iWord">Instructions</h3>
          {instructions.map((form, index) => {
            return (
              <div
                className="flex flex-row mt-1 place-items-center"
                key={index}>
                <h3 className="label">{index + 1}. </h3>
                <textarea
                  className="inputBox"
                  name="instruction"
                  rows={3}
                  value={form}
                  onChange={(event) => handleInstructionChange(event, index)}
                />
                <ArrowUpCircleIcon
                  className="inputButton"
                  type="button"
                  onClick={() => addInstructionAbove(index)}
                />
                <div className="add">ADD</div>
                <ArrowDownCircleIcon
                  className="inputButton"
                  onClick={() => addInstructionBelow(index)}
                />
                <MinusCircleIcon
                  className="inputButton"
                  onClick={() => removeInstructionField(index)}
                />
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  const client = await clientPromise;
  const db = client.db(`data`);
  const id = `${context.query.id}`;

  const o_id = new mongoose.Types.ObjectId(id);

  const response = await db.collection(`${session?.user?.id}`).findOne({
    _id: o_id,
  });

  if (response) {
    const recipe = {
      id: response._id.toString(),
      title: response.title,
      source: response.source,
      ingredients: response.ingredients,
      instructions: response.instructions,
    };

    return {
      props: {
        recipe,
      },
    };
  }
}

/*

*/
