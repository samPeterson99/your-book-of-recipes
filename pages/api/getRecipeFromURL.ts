//@ts-nocheck
//need to figure out typing for these JSONs
//feels somewhat like TS jsut isn't for this

import * as cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body.link);
    const url: string = req.body.link;
    const checkURL = new URL(url);
    if (!url && !checkURL) {
      return res.status(400).json({ error: "Incomplete recipe" });
    }

    const scriptContent = await getScriptContent(url);

    let title: string = "";
    let ingredients: object | string[] = findByKey(
      scriptContent,
      "recipeIngredient"
    );
    let instructions: object | string[] = findByKey(
      scriptContent,
      "recipeInstructions"
    );

    if (typeof ingredients[0] === "object") {
      ingredients = findAllTexts(ingredients);
    }

    if (typeof instructions[0] === "object") {
      instructions = findAllTexts(instructions);
    }

    const recipe = {
      title: title,
      source: url,
      ingredients: ingredients,
      instructions: instructions,
    };
    console.log(recipe);
    res.json(recipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getScriptContent(url: string) {
  const html = await fetch(url);
  const body = await html.text();

  const $ = cheerio.load(body);
  const scriptTag = $('script[type="application/ld+json"]');
  const contents = scriptTag.html();
  const jsonContents = JSON.parse(contents);
  return jsonContents;
}

//need to find
function findByKey(obj: object, key: string): string[] | object | undefined {
  for (let k in obj) {
    if (k === key) {
      return obj[k];
    } else if (typeof obj[k] === "object") {
      let result = findByKey(obj[k], key);
      if (result !== undefined) {
        return result;
      }
    }
  }
}

function findAllTexts(arr: object[]) {
  let array: string[] = [];

  for (let obj of arr) {
    for (let key in obj) {
      if (key === "text") {
        array.push(obj[key].replace(new RegExp("&nbsp;", "g"), " "));
      }
    }
  }

  return array;
}
