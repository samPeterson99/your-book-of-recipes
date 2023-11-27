//Make front end responsive to various error codes
import * as cheerio from "cheerio";
import { z } from "zod";
import { NextApiRequest, NextApiResponse } from "next";

type json = string | number | boolean | null | json[] | { [key: string]: json };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = z.string().url().parse(req.body.link);

  if (!url) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const scriptContent = await getScriptContent(url);

  if (!scriptContent) {
    return res
      .status(400)
      .json({ error: "Website could not be loaded by scraper" });
  }

  let title: string = "";
  let ingredients = findByKey(scriptContent, "recipeIngredient");
  let instructions = findByKey(scriptContent, "recipeInstructions");

  if (!ingredients || !instructions)
    return res.status(400).json({ error: "recipe not found on page" });

  const recipe = {
    title: title,
    source: url,
    ingredients: ingredients,
    instructions: instructions,
  };

  res.status(200).json(recipe);
}

async function getScriptContent(url: string) {
  const html = await fetch(url);

  const body = await html.text();

  const $ = cheerio.load(body);
  const scriptTag = $('script[type="application/ld+json"]');
  const contents = scriptTag.html();

  if (!contents) return;
  const jsonContents: json = JSON.parse(contents);

  return jsonContents;
}

//need to find
function findByKey(obj: json, key: string): string[] | null {
  const isArray = z.string().array();
  if (obj === null) return null;

  for (let k in obj as { [key: string]: json }) {
    if (k === key) {
      const arrayCheck = isArray.safeParse(obj[k as keyof json]);
      if (arrayCheck.success) {
        //return array of strings as found
        return obj[k as keyof json] as string[];
      } else {
        //call helper function to simplify array of objects
        return findAllTexts(obj[k as keyof json]);
      }
    } else if (typeof obj[k as keyof json] === "object") {
      let result = findByKey(obj[k as keyof json], key);
      const arrayCheck = isArray.safeParse(result);
      if (arrayCheck.success) {
        return result;
      }
    }
  }

  //if nothing found
  return null;
}

function findAllTexts(arr: object[]): string[] {
  let array: string[] = [];
  for (let obj of arr) {
    for (let key in obj) {
      if (key === "text") {
        const text = obj[key as keyof json] as string;
        array.push(text.replace(new RegExp("&nbsp;", "g"), " "));
      }
    }
  }

  return array;
}
