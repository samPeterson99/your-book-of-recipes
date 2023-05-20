import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
    throw new Error('missing .env variable for Mongo URI')
}

const uri: string = process.env.MONGO_URI;
const options: object = {};

let client = new MongoClient(uri, options);
let clientPromise = client.connect();

export default clientPromise;