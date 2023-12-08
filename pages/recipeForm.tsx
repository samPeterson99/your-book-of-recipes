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
import IngredientForm from "@/components/IngredientForm";
import InstructionForm from "@/components/InstructionForm";

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
          <div className="mt-2 flex flex-col bg-yellow-200 pl-2">
            <label className="labelLeft">Link:</label>
            <input
              className="inputBoxLeft w-10/12"
              name="link"
              type="text"
              onChange={(event) => setLink(event.target.value)}
            />
            <button
              className="flex-none border-2 col-start-1 w-10/12 mb-2 bg-purple"
              type="button"
              onClick={validateLinkAndFetch}>
              Get recipe from link
            </button>
          </div>

          <hr className="border-black my-4 w-full shadow col-start-1"></hr>

          {pictureFile ? (
            <div>
              {" "}
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
            </div>
          ) : (
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="h-32 bg-gray-300 max-w-sm">
                  <input {...getInputProps()} />
                  <p className="text-center mt-4 h-auto">
                    Drag & drop images here, or click to select files
                    {pictureError && (
                      <p className="text-center mt-2 font-bold h-auto text-red-500">
                        The image must be either a .png or .jpeg file
                      </p>
                    )}
                  </p>
                </div>
              )}
            </Dropzone>
          )}
          <button
            className="mt-2 flex-none border-2 col-start-1 w-1/2 bg-purple mb-4"
            type="submit">
            Submit
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
