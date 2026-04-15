import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, GenerateRecipeParams, Language } from "../types";

// Mock data for fallback/testing
const MOCK_RECIPE: Recipe = {
  title: "Rustic Sage & Mushroom Pasta",
  description: "A comforting, creamy pasta dish highlighting earthy mushrooms and fresh aromatic sage.",
  cuisine: "Italian",
  prepTimeMinutes: 15,
  cookTimeMinutes: 20,
  servings: 2,
  caloriesPerServing: 450,
  ingredients: [
    { name: "Pasta (Fettuccine or Tagliatelle)", amount: "200g" },
    { name: "Mushrooms (Cremini or Button)", amount: "250g" },
    { name: "Garlic", amount: "2 cloves, minced" },
    { name: "Fresh Sage Leaves", amount: "10-12 leaves" },
    { name: "Heavy Cream", amount: "1/2 cup" },
    { name: "Parmesan Cheese", amount: "1/4 cup, grated" },
    { name: "Butter", amount: "2 tbsp" }
  ],
  steps: [
    { stepNumber: 1, instruction: "Boil a large pot of salted water. Add pasta and cook until al dente.", timerSeconds: 600 },
    { stepNumber: 2, instruction: "While pasta cooks, heat butter in a large skillet over medium heat. Add sage leaves and fry for 1-2 minutes until crisp. Remove sage and set aside." },
    { stepNumber: 3, instruction: "In the same skillet, add sliced mushrooms. Sauté until browned and moisture evaporates.", timerSeconds: 300 },
    { stepNumber: 4, instruction: "Add minced garlic to the mushrooms and cook for 30 seconds until fragrant." },
    { stepNumber: 5, instruction: "Pour in the heavy cream and simmer gently for 2-3 minutes to thicken slightly.", timerSeconds: 120 },
    { stepNumber: 6, instruction: "Toss the cooked pasta directly into the sauce. Stir in parmesan cheese and half the crispy sage." },
    { stepNumber: 7, instruction: "Serve immediately, topped with remaining crispy sage and black pepper." }
  ],
  language: 'English'
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    cuisine: { type: Type.STRING },
    prepTimeMinutes: { type: Type.INTEGER },
    cookTimeMinutes: { type: Type.INTEGER },
    servings: { type: Type.INTEGER },
    caloriesPerServing: { type: Type.INTEGER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        },
        required: ["name", "amount"]
      }
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          instruction: { type: Type.STRING },
          timerSeconds: { type: Type.INTEGER, description: "Optional duration in seconds if this step requires a timer (e.g. boil for 10 mins)" }
        },
        required: ["stepNumber", "instruction"]
      }
    }
  },
  required: ["title", "description", "cuisine", "ingredients", "steps", "prepTimeMinutes", "cookTimeMinutes"]
};

export const generateRecipe = async ({ ingredients, cuisine, dietaryRestrictions, avoidTitles, language, isMock }: GenerateRecipeParams): Promise<Recipe> => {
  if (isMock) {
    return new Promise((resolve) => setTimeout(() => resolve({...MOCK_RECIPE, language}), 2000));
  }

  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning mock data.");
    return {...MOCK_RECIPE, language};
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dietaryString = dietaryRestrictions.length > 0 
    ? `The recipe must be: ${dietaryRestrictions.join(", ")}.` 
    : "";
  
  const avoidString = avoidTitles && avoidTitles.length > 0
    ? `Do NOT create the following recipes: ${avoidTitles.join(", ")}. Create something different.`
    : "";

  const prompt = `
    Create a delicious ${cuisine} recipe using the following ingredients: ${ingredients.join(", ")}.
    ${dietaryString}
    ${avoidString}
    
    GUARDRAILS:
    - Do NOT use any pork, bacon, ham, or lard in the recipe. If the user provided these, ignore them or substitute with a non-pork alternative.
    - Ensure all ingredients used are real, edible food items.
    - If the provided ingredients are nonsensical or inappropriate, generate a polite message in the 'description' field explaining that you can't create a recipe with those items, and leave the 'steps' and 'ingredients' lists empty or minimal.

    IMPORTANT: The entire output (title, description, ingredients, instructions) MUST be in ${language} language.
    You may assume basic pantry staples (oil, salt, pepper, water) are available.
    Be creative but realistic.
    Ensure the instructions are clear and step-by-step.
    If a step involves a specific duration (like boiling or baking), include the 'timerSeconds' field.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const recipe = JSON.parse(text) as Recipe;
    recipe.language = language;
    return recipe;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const modifyRecipe = async (currentRecipe: Recipe, instruction: string, language: Language, isMock: boolean): Promise<Recipe> => {
  if (isMock) {
     return new Promise((resolve) => setTimeout(() => {
         const newRecipe = {...currentRecipe};
         newRecipe.title = `${newRecipe.title} (Remixed)`;
         newRecipe.description = "Updated based on your feedback: " + instruction;
         newRecipe.language = language;
         resolve(newRecipe);
     }, 2000));
  }

  if (!process.env.API_KEY) {
    return currentRecipe;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a helpful culinary expert. 
    Here is a recipe in JSON format:
    ${JSON.stringify(currentRecipe)}

    The user wants to modify this recipe with the following instruction:
    "${instruction}"

    GUARDRAILS:
    - Do NOT add any pork, bacon, ham, or lard to the recipe. If the user asks for these, politely decline in the 'description' and keep the recipe as is.
    - Ensure all additions are real, edible food items.

    Please return the updated recipe in the exact same JSON structure. 
    IMPORTANT: The output must remain in ${language} language (or translate to it if requested).
    Ensure all fields (ingredients, steps, nutritional info) are consistent with the change.
  `;

  try {
   const response = await ai.models.generateContent({
     model: 'gemini-3-flash-preview',
     contents: prompt,
     config: {
       responseMimeType: "application/json",
       responseSchema: recipeSchema,
       temperature: 0.7,
     },
   });

   const text = response.text;
   if (!text) throw new Error("No response from Gemini");
   const recipe = JSON.parse(text) as Recipe;
   recipe.language = language;
   return recipe;
  } catch (error) {
    console.error("Gemini Modification Error", error);
    throw error;
  }
};

export const translateRecipe = async (currentRecipe: Recipe, targetLanguage: Language, isMock: boolean): Promise<Recipe> => {
    if (isMock) {
        return new Promise((resolve) => setTimeout(() => {
            const newRecipe = {...currentRecipe};
            newRecipe.title = `${newRecipe.title} (${targetLanguage})`;
            newRecipe.language = targetLanguage;
            resolve(newRecipe);
        }, 1500));
    }

    if (!process.env.API_KEY) {
        return currentRecipe;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a professional translator.
      Translate the following recipe JSON into ${targetLanguage}.
      
      Recipe JSON:
      ${JSON.stringify(currentRecipe)}

      Requirements:
      1. Maintain the exact same JSON structure.
      2. Translate all user-facing text (title, description, ingredients name/amount, step instructions).
      3. Do not change numerical values (time, calories) unless unit conversion is standard (keep metrics consistent).
      4. Ensure the tone is appetizing and professional.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
                temperature: 0.3,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");
        const recipe = JSON.parse(text) as Recipe;
        recipe.language = targetLanguage;
        return recipe;
    } catch (error) {
        console.error("Gemini Translation Error", error);
        throw error;
    }
};

export const generateRecipeImage = async (title: string, description: string, instructions: string[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Concatenate instructions to provide more context for visual accuracy
  const preparationContext = instructions.join(" ").slice(0, 500); // Limit context length
  
  const prompt = `Professional food photography of ${title}. ${description}. The image should accurately reflect these preparation details: ${preparationContext}. High resolution, appetizing, beautifully plated on a minimalist background, soft natural lighting, commercial quality.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};