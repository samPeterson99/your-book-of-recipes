import clientPromise from "@/lib/db";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("oh hello");
  const testRecipe = [
    {
      title: "Chicken Wings",
      source: "How to Cook Everything by Mark Bittman",
      ingredients: [
        "1/4 cup Frank's RedHot",
        "4 tablespoons butter, melted",
        "2 tablespoons sherry vinegar or white wine vinegar",
        "1 tablespoon chopped garlic",
        "3 pounds wings, rinsed and patted dry",
        "2 tablespoons vegetable oil",
        "salt and pepper",
      ],
      instructions: [
        "Preheat the oven to 375&deg;F. Combine the hot sauce, butter, vinegar, and garlic in  small bowl",
        "Put the chicken wings in a large rosting pan, drizzle with the oil, and sprinkle liberally with salt and pepper. Toss to coat, then spread the wings out in a single layer. (It's okay if they are crowded; they'll shrink Roast the wings undistrubed until the bottom of the pan is coated with fat and the wings are beginning to brown, about 30 minutes. Use a spoon to baste the wings with the drippings, then carefully pour or spoon the fat out of the pan. If the wings are stil sticking to the bottom of the pan, return them to the oven for another 5 or 10 minutes, until they release easily",
        "Turn the wings over, baste again, then carefully spoon out any remaining fat. Return the wings to the oven until nicely browned, another 20 minutes or so. Again, make sure they release easily from the pan",
        "Raise the oven temperature to 450&deg;F. Carefully pour off any accumulated fat, then drizzle the wings with the hot sauce mixture and toss to coat. Spread them back out into a single layer and return them to the oven. Roast, tossing onces or twice, until crips all over, about 10 more minutes. Serve hot or at room temperature.",
      ],
    },
    {
      title: "Shells with Broccoli and Capers",
      source: "The New Vegetarian Cooking for Everyone by Deborah Madison",
      ingredients: [
        "2 cloves garlic, peeled",
        "1/2 teaspoon salt",
        "1/3 cup of olive oil",
        "1/2 teaspoon red pepper flakes",
        "1/4 cup capers, rinsed",
        "1 1/2 pounds broccoli",
        "1 pound shells pasta",
        "Freshly milled pepper",
        "Freshly grated parmesan, optional",
      ],
      instructions: [
        "Mince or mash the garlic with the salt until smooth, then put it in a large bowl with oil, pepper flakes, and capers.",
        "Thickly peel the broccoli stems. Cut both the crowns and stems into small bite-size pieces",
        "Bring plenty of water to a boil for the pasta. When it boils, add salt and broccoli and cook, uncovered, until tender, 4 to 5 minutes. Scoop it out, shake off the water, add it to the bowl, and toss with the oil mixture. Cover",
        "Cook the pasta until al dente, then drain and add it to the broccoli. Toss well, season with plenty of pepper and toss with cheese.",
      ],
    },
    {
      title: "Pad Thai",
      source: "https://tastesbetterfromscratch.com/pad-thai/",
      ingredients: [
        "8 ounces flat rice noodles",
        "3 tablespoons oil",
        "3 cloves garlic, minced",
        "8 ouunces uncooked chicken",
        "2 eggs",
        "1 cup fresh bean sprouts",
        "1 red bell pepper, thinly sliced",
        "3 green onions, chopped",
        "1/2 cup dry roasted peanuts",
        "2 limes",
        "1/2 cup fresh cilantro, chopped",
        "3 tablespoons fish sauce",
        "1 tablespoon soy sauce",
        "5 tablespoons light brown sugar",
        "2 tablespoons rice vinegary",
        "1 tablespoon sriracha",
      ],
      instructions: [
        "Cook noodles according to package instructions, just until tender. Rinse under cold water.",
        "Make sauce by combining sauce ingredients in a bowl. Set aside.",
        "Stir Fry: Heat 1½ tablespoons of oil in a large saucepan or wok over medium-high heat. Add the shrimp, chicken or tofu, garlic and bell pepper. The shrimp will cook quickly, about 1-2 minutes on each side, or until pink. If using chicken, cook until just cooked through, about 3-4 minutes, flipping only once.",
        "Push everything to the side of the pan. Add a little more oil and add the beaten eggs. Scramble the eggs, breaking them into small pieces with a spatula as they cook.",
        "Add noodles, sauce, bean sprouts and peanuts to the pan (reserving some peanuts for topping at the end). Toss everything to combine.",
        "Garnish the top with green onions, extra peanuts, cilantro and lime wedges. Serve immediately!",
      ],
    },
  ];

  const returnRecipe = [
    {
      title: "Chicken Wings",
      source: "How to Cook Everything by Mark Bittman",
      ingredients: [
        "1/4 cup Frank's RedHot",
        "4 tablespoons butter, melted",
        "2 tablespoons sherry vinegar or white wine vinegar",
        "1 tablespoon chopped garlic",
        "3 pounds wings, rinsed and patted dry",
        "2 tablespoons vegetable oil",
        "salt and pepper",
      ],
      instructions: [
        "Preheat the oven to 375°F. Combine the hot sauce, butter, vinegar, and garlic in  small bowl",
        "Put the chicken wings in a large rosting pan, drizzle with the oil, and sprinkle liberally with salt and pepper. Toss to coat, then spread the wings out in a single layer. (It's okay if they are crowded; they'll shrink Roast the wings undistrubed until the bottom of the pan is coated with fat and the wings are beginning to brown, about 30 minutes. Use a spoon to baste the wings with the drippings, then carefully pour or spoon the fat out of the pan. If the wings are stil sticking to the bottom of the pan, return them to the oven for another 5 or 10 minutes, until they release easily",
        "Turn the wings over, baste again, then carefully spoon out any remaining fat. Return the wings to the oven until nicely browned, another 20 minutes or so. Again, make sure they release easily from the pan",
        "Raise the oven temperature to 450°F. Carefully pour off any accumulated fat, then drizzle the wings with the hot sauce mixture and toss to coat. Spread them back out into a single layer and return them to the oven. Roast, tossing onces or twice, until crips all over, about 10 more minutes. Serve hot or at room temperature.",
      ],
      _id: "temp1",
    },
    {
      title: "Shells with Broccoli and Capers",
      source: "The New Vegetarian Cooking for Everyone by Deborah Madison",
      ingredients: [
        "2 cloves garlic, peeled",
        "1/2 teaspoon salt",
        "1/3 cup of olive oil",
        "1/2 teaspoon red pepper flakes",
        "1/4 cup capers, rinsed",
        "1 1/2 pounds broccoli",
        "1 pound shells pasta",
        "Freshly milled pepper",
        "Freshly grated parmesan, optional",
      ],
      instructions: [
        "Mince or mash the garlic with the salt until smooth, then put it in a large bowl with oil, pepper flakes, and capers.",
        "Thickly peel the broccoli stems. Cut both the crowns and stems into small bite-size pieces",
        "Bring plenty of water to a boil for the pasta. When it boils, add salt and broccoli and cook, uncovered, until tender, 4 to 5 minutes. Scoop it out, shake off the water, add it to the bowl, and toss with the oil mixture. Cover",
        "Cook the pasta until al dente, then drain and add it to the broccoli. Toss well, season with plenty of pepper and toss with cheese.",
      ],
      _id: "temp2",
    },
    {
      title: "Pad Thai",
      source: "https://tastesbetterfromscratch.com/pad-thai/",
      ingredients: [
        "8 ounces flat rice noodles",
        "3 tablespoons oil",
        "3 cloves garlic, minced",
        "8 ouunces uncooked chicken",
        "2 eggs",
        "1 cup fresh bean sprouts",
        "1 red bell pepper, thinly sliced",
        "3 green onions, chopped",
        "1/2 cup dry roasted peanuts",
        "2 limes",
        "1/2 cup fresh cilantro, chopped",
        "3 tablespoons fish sauce",
        "1 tablespoon soy sauce",
        "5 tablespoons light brown sugar",
        "2 tablespoons rice vinegary",
        "1 tablespoon sriracha",
      ],
      instructions: [
        "Cook noodles according to package instructions, just until tender. Rinse under cold water.",
        "Make sauce by combining sauce ingredients in a bowl. Set aside.",
        "Stir Fry: Heat 1½ tablespoons of oil in a large saucepan or wok over medium-high heat. Add the shrimp, chicken or tofu, garlic and bell pepper. The shrimp will cook quickly, about 1-2 minutes on each side, or until pink. If using chicken, cook until just cooked through, about 3-4 minutes, flipping only once.",
        "Push everything to the side of the pan. Add a little more oil and add the beaten eggs. Scramble the eggs, breaking them into small pieces with a spatula as they cook.",
        "Add noodles, sauce, bean sprouts and peanuts to the pan (reserving some peanuts for topping at the end). Toss everything to combine.",
        "Garnish the top with green onions, extra peanuts, cilantro and lime wedges. Serve immediately!",
      ],
      _id: "temp3",
    },
  ];

  const session = await getServerSession(req, res, authOptions);
  const client = await clientPromise;
  const db = client.db("data");

  const userId: string | undefined = session?.user?.id;

  const post = await db.collection(`${userId}`).insertMany(testRecipe);
  return res.status(200).json(returnRecipe);
}
