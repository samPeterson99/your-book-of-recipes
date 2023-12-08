import { Recipe, RecipeArray } from "@/types/zod";
import { MongoClient, Db } from "mongodb";
import mongoose, { Types } from "mongoose";

class MongoDBClient {
  private static instance: MongoDBClient;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    if (!process.env.MONGO_URI) {
      throw new Error("missing .env variable for Mongo URI");
    }

    const uri: string = process.env.MONGO_URI;
    const options: object = {};

    this.client = new MongoClient(uri, options);
  }

  static getInstance(): MongoDBClient {
    if (!MongoDBClient.instance) {
      MongoDBClient.instance = new MongoDBClient();
    }

    return MongoDBClient.instance;
  }

  async connect(): Promise<void> {
    try {
      this.client.connect();
      this.db = this.client.db("data");
    } catch (e) {
      throw new Error();
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error();
    }
    return this.db;
  }

  async insertOne(userId: string, recipe: Recipe) {
    if (!this.db) {
      throw new Error("No database connection");
    }
    let { title, source, ingredients, instructions, imageId } = recipe;
    const post = await this.db.collection(`${userId}`).insertOne({
      title,
      source,
      ingredients,
      instructions,
      imageId,
    });
    return post;
  }

  async getRecipes(userId: string) {
    if (!this.db) {
      throw new Error("No database connection");
    }
    const recipes = await this.db.collection(`${userId}`).find({}).toArray();
    return recipes;
  }

  async getSingleRecipe(userId: string, recipeId: string) {
    if (!this.db) {
      throw new Error("No database connection");
    }
    const o_id = new mongoose.Types.ObjectId(recipeId);

    const response = await this.db.collection(`${userId}`).findOne({
      _id: o_id,
    });
    console.log(response);
    return response;
  }

  async insertMany(userId: string, recipes: RecipeArray) {
    if (!this.db) {
      throw new Error("No database connection");
    }
    const post = await this.db.collection(`${userId}`).insertMany(recipes);
    return post;
  }

  async updateOne(userId: string, objectId: string, recipe: Recipe) {
    if (!this.db) {
      throw new Error("No database connection");
    }
    const o_id = new mongoose.Types.ObjectId(objectId);
    const { title, source, ingredients, instructions, imageId } = recipe;

    const post = await this.db.collection(`${userId}`).updateOne(
      {
        _id: o_id,
      },
      {
        $set: {
          title: title,
          source: source,
          ingredients: ingredients,
          instructions: instructions,
          imageId: imageId,
        },
      }
    );

    return post;
  }

  async deleteOne(userId: string, objectId: string) {
    if (!this.db) {
      throw new Error("No database connection");
    }
    const o_id = new mongoose.Types.ObjectId(objectId);

    const deletion = await this.db.collection(`${userId}`).findOneAndDelete({
      _id: o_id,
    });

    console.log(deletion);
    return deletion;
  }
}

export default MongoDBClient;
