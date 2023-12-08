import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { Dispatch } from "react";
import Dropzone from "react-dropzone";

interface ImageDropzoneProps {
  pictureFile: File | null;
  setPictureFile: Dispatch<React.SetStateAction<File | null>>;
  pictureError: boolean;
  setPictureError: Dispatch<React.SetStateAction<boolean>>;
}

const ImageDropzone = ({
  pictureFile,
  setPictureFile,
  pictureError,
  setPictureError,
}: ImageDropzoneProps) => {
  let imagePreview = "";

  if (pictureFile) {
    imagePreview = URL.createObjectURL(pictureFile);
  }

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
    <>
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
    </>
  );
};

export default ImageDropzone;
