import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { useEffect, useState } from "react";
import { s3Client } from "@/resources/S3Service";
import { GetServerSideProps } from "next";

const ImageFromS3 = ({ image }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log("hi");
  return (
    <>
      {image ? (
        <img
          src={image}
          alt=""
        />
      ) : (
        <p>da fuq</p>
      )}
    </>
  );
};

export default ImageFromS3;
