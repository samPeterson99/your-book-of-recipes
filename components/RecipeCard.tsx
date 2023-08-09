import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState } from "react";

const RecipeCard = ({
  recipe,
  onDelete,
}: {
  recipe: {
    _id: string;
    title: string;
    source?: string;
    ingredients: string[];
    instructions: string[];
  };
  onDelete: () => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const link: string = `/recipePage`;

  const ingredientPreview: string[] = recipe.ingredients.slice(0, 3);
  const ingredientLength: number = recipe.ingredients.length;

  return (
    <div className="contents">
      <div className="flex flex-col h-full rounded border-4 border-black justify-between cursor-pointer">
        {showModal ? (
          <div className="flex flex-row">
            <div className="flex flex-col w-1/2">
              <em>Delete?</em>
              <p>Are you sure?</p>
            </div>
            <button
              type="button"
              className="bg-green w-1/4"
              onClick={() => {
                onDelete();
              }}>
              Y
            </button>
            <button
              type="button"
              className="bg-red-400 w-1/4"
              onClick={() => setShowModal(false)}>
              N
            </button>
          </div>
        ) : (
          <XMarkIcon
            className="z-25 stroke-2 text-cream font-bold  bg-black  p-1 h-8 self-end"
            onClick={() => setShowModal(true)}
          />
        )}

        <h3 className="text-2xl font-semibold pl-2 w-full overflow-hidden ">
          {recipe.title}
        </h3>
        <ul className=" mb-4 h-1/2 list-disc">
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
          className="border-y-2 w-full bg-yellow-300 pl-2 border-gray-400">
          Click for recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
