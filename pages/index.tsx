import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [link, setLink] = useState("");
  const [pageState, setPageState] = useState("unused");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const router = useRouter();

  if (session && session.user) {
    router.push("/dashboard");
  }

  const getRecipe = async () => {
    console.log(link);
    if (link !== "") {
      setPageState("loading");
      try {
        let url;
        try {
          url = new URL(link);
        } catch (e) {
          console.log("error");
          setPageState("error");
        }

        const object = {
          link: link,
        };

        const json = JSON.stringify(object);
        console.log(json);
        const endpoint = "/api/getRecipeFromURL";
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: json,
        };

        const response = await fetch(endpoint, options);
        console.log("fetch");
        const result = await response.json();
        console.log(result);
        if (response.status === 200) {
          setPageState("used");
          setIngredients(result.ingredients);
          setInstructions(result.instructions);
        } else {
          throw new Error("No recipe found");
        }
      } catch (e) {
        setPageState("error");
        console.error(e);
      }
    }
  };

  return (
    <main className="flex flex-col items-center">
      <h1 className="mt-20 text-4xl font-bold">
        Welcome to Your Book of Recipes
      </h1>
      <section>
        <br />
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
        <br />
      </section>

      <div className="flex flex-col mt-10">
        <h3 className="text-2xl font-semibold self-center">
          Try out the Get Recipe function
        </h3>
        <div className="flex flex-row w-full self-center">
          <label
            htmlFor="link"
            className="labelLeft justify-self-start p-1 leading-7">
            Link:
          </label>
          <input
            className="inputBoxLeft w-full p-1"
            name="link"
            id="link"
            type="text"
            onChange={(event) => setLink(event.target.value)}
          />
        </div>
        {pageState === "unused" && (
          <button
            className="flex-none w-1/2 self-center border-2 col-start-1 mb-2 bg-purple"
            type="button"
            onClick={getRecipe}>
            Get recipe from link
          </button>
        )}
        {pageState === "loading" && (
          <button
            className=" cursor-wait flex-none w-1/2 self-center border-2 col-start-1 mb-2 bg-white"
            type="button">
            Loading...
          </button>
        )}
        {pageState === "error" && (
          <button
            className=" cursor-wait flex-none w-3/5 self-center border-2 col-start-1 mb-2 bg-white"
            type="button">
            This is not a valid link. <br></br> Refresh the page to try again.
          </button>
        )}
        {pageState === "used" && (
          <button
            className="cursor-auto flex-none w-1/2 self-center border-2 col-start-1 mb-2 border-black bg-yellow-300"
            type="button">
            Sign in to start saving recipes
          </button>
        )}
      </div>
      <div className="flex flex-col mt-10">
        <div className="page">
          <div className="pageLeft mb-10">
            <ul className=" h-full px-6 list-disc bg-yellow-300">
              {ingredients.length > 0 &&
                ingredients.map((content, index) => {
                  return <li key={index}>{content}</li>;
                })}
            </ul>
          </div>
          <div className="pageRight mb-10">
            <ol className="px-6 bg-purple list-decimal">
              {instructions.length > 0 &&
                instructions.map((content, index) => {
                  return <li key={index}>{content}</li>;
                })}
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
