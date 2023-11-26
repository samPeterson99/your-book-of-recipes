import { getSession } from "next-auth/react";
import clientPromise from "@/lib/db";
import Link from "next/link";
import mongoose from "mongoose";
import { NextPageContext } from "next";
import { Recipe } from "@/types/zod";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
          <img
            className="h-80 w-80"
            src={recipe.imageUrl}
            alt=""
          />
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

  const userId = session?.user?.id;

  const response = await db.collection(`${session?.user?.id}`).findOne({
    _id: _id,
  });

  if (response) {
    let url;
    console.log(response.imageId);
    if (response.imageId) {
      const s3Client = new S3Client({});

      const command = new GetObjectCommand({
        Bucket: "yrrb",
        Key: `${userId}/${response.imageId}`,
      });

      url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log(url);
    }

    const recipe = {
      id: response._id.toString(),
      title: response.title,
      source: response.source,
      ingredients: response.ingredients,
      instructions: response.instructions,
      imageId: response.imageId,
      imageUrl: url,
    };

    return {
      props: {
        recipe,
      },
    };
  }
}
