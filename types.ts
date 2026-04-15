export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number; // Optional timer for this step
}

export type Language = 'English' | 'Spanish' | 'Russian';

export interface Recipe {
  title: string;
  description: string;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  ingredients: Ingredient[];
  steps: Step[];
  language?: Language; // Track the language of the content
}

export interface HistoryItem {
  id: string;
  recipe: Recipe;
  timestamp: number;
  type: 'generated' | 'modification';
  prompt?: string; // The modification prompt if applicable
}

export enum CuisineType {
  Italian = "Italian",
  Mexican = "Mexican",
  Thai = "Thai",
  Japanese = "Japanese",
  Indian = "Indian",
  Mediterranean = "Mediterranean",
  American = "American",
  French = "French",
  Chinese = "Chinese",
  Greek = "Greek"
}

export enum DietaryRestriction {
  Vegetarian = "Vegetarian",
  Vegan = "Vegan",
  Pescatarian = "Pescatarian",
  GlutenFree = "Gluten-Free",
  DairyFree = "Dairy-Free",
  NutFree = "Nut-Free",
  Halal = "Halal",
  Kosher = "Kosher",
  Keto = "Keto",
  Paleo = "Paleo",
  LowCarb = "Low Carb"
}

export interface GenerateRecipeParams {
  ingredients: string[];
  cuisine: string;
  dietaryRestrictions: string[];
  avoidTitles?: string[]; // New field to prevent duplicate recipes
  language: Language;
  isMock?: boolean;
}