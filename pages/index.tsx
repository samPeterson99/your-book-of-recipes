import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";

enum PageState {
  unused,
  error,
  loading,
  used,
}

export default function Home() {
  const { data: session, status } = useSession();
  const [link, setLink] = useState("");
  const [pageState, setPageState] = useState(PageState.unused);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const router = useRouter();

  const validateLinkAndFetch = () => {
    const isUrl = z.string().url().safeParse(link);

    if (!isUrl.success) {
      return setPageState(PageState.error);
    }

    getRecipe();
  };

  const getRecipe = async () => {
    setPageState(PageState.loading);

    const object = {
      link: link,
    };

    const json = JSON.stringify(object);

    const endpoint = "/api/getRecipeFromURL";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    };

    try {
      const response = await fetch(endpoint, options);
      const result = await response.json();
      console.log("fetch");
      if (response.status === 200) {
        setIngredients(result.ingredients);
        setInstructions(result.instructions);
        setPageState(PageState.used);
      }
    } catch (e) {
      console.error(e);
      setPageState(PageState.error);
    }
  };

  return (
    <main className="flex flex-col items-center h-full lg:max-w-4xl lg:mx-auto xl:max-w-4xl xl:mx-auto sm:overflow-hidden">
      <h1 className="mt-10 text-4xl sm:text-2xl font-bold">
        Skip the story. Get the recipe.
      </h1>
      <section>
        <br />
        <div className="dotted-background flex flex-row">
          <div className="mt-6 md:ml-24 sm:ml-10 h-5/6 w-2/3 p-4 pl-10 sm:pl-4 bg-purple z-50">
            <p>
              {" "}
              Just copy and paste the URL of the recipe into the box, click
              &lsquo;Scrape Recipe&lsquo;, and save yourself some scrolling.
            </p>
          </div>
          <div className="w-2/3 p-6 mt-36 md:mr-24 sm:mr-10 -ml-2 bg-yellow-300">
            <p>
              When you sign in to Your Book of Recipes, you can start saving
              these recipes.
            </p>
          </div>
        </div>
        <br />
        {/* <br />
        <div className="dotted-background flex flex-row">
          <div className="mt-6 ml-24 h-5/6 w-1/2 p-8 bg-purple">
            <p>
              Google is the biggest recipe book of all time, but it can be hard
              to find quality amidst the quantity.
            </p>
          </div>
          <div className="w-1/2 p-8 mt-28 mr-24 -ml-8 bg-yellow-300">
            <p>
              Your Book of Recipes is a site to store your favorites. You can
              even spare yourself the typing. Try out the &quot;Get Recipe&quot;
              feature below.
            </p>
          </div>
        </div>
        <br /> */}
      </section>

      <div className="flex flex-col mt-4 w-full items-center">
        <div className="flex flex-row md:w-1/2 sm:w-4/5">
          <label
            htmlFor="link"
            className="labelLeft justify-self-start p-1 leading-7">
            URL:
          </label>
          <input
            className="inputBoxLeft w-full p-1"
            name="link"
            id="link"
            type="text"
            onChange={(event) => setLink(event.target.value)}
          />
        </div>
        <div className="md:w-1/2 sm:w-4/5">
          {pageState === PageState.unused && (
            <button
              className="w-full border-2 border-black bg-purple"
              type="button"
              onClick={validateLinkAndFetch}>
              Scrape Recipe
            </button>
          )}
          {pageState === PageState.loading && (
            <button
              className=" cursor-wait w-full border-2 border-gray-500 bg-white"
              type="button">
              Loading...
            </button>
          )}
          {pageState === PageState.error && (
            <button
              className=" cursor-wait w-full border-2 border-gray-500 bg-red-100"
              type="button">
              This is not a valid recipe link. <br></br> Refresh the page to try
              again.
            </button>
          )}
          {pageState === PageState.used && (
            <div className="flex flex-row mt-2 justify-center">
              <Link
                href={session && session.user ? "/dashboard" : "/signin"}
                className="cursor-pointer text-center py-px px-2 w-1/2 border-black border-2 bg-yellow-300 -mx-1"
                type="button">
                Sign in to start saving recipes
              </Link>
              <p className="w-10 text-center pt-3 -mx-1">or</p>
              <Link
                href="/recipeScraper"
                className="cursor-pointer text-center py-px px-2 w-1/2  border-black border-2  bg-yellow-300 -mx-1"
                type="button">
                Go to the Recipe Scraper page
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-10 sm:mt-4">
        <div className="page">
          {ingredients.length > 0 && (
            <div className="pageLeft md:mb-10 sm:mb-4">
              <h4 className="text-center bg-yellow-300 text-2xl">
                ingredients
              </h4>
              <ul className="pb-4 h-full px-6 bg-yellow-300 list-disc ">
                {ingredients.length > 0 &&
                  ingredients.map((content, index) => {
                    return <li key={index}>{content}</li>;
                  })}
              </ul>
            </div>
          )}
          {ingredients.length > 0 && (
            <div className="pageRight mb-10">
              <ol className="px-6 border-2 bg-purple  list-decimal">
                {instructions.length > 0 && (
                  <h4 className="text-center bg-purple text-2xl">
                    instructions
                  </h4>
                )}
                {instructions.length > 0 &&
                  instructions.map((content, index) => {
                    return <li key={index}>{content}</li>;
                  })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
