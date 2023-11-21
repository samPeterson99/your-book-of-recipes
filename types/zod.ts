import { ObjectId } from "mongodb";
import { z } from "zod";

const SingleRecipeSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  id: z.string().optional(),
  title: z.string(),
  source: z.string().nullable(),
  ingredients: z.string().array().nonempty(),
  instructions: z.string().array().nonempty(),
  imageId: z.string().nullable(),
  imageUrl: z.string().optional(),
});

type Recipe = z.infer<typeof SingleRecipeSchema>;

const RecipeArraySchema = z.array(SingleRecipeSchema);

type RecipeArray = z.infer<typeof RecipeArraySchema>;

export { SingleRecipeSchema, RecipeArraySchema };
export type { Recipe, RecipeArray };
