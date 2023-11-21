import { useRouter } from "next/router";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/24/outline";
import Dropzone from "react-dropzone";
import { z } from "zod";
import { useState } from "react";

export default function RecipeForm() {
  let imagePreview = "";
  const blankArray = ["", "", "", "", ""];
  const emptyArray: string[] = [];

  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [ingredients, setIngredients] = useState(blankArray);
  const [instructions, setInstructions] = useState(blankArray);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [pictureError, setPictureError] = useState(false);

  const [link, setLink] = useState("");

  const [errors, setErrors] = useState(emptyArray);
  const [warning, setWarning] = useState("");

  const router = useRouter();

  if (pictureFile) {
    imagePreview = URL.createObjectURL(pictureFile);
  }

  const handleIngredientChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...ingredients];
    data[index] = event.target.value;
    setIngredients(data);
  };

  const handleInstructionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    let data = [...instructions];
    data[index] = event.target.value;
    setInstructions(data);
  };

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
      const imageId = await storeImage();

      const recipe = {
        title: checkedTitle.data,
        source: source.trim(),
        ingredients: checkedIngredients.data,
        instructions: checkedInstructions.data,
        imageId: imageId,
      };

      console.log(recipe);

      const JSONrecipe = JSON.stringify(recipe);
      const endpoint = "/api/addRecipe";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONrecipe,
      };

      const response = await fetch(endpoint, options);

      const result = await response.json();

      router.push("/dashboard");
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

  const validateLinkAndFetch = () => {
    const isUrl = z.string().url().safeParse(link);

    if (!isUrl.success) {
      return setErrors([
        "This is not a valid link. Make sure to copy the whole URL.",
      ]);
    }

    getRecipe();
  };

  const getRecipe = async () => {
    setErrors([]);
    let url;

    setWarning("this may take a minute");

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

      if (response.status === 200) {
        setTitle("");
        setSource(result.source);
        setIngredients(result.ingredients);
        setInstructions(result.instructions);
        setWarning("");
      }
    } catch (e) {
      setWarning(
        "Unable to find recipe. Type the recipe or try a different link."
      );
      console.log(e);
    }
  };

  const addIngredient = () => {
    let data = [...ingredients];
    data.push("");
    setIngredients(data);
  };

  const addInstructionAbove = (index: number) => {
    let data = [...instructions];
    if (index === 0) {
      data.splice(0, 0, "");
    } else {
      data.splice(index, 0, "");
    }
    setInstructions(data);
  };

  const addInstructionBelow = (index: number) => {
    let data = [...instructions];
    if (index === instructions.length) {
      data.push("");
    } else {
      data.splice(index + 1, 0, "");
    }
    setInstructions(data);
  };

  const removeIngredientField = (index: number) => {
    let data = [...ingredients];
    data.splice(index, 1);
    setIngredients(data);
  };

  const removeInstructionField = (index: number) => {
    let data = [...instructions];
    data.splice(index, 1);
    setInstructions(data);
  };

  const handleDrop = async (droppedFiles: File[]) => {
    console.log("dropped");
    const fileType = droppedFiles[0].type;
    if (fileType === "image/png" || fileType === "image/jpeg") {
      setPictureFile(droppedFiles[0]);
      setPictureError(false);
      droppedFiles.pop();
    } else {
      droppedFiles.pop();
      setPictureError(true);
    }
  };

  const removeImage = () => {
    setPictureFile(null);
    setPictureError(false);
  };

  return (
    <div className="pageContainer">
      <form
        className="page"
        onSubmit={submit}>
        <div className="pageLeft">
          <ul>
            {warning !== "" && (
              <li className="warningSign flex">
                <p className="h-auto  px-4 mx-4">{warning}</p>
              </li>
            )}
          </ul>
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

          <label
            className="labelLeft"
            htmlFor="title">
            A Recipe for
          </label>
          <input
            className="inputBoxLeft w-10/12"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label className="labelLeft">From:</label>
          <input
            className="inputBoxLeft w-10/12"
            name="source"
            type="text"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />

          <hr className="border-black my-4 w-full shadow col-start-1"></hr>

          <label className="labelLeft">Link:</label>
          <input
            className="inputBoxLeft w-10/12"
            name="link"
            type="text"
            onChange={(event) => setLink(event.target.value)}
          />
          <button
            className="flex-none border-2 col-start-1 w-1/2 mb-2 bg-purple"
            type="button"
            onClick={validateLinkAndFetch}>
            Get recipe from link
          </button>
          <button
            className="flex-none border-2 col-start-1 w-1/2 bg-purple"
            type="submit">
            Submit
          </button>
          <label
            className="iWord"
            htmlFor="ingredients">
            Ingredients
          </label>
          {ingredients.map((form, index) => {
            return (
              <div
                className="flex flex-row my-1 items-center"
                key={index}>
                <input
                  className="ingredientBox"
                  name="ingredient"
                  value={form}
                  onChange={(event) => handleIngredientChange(event, index)}
                />
                <MinusCircleIcon
                  className="inputButton"
                  onClick={() => removeIngredientField(index)}
                />
              </div>
            );
          })}
          <PlusCircleIcon
            className="addButton"
            onClick={addIngredient}
          />
        </div>

        <div className="pageRight">
          {pictureFile ? (
            <div>
              {" "}
              <p>image preview</p>
              <img
                className="h-44 w-44"
                src={imagePreview}
                alt=""
              />
              <button
                type="button"
                className="flex-none border-2 col-start-1 w-1/2 bg-purple"
                onClick={removeImage}>
                Remove image
              </button>
              <button
                type="button"
                onClick={storeImage}>
                TEST
              </button>
            </div>
          ) : (
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="h-20 bg-gray-300 ">
                  <input {...getInputProps()} />
                  <p>Drag & drop images here, or click to select files</p>
                  {pictureError && (
                    <p>The image must be either a .png or .jpeg file</p>
                  )}
                </div>
              )}
            </Dropzone>
          )}
          <label
            className="iWord"
            htmlFor="instructions">
            Instructions
          </label>
          {instructions.map((form, index) => {
            return (
              <div
                className="flex flex-row my-1 place-items-center"
                key={index}>
                <h3 className="label">{index + 1}.</h3>
                <textarea
                  className="inputBox"
                  name="instruction"
                  rows={3}
                  value={form}
                  onChange={(event) => handleInstructionChange(event, index)}
                />
                <ArrowUpCircleIcon
                  className="inputButton"
                  type="button"
                  onClick={() => addInstructionAbove(index)}
                />
                <div className="add">ADD</div>
                <ArrowDownCircleIcon
                  className="inputButton"
                  onClick={() => addInstructionBelow(index)}
                />
                <MinusCircleIcon
                  className="inputButton"
                  onClick={() => removeInstructionField(index)}
                />
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
}
