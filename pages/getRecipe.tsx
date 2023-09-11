import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function RecipePage() {
  const blankArray = ["", "", "", "", ""];
  const emptyArray: string[] = [];

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [ingredients, setIngredients] = useState(blankArray);
  const [instructions, setInstructions] = useState(blankArray);
  const [link, setLink] = useState("");

  const [warning, setWarning] = useState("");

  const getRecipe = async () => {
    console.log(link);
    try {
      let url;
      try {
        url = new URL(link);
      } catch (e) {
        console.log("error");
        return setWarning(
          "This is not a valid link. Make sure to copy the whole URL."
        );
      }
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
      console.log("fetch");
      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (response.status === 200) {
        setTitle("");
        setSource(result.source);
        setIngredients(result.ingredients);
        setInstructions(result.instructions);
        setWarning("");
      } else {
        throw new Error("Unable to find recipe");
      }
    } catch (e) {
      setWarning("Unable to find recipe. Try a different link.");
      console.log(e);
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

          <h1 className="labelLeft">Title:</h1>
          <input
            className="inputBoxLeft w-10/12"
            name="link"
            type="text"
            onChange={(event) => setLink(event.target.value)}
          />
          <button
            className="border-2 col-start-1 w-10/12 my-1 bg-purple"
            type="button"
            onClick={getRecipe}>
            Get recipe from link
          </button>
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
