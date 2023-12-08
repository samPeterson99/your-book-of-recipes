import { getSession } from "next-auth/react";
import { string, z } from "zod";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { Recipe } from "@/types/zod";
import MongoDBClient from "@/lib/mongoDBClient";
import Dropzone from "react-dropzone";
import AmazonS3Client from "@/lib/amazonS3Client";
import IngredientForm from "@/components/IngredientForm";
import InstructionForm from "@/components/InstructionForm";
import ImageDropzone from "@/components/ImageDropzone";

export default function EditRecipe({ recipe }: { recipe: Recipe }) {
  const emptyArray: string[] = [];

  const [title, setTitle] = useState(recipe.title);
  const [source, setSource] = useState(recipe.source ? recipe.source : "");
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureError, setPictureError] = useState(false);
  const [instructions, setInstructions] = useState<string[]>(
    recipe.instructions
  );

  const [errors, setErrors] = useState(emptyArray);
  const router = useRouter();

  function fileToBlob(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;

        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: file.type });
          resolve(blob);
        } else {
          reject(new Error("Failed to read file as ArrayBuffer"));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  async function storeImage(): Promise<string | null> {
    return new Promise(async (resolve, reject) => {
      if (!pictureFile) {
        resolve(null);
      } else {
        try {
          const formData = new FormData();

          const fileType = pictureFile?.type;

          const fileBlob = await fileToBlob(pictureFile);
          formData.append("fileBlob", fileBlob);
          formData.append("fileType", fileType);
          console.log(fileBlob);

          const endpoint = "/api/aws/uploadImage";
          const options = {
            method: "POST",
            body: formData,
          };

          const response = await fetch(endpoint, options);
          const result = await response.json();
          console.log("store image:", result);

          if (response.ok) {
            resolve(result.key);
          } else {
            console.error("Your image did not upload. Please try again later.");
            reject(null);
          }
        } catch (error) {
          console.error(
            "An error occurred while uploading the image. Please try again later."
          );
          reject(null);
        }
      }
    });
  }

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
      let imageId;
      if (recipe.imageId) {
        imageId = recipe.imageId;
      } else {
        imageId = await storeImage();
      }

      console.log(imageId);

      const updatedRecipe: Recipe = {
        title: checkedTitle.data,
        source: source.trim(),
        ingredients: filteredIngredients as [string, ...string[]],
        instructions: checkedInstructions.data as [string, ...string[]],
        imageId: imageId,
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
      console.log(result);
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
          {/* TODO: make image deletable from edit page */}
          {recipe.imageUrl ? (
            <img
              className="h-60 w-60"
              src={recipe.imageUrl}
              alt=""
            />
          ) : (
            <ImageDropzone
              pictureFile={pictureFile}
              setPictureFile={setPictureFile}
              pictureError={pictureError}
              setPictureError={setPictureError}
            />
          )}
          <button
            className="flex-none border-2 mt-2 col-start-1 w-full bg-purple"
            type="submit">
            Submit changes
          </button>
        </div>
        <div className="pageRight">
          <IngredientForm
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
          <InstructionForm
            instructions={instructions}
            setInstructions={setInstructions}
          />
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  const client = MongoDBClient.getInstance();
  client.connect();
  const recipeId = `${context.query.id}`;

  const response = await client.getSingleRecipe(session?.user.id, recipeId);

  if (response) {
    let url = null;
    if (response.imageId) {
      const s3Client = AmazonS3Client.getInstance("yrrb");
      url = await s3Client.getUrl(session.user.id, response.imageId);
    }
    const recipe: Recipe = {
      id: response._id.toString(),
      title: response.title,
      source: response.source,
      ingredients: response.ingredients,
      instructions: response.instructions,
      imageId: response.imageId ? response.imageId : null,
      imageUrl: url,
    };

    return {
      props: {
        recipe,
      },
    };
  }
}
