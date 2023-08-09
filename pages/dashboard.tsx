import Link from "next/link";
import styles from "@/styles/Home.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import clientPromise from "@/lib/db";
import { getSession } from "next-auth/react";
import RecipeCard from "@/components/RecipeCard";
import { useRouter } from "next/router";
import { redirect } from "next/dist/server/api-utils";
import { useState } from "react";
import { NextPageContext } from "next";

export default function Dashboard({
  recipes,
}: {
  recipes: {
    _id: string;
    title: string;
    source?: string;
    ingredients: string[];
    instructions: string[];
  }[];
}) {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const router = useRouter();

  if (search !== "") {
    recipes = recipes.filter((recipe) => {
      return (
        recipe.title.includes(search) ||
        recipe.ingredients.find((ing) => ing.includes(search)) ||
        recipe.instructions.find((inst) => inst.includes(search))
      );
    });
  }
  console.log(order);
  if (order === "AZ") {
    recipes.sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
    );
  } else if (order === "ZA") {
    recipes.sort((a, b) =>
      b.title.toLowerCase() > a.title.toLowerCase() ? 1 : -1
    );
  } else if (order === "ing") {
    recipes.sort((a, b) =>
      a.ingredients.length > b.ingredients.length ? 1 : -1
    );
  } else if (order === "inst") {
    recipes.sort((a, b) =>
      a.instructions.length > b.instructions.length ? 1 : -1
    );
  }

  console.log(recipes);

  async function deleteRecipe(recipeId: string) {
    recipes = recipes.filter((item) => item._id !== recipeId);

    const endpoint = `/api/deleteRecipe/${recipeId}`;

    const response = await fetch(endpoint);

    const result = await response.json();
    console.log(router);
    router.asPath;
  }

  //move delete button to card

  if (status === "loading") {
    return <h1>loading</h1>;
  } else if (status === "authenticated") {
    return (
      <main className="h-full min-h-screen">
        <div className=" grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-2">
          <div className="  rounded border-4 border-black flex flex-col content-between">
            <h1 className="mt-4 px-1 text-3xl font-bold">Your Recipes</h1>
            <p className="text-sm mt-2 mb-2 px-2">
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
                onClick={() => setOrder("AZ")}>
                A-Z
              </button>
              <button
                className="flex-none border-b-2 border-gray-500 w-1/2 bg-purple text-center"
                type="button"
                onClick={() => setOrder("ZA")}>
                Z-A
              </button>
            </div>

            <button
              className="flex-none border-b-2 border-gray-500 w-full bg-purple text-center"
              type="button"
              onClick={() => setOrder("ing")}>
              # of ingredients
            </button>
            <button
              className=" bg-purple text-center"
              type="button"
              onClick={() => setOrder("inst")}>
              # of instructions
            </button>
          </div>

          <ul className="contents">
            {recipes.map((recipe) => {
              return (
                <li key={recipe._id}>
                  <RecipeCard recipe={recipe} />
                </li>
              );
            })}
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

  try {
    const client = await clientPromise;
    const db = client.db(`data`);

    console.log(session);

    const recipes = await db
      .collection(`${session?.user?.id}`)
      .find({})
      .toArray();

    return {
      props: { recipes: JSON.parse(JSON.stringify(recipes)) },
    };
  } catch (e) {
    console.log(e);
  }
}
