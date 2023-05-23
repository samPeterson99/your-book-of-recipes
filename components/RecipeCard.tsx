import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState } from "react";

const RecipeCard = ({
  recipe,
}: {
  recipe: {
    _id: string;
    title: string;
    source?: string;
    ingredients: string[];
    instructions: string[];
  };
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const link: string = `/recipePage`;

  const ingredientPreview: string[] = recipe.ingredients.slice(0, 3);
  const ingredientLength: number = recipe.ingredients.length;

  async function deleteRecipe(recipeId: string) {
    setShowModal(false);
    const endpoint: string = `/api/deleteRecipe/${recipeId}`;

    //need to figure out type
    const response = await fetch(endpoint);

    const result: [] = await response.json();
    router.push("/dashboard");
  }

  if (showModal) {
    return (
      <div className="h-full w-full z-50">
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              <p className="w-48 px-2 py-4 text-center self-center">
                <em className="text-red-500">Are you sure</em> you want do
                delete this recipe? Once it is deleted, it is gone for good
                &#40;at least from here&#41;{" "}
              </p>
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-black background-transparent font-bold uppercase px-6 py-2 text-sm  mr-1 mb-1"
                  type="button"
                  onClick={() => setShowModal(false)}>
                  Nevermind
                </button>
                <button
                  className="text-white bg-darkGreen font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowModal(false)}>
                  Yup!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contents">
      <div className="flex flex-col h-full bg-cream rounded border-4 border-black justify-between">
        <XMarkIcon
          className="z-25 stroke-2 text-cream font-bold  bg-black  p-1 h-8 self-end"
          onClick={() => setShowModal(true)}
        />
        <h3 className="text-2xl">{recipe.title}</h3>
        <ul className="h-1/2 list-disc">
          {ingredientPreview.map((form, index) => {
            return (
              <li
                key={index}
                className="text-sm ml-8">
                {form},
              </li>
            );
          })}
          {ingredientLength === 4 && (
            <p className="text-sm ml-4">and 1 more ingredient</p>
          )}
          {recipe.ingredients.length > 4 && (
            <p className="text-sm ml-4">
              and {recipe.ingredients.length - 3} more ingredients
            </p>
          )}
        </ul>

        <Link
          href={{
            pathname: link,
            query: {
              id: recipe._id,
            },
          }}
          className="border-y-2 w-full bg-purple border-gray-400">
          Click for recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
