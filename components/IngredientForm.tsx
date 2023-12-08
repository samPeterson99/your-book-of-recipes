import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Dispatch } from "react";

interface IngredientFormProps {
  ingredients: string[];
  setIngredients: Dispatch<React.SetStateAction<string[]>>;
}

const IngredientForm = ({
  ingredients,
  setIngredients,
}: IngredientFormProps) => {
  const addIngredient = () => {
    let data = [...ingredients];
    data.push("");
    setIngredients(data);
  };

  const removeIngredientField = (index: number) => {
    let data = [...ingredients];
    data.splice(index, 1);
    setIngredients(data);
  };

  const handleIngredientChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...ingredients];
    data[index] = event.target.value;
    setIngredients(data);
  };

  return (
    <>
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
    </>
  );
};

export default IngredientForm;
