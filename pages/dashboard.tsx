import Link from "next/link";
import { useSession } from "next-auth/react";
import clientPromise from "@/lib/db";
import { getSession } from "next-auth/react";
import RecipeCard from "@/components/RecipeCard";
import { useRouter } from "next/router";
import { useState } from "react";
import { NextPageContext } from "next";
import { RecipeArray, RecipeArraySchema } from "@/types/zod";

enum DisplayOrder {
  AtoZ,
  ZtoA,
  NumberOfIngredients,
  NumberOfInstructions,
  Default,
}

export default function Dashboard({
  propRecipes,
}: {
  propRecipes: RecipeArray;
}) {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(DisplayOrder.Default);
  const [recipes, setRecipes] = useState(propRecipes);
  const router = useRouter();

  let displayRecipes = [...recipes];

  if (search !== "") {
    displayRecipes = recipes.filter((recipe) => {
      return (
        recipe.title.includes(search) ||
        recipe.ingredients.find((ing) => ing.includes(search)) ||
        recipe.instructions.find((inst) => inst.includes(search))
      );
    });
  }
  if (order === DisplayOrder.AtoZ) {
    displayRecipes.sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    );
  } else if (order === DisplayOrder.ZtoA) {
    displayRecipes.sort((a, b) =>
      b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1
    );
  } else if (order === DisplayOrder.NumberOfIngredients) {
    displayRecipes.sort((a, b) =>
      a.ingredients.length > b.ingredients.length ? 1 : -1
    );
  } else if (order === DisplayOrder.NumberOfInstructions) {
    displayRecipes.sort((a, b) =>
      a.instructions.length > b.instructions.length ? 1 : -1
    );
  }

  const addStarterRecipes = async () => {
    const endpoint = "api/addStarterRecipes";

    const response = await fetch(endpoint);
    let starterRecipes = await response.json();

    setRecipes(starterRecipes);
  };

  const deleteRecipe = async (recipeId: string) => {
    setRecipes((state) => state.filter((item) => item.id !== recipeId));

    const endpoint = `/api/deleteRecipe/${recipeId}`;

    const response = await fetch(endpoint);

    const result = await response.json();

    router.asPath;
  };

  if (status === "loading") {
    return <h1></h1>;
  } else if (status === "authenticated") {
    return (
      <main className="h-full min-h-screen">
        <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-2">
          <div className="  rounded border-4 border-black flex flex-col content-between">
            <h1 className="mt-4 px-1 text-3xl font-bold text-center">
              Your Recipes
            </h1>
            <p className="text-sm mt-2 mb-2 px-4">
              Here are all the recipes you&lsquo;ve saved so far. Click on the
              card to see more.
            </p>
            <label className="border-y-2 w-full pl-2 bg-yellow-300 border-gray-400">
              Search recipes:{" "}
            </label>
            <input
              name="title"
              className="w-full border-gray-500 pl-2 border-b-2"
              placeholder="e.g. beans, other things"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Link
              href="/recipeForm"
              className="flex-none border-gray-500 border-b-2 w-full bg-purple text-center">
              Add new recipe
            </Link>
            <label className="flex-none border-b-2 border-gray-500 w-full bg-yellow-300 text-center">
              Order by
            </label>
            <div className="flex">
              <button
                className="flex-none border-b-2 border-r-2 border-gray-500 w-1/2 bg-purple text-center"
                type="button"
                onClick={() => setOrder(DisplayOrder.AtoZ)}>
                A-Z
              </button>
              <button
                className="flex-none border-b-2 border-gray-500 w-1/2 bg-purple text-center"
                type="button"
                onClick={() => setOrder(DisplayOrder.ZtoA)}>
                Z-A
              </button>
            </div>

            <button
              className="flex-none border-b-2 border-gray-500 w-full bg-purple text-center"
              type="button"
              onClick={() => setOrder(DisplayOrder.NumberOfIngredients)}>
              # of ingredients
            </button>
            <button
              className=" bg-purple text-center"
              type="button"
              onClick={() => setOrder(DisplayOrder.NumberOfInstructions)}>
              # of instructions
            </button>
          </div>

          <ul className="contents">
            {recipes.length > 0 ? (
              displayRecipes.map((recipe) => {
                return (
                  <li key={recipe.id}>
                    <RecipeCard
                      recipe={recipe}
                      onDelete={() => deleteRecipe(recipe.id)}
                    />
                  </li>
                );
              })
            ) : (
              <div className="flex flex-col h-full rounded border-4 border-black">
                <h3 className="text-2xl font-semibold pl-2 w-full overflow-hidden ">
                  It is looking a little empty in here...
                </h3>
                <button
                  className="mt-4 bg-purple font-bold"
                  type="button"
                  onClick={addStarterRecipes}>
                  Add starter recipes?
                </button>
              </div>
            )}
          </ul>
        </div>
      </main>
    );
  } else {
    return <h1>please sign in</h1>;
  }
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

  const client = await clientPromise;
  const db = client.db(`data`);

  const recipes = await db
    .collection(`${session?.user?.id}`)
    .find({})
    .toArray();

  const propRecipes = recipes.map((object) => {
    return {
      id: object._id.toString(),
      title: object.title,
      source: object.source,
      ingredients: object.ingredients,
      instructions: object.instructions,
    };
  });

  return {
    props: { propRecipes },
  };
}
