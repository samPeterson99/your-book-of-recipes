import { z } from "zod";
import { useState } from "react";
import Link from "next/link";

//need a h1 on this page
export default function RecipeScraper() {
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [link, setLink] = useState("");

  const [warning, setWarning] = useState("");

  const validateLinkAndFetch = () => {
    const isUrl = z.string().url().safeParse(link);

    if (!isUrl.success) {
      return setWarning(
        "This is not a valid link. Make sure to copy the whole URL."
      );
    }

    getRecipe();
  };

  const getRecipe = async () => {
    setWarning("This may take a minute...");

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

    try {
      const response = await fetch(endpoint, options);
      const result = await response.json();
      console.log("fetch");
      if (response.status === 200) {
        setTitle("");
        setSource(result.source);
        setIngredients(result.ingredients);
        setInstructions(result.instructions);
        setWarning("");
      }
    } catch (e) {
      console.error(e);
      setWarning("Unable to find recipe. Try a different link.");
    }
  };

  return (
    <div className="pageContainer">
      <div className="page">
        <div className="pageLeft">
          <ul>
            {warning !== "" && (
              <li className="warningSign flex">
                <p className="h-auto  px-4 mx-4">{warning}</p>
              </li>
            )}
          </ul>

          <h1 className="labelLeft">URL:</h1>
          <input
            className="inputBoxLeft w-10/12"
            name="link"
            type="text"
            onChange={(event) => setLink(event.target.value)}
          />
          <button
            className="border-2 col-start-1 w-10/12 my-1 bg-purple"
            type="button"
            onClick={validateLinkAndFetch}>
            Get recipe from link
          </button>
          {}
          <Link
            href="/signin"
            className="cursor-pointer text-center border-2 col-start-1 w-10/12 mb-2 bg-yellow-300 text-sm"
            type="button">
            Sign in to start saving recipes
          </Link>

          {source !== "" && (
            <div className="labelLeft">
              <hr className="border-black my-1 w-full shadow col-start-1"></hr>
              <a href={source}>Link to Source</a>
              <hr className="border-black my-1 w-full shadow col-start-1"></hr>
            </div>
          )}
          <h3 className="iWord px-2 mt-2">Ingredients</h3>
          <ul className="list-disc mx-4 px-4">
            {ingredients.map((item, index) => {
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
            {instructions.map((item, index) => {
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
