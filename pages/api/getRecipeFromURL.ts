//@ts-nocheck
//need to figure out typing for these JSONs
//feels somewhat like TS jsut isn't for this

import { chromium } from "@playwright/test";
import { NextApiRequest, NextApiResponse } from "next";

export default async function playwright(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body.link);
    const url: string = req.body.link;
    if (!url) {
      return res.status(400).json({ data: "Incomplete recipe" });
    }

    const scriptContent = await getScriptContent(url);
    console.log(scriptContent);
    const string = await JSON.stringify(scriptContent);
    const json = await JSON.parse(string);
    console.log(json);

    let title: string = findByKey(json, "title");
    let ingredients: object | string[] = findByKey(json, "recipeIngredient");
    let instructions: object | string[] = findByKey(json, "recipeInstructions");

    if (!title) {
      title = "";
    }

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
  }
}

async function getScriptContent(url: string) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(url);

  const scriptContent: string | null = await page.$eval(
    'script[type="application/ld+json"]',
    (element) => element.textContent
  );

  await browser.close();

  return JSON.parse(scriptContent as string);
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
      if (key === "text") array.push(obj[key]);
    }
  }

  return array;
}
