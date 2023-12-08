import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Dispatch } from "react";

interface InstructionFormProps {
  instructions: string[];
  setInstructions: Dispatch<React.SetStateAction<string[]>>;
}

const InstructionForm = ({
  instructions,
  setInstructions,
}: InstructionFormProps) => {
  const handleInstructionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    let data = [...instructions];
    data[index] = event.target.value;
    setInstructions(data);
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

  const removeInstructionField = (index: number) => {
    let data = [...instructions];
    data.splice(index, 1);
    setInstructions(data);
  };

  return (
    <>
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
    </>
  );
};

export default InstructionForm;
