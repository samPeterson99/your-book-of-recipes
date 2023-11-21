import { GetObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";
import ImageFromS3 from "@/components/ImageFromS3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default function ImageTest({ image }) {
  let imagePreview = "";
  const [pictureFile, setPictureFile] = useState<File | null>(null);

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

  const onSubmit = async () => {
    if (!pictureFile) return;

    const formData = new FormData();

    const fileType = pictureFile?.type;

    const fileBlob = await fileToBlob(pictureFile);
    formData.append("fileBlob", fileBlob);
    formData.append("fileType", fileType);
    console.log(fileBlob);

    const endpoint = "/api/toS3";
    const options = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch(endpoint, options);
      const result = await response.json();
    } catch (error) {}

    setPictureFile(null);
  };

  const handleDrop = async (droppedFiles: File[]) => {
    console.log("dropped");
    const fileType = droppedFiles[0].type;
    if (fileType === "image/png" || fileType === "image/jpeg") {
      setPictureFile(droppedFiles[0]);
      droppedFiles.pop();
    } else {
      droppedFiles.pop();
    }
  };

  return (
    <>
      <form action="PUT">
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="h-20 bg-gray-300 ">
              <input {...getInputProps()} />
              <p>Drag & drop images here, or click to select files</p>
            </div>
          )}
        </Dropzone>
        {imagePreview !== "" && (
          <div>
            {" "}
            <p>image preview</p>
            <img
              className="h-28 w-28"
              src={imagePreview}
              alt=""
            />
          </div>
        )}
        <button
          onClick={onSubmit}
          type="button">
          Submit
        </button>
      </form>
      {image ? (
        <img
          src={image}
          alt="Your Photo"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      ) : (
        <p>da fuq</p>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const s3Client = new S3Client({});

  const command = new GetObjectCommand({
    Bucket: "yrrb",
    Key: "11111.jpeg",
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return { props: { image: url } };
  } catch (err) {
    console.error(" thiserror", err);
    return { props: { image: null } };
  }
}
