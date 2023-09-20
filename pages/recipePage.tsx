import { getSession } from "next-auth/react";
import clientPromise from "@/lib/db";
import Link from "next/link";
import mongoose from "mongoose";
import { NextPageContext } from "next";
import { Recipe, SingleRecipeSchema } from "@/types/zod";

export default function RecipePage({ recipe }: { recipe: Recipe }) {
  return (
    <div className="pageContainer">
      <div className="page">
        <div className="pageLeft">
          <h1 className="labelLeft">Title: {recipe.title}</h1>
          {recipe.source && recipe.source.startsWith("http") ? (
            <h2 className="labelLeft">
              Source: <a href={recipe.source}>Link</a>
            </h2>
          ) : (
            <h2 className="labelLeft">Source: {recipe.source}</h2>
          )}
          <hr className="border-black my-4 w-full shadow col-start-1"></hr>
          <Link
            className="flex-none border-2 text-center col-start-1 w-1/2 bg-purple"
            href={{
              pathname: `/editRecipe`,
              query: {
                id: recipe.id,
              },
            }}>
            Edit Recipe
          </Link>
          <h3 className="iWord  mt-6">Ingredients</h3>
          <ul className="list-disc mx-4">
            {recipe.ingredients.map((item, index) => {
              return (
                <li
                  key={index}
                  className="listItem">
                  {item}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pageRight">
          <h3 className="iWord">Instructions</h3>
          <ul>
            {recipe.instructions.map((item, index) => {
              return (
                <li
                  className="listItem"
                  key={index}>
                  {index + 1}. {item}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  const client = await clientPromise;
  const db = client.db(`data`);

  const query = context?.query?.id as string;

  const _id = new mongoose.Types.ObjectId(query);

  const response = await db.collection(`${session?.user?.id}`).findOne({
    _id: _id,
  });

  if (response) {
    const recipe = SingleRecipeSchema.parse({
      id: response._id.toString(),
      title: response.title,
      source: response.source,
      ingredients: response.ingredients,
      instructions: response.instructions,
    });

    return {
      props: {
        recipe,
      },
    };
  }
}
