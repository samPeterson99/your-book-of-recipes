import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class AmazonS3Client {
  private static instance: AmazonS3Client;
  private s3Client: S3Client;
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
    this.s3Client = new S3Client({});
  }

  static getInstance(bucketName: string): AmazonS3Client {
    if (
      !AmazonS3Client.instance ||
      bucketName !== AmazonS3Client.instance.bucketName
    ) {
      AmazonS3Client.instance = new AmazonS3Client(bucketName);
    }

    return AmazonS3Client.instance;
  }

  async uploadFile(
    userId: string,
    key: string,
    pictureType: string,
    pictureBlob: Buffer
  ) {
    const params = {
      Bucket: this.bucketName,
      Key: `${userId}/${key}`,
      ContentType: pictureType,
      Body: pictureBlob,
    };

    try {
      const command = new PutObjectCommand(params);
      const response = await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteFile(userId: string, imageId: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `${userId}/${imageId}`,
    });

    const response = await this.s3Client.send(command);
    return response;
  }

  async getUrl(userId: string, imageId: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: `${userId}/${imageId}`,
    });
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
    return url;
  }
}

export default AmazonS3Client;
