import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, ChefHat, LayoutGrid, Send, Wand2, History, RefreshCcw, Globe, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IngredientInput from './components/IngredientInput';
import CuisineSelector from './components/CuisineSelector';
import DietarySelector from './components/DietarySelector';
import CommonIngredientsModal from './components/CommonIngredientsModal';
import HistoryDrawer from './components/HistoryDrawer';
import RecipeCard from './components/RecipeCard';
import { Recipe, CuisineType, HistoryItem, Language } from './types';
import { generateRecipe, modifyRecipe, translateRecipe, generateRecipeImage } from './services/geminiService';

const TRANSLATIONS = {
  English: {
    heroTitle: "What's in your pantry?",
    heroSubtitle: "Enter your leftover ingredients, pick a style, and let AI craft the perfect recipe for you.",
    placeholder: "Type an ingredient and press Enter (e.g. Chicken, Basil)...",
    noIngredients: "No ingredients added yet.",
    yourPantry: "Your Pantry",
    browse: "Browse Common Ingredients",
    selectCuisine: "Select Cuisine",
    dietaryTitle: "Dietary Restrictions",
    generate: "Generate Recipe",
    cooking: "Chef is cooking...",
    failed: "Failed to generate recipe. Please try again.",
    blockedIngredient: "Sorry, I can't generate recipes with pork or bacon.",
    invalidIngredients: "Please enter real, edible ingredients.",
    tweakTitle: "Tweak this recipe",
    tweakPlaceholder: "e.g. 'Make it spicy', 'Use less oil', 'Add more protein'...",
    refine: "Refine",
    generateAnother: "Generate Another {cuisine} Dish",
    adjusting: "Adjusting the recipe...",
    curating: "Curating flavors...",
    translating: "Translating recipe...",
    plating: "Plating the dish...",
    history: {
        title: "Recipe History",
        empty: "No recipes generated yet.",
        tweaked: "Tweaked"
    },
    recipe: {
        cuisine: "Cuisine",
        totalTime: "Total",
        servings: "Servings",
        calories: "kcal / serving",
        ingredients: "Ingredients",
        instructions: "Instructions",
        kitchenTimer: "Kitchen Timer",
        bonAppetit: "Bon Appétit!"
    },
    commonModal: {
        title: "Pantry Essentials",
        selected: "ingredients selected",
        done: "Done"
    },
    cuisines: {
        Italian: "Italian",
        Mexican: "Mexican",
        Thai: "Thai",
        Japanese: "Japanese",
        Indian: "Indian",
        Mediterranean: "Mediterranean",
        American: "American",
        French: "French",
        Chinese: "Chinese",
        Greek: "Greek"
    },
    dietaryOptions: {
        Vegetarian: "Vegetarian",
        Vegan: "Vegan",
        Pescatarian: "Pescatarian",
        "Gluten-Free": "Gluten-Free",
        "Dairy-Free": "Dairy-Free",
        "Nut-Free": "Nut-Free",
        Halal: "Halal",
        Kosher: "Kosher",
        Keto: "Keto",
        Paleo: "Paleo",
        "Low Carb": "Low Carb"
    }
  },
  Spanish: {
    heroTitle: "¿Qué hay en tu despensa?",
    heroSubtitle: "Introduce tus ingredientes, elige un estilo y deja que la IA cree la receta perfecta.",
    placeholder: "Escribe un ingrediente y presiona Enter...",
    noIngredients: "Aún no hay ingredientes.",
    yourPantry: "Tu Despensa",
    browse: "Explorar Ingredientes Comunes",
    selectCuisine: "Seleccionar Cocina",
    dietaryTitle: "Restricciones Dietéticas",
    generate: "Generar Receta",
    cooking: "El chef está cocinando...",
    failed: "Error al generar la receta. Inténtalo de nuevo.",
    blockedIngredient: "Lo siento, no puedo generar recetas con cerdo o tocino.",
    invalidIngredients: "Por favor, introduce ingredientes reales и comestibles.",
    tweakTitle: "Ajustar esta receta",
    tweakPlaceholder: "ej. 'Hazlo picante', 'Menos aceite'...",
    refine: "Refinar",
    generateAnother: "Generar otro plato {cuisine}",
    adjusting: "Ajustando la receta...",
    curating: "Curando sabores...",
    translating: "Traduciendo receta...",
    plating: "Emplatando el plato...",
    history: {
        title: "Historial de Recetas",
        empty: "Aún no hay recetas.",
        tweaked: "Modificado"
    },
    recipe: {
        cuisine: "Cocina",
        totalTime: "Total",
        servings: "Porciones",
        calories: "kcal / porción",
        ingredients: "Ingredientes",
        instructions: "Instrucciones",
        kitchenTimer: "Temporizador",
        bonAppetit: "¡Buen Provecho!"
    },
    commonModal: {
        title: "Despensa Básica",
        selected: "ingredientes seleccionados",
        done: "Listo"
    },
    cuisines: {
        Italian: "Italiana",
        Mexican: "Mexicana",
        Thai: "Tailandesa",
        Japanese: "Japonesa",
        Indian: "India",
        Mediterranean: "Mediterránea",
        American: "Americana",
        French: "Francesa",
        Chinese: "China",
        Greek: "Griega"
    },
    dietaryOptions: {
        Vegetarian: "Vegetariano",
        Vegan: "Vegano",
        Pescatarian: "Pescatariano",
        "Gluten-Free": "Sin Gluten",
        "Dairy-Free": "Sin Lácteos",
        "Nut-Free": "Sin Nueces",
        Halal: "Halal",
        Kosher: "Kosher",
        Keto: "Keto",
        Paleo: "Paleo",
        "Low Carb": "Bajo en Carb."
    }
  },
  Russian: {
    heroTitle: "Что у вас в кладовой?",
    heroSubtitle: "Введите ингредиенты, выберите стиль, и ИИ создаст идеальный рецепт.",
    placeholder: "Введите ингредиент и нажмите Enter...",
    noIngredients: "Ингредиенты не добавлены.",
    yourPantry: "Ваша кладовая",
    browse: "Выбрать из списка",
    selectCuisine: "Выберите Кухню",
    dietaryTitle: "Диетические ограничения",
    generate: "Создать рецепт",
    cooking: "Шеф готовит...",
    failed: "Не удалось создать рецепт. Попробуйте снова.",
    blockedIngredient: "Извините, я не могу создавать рецепты со свининой или беконом.",
    invalidIngredients: "Пожалуйста, введите настоящие съедобные ингредиенты.",
    tweakTitle: "Улучшить рецепт",
    tweakPlaceholder: "напр., 'Сделай острее', 'Меньше масла'...",
    refine: "Улучшить",
    generateAnother: "Создать еще одно блюдо ({cuisine})",
    adjusting: "Корректировка рецепта...",
    curating: "Подбор вкусов...",
    translating: "Перевод рецепта...",
    plating: "Сервировка блюда...",
    history: {
        title: "История",
        empty: "Рецептов пока нет.",
        tweaked: "Изменен"
    },
    recipe: {
        cuisine: "Кухня",
        totalTime: "Всего",
        servings: "Порции",
        calories: "ккал / порция",
        ingredients: "Ингредиенты",
        instructions: "Инструкции",
        kitchenTimer: "Таймер",
        bonAppetit: "Приятного аппетита!"
    },
    commonModal: {
        title: "Основные продукты",
        selected: "ингредиентов выбрано",
        done: "Готово"
    },
    cuisines: {
        Italian: "Итальянская",
        Mexican: "Мексиканская",
        Thai: "Тайская",
        Japanese: "Японская",
        Indian: "Индийская",
        Mediterranean: "Средиземноморская",
        American: "Американская",
        French: "Французская",
        Chinese: "Китайская",
        Greek: "Греческая"
    },
    dietaryOptions: {
        Vegetarian: "Вегетарианское",
        Vegan: "Веганское",
        Pescatarian: "Пескетарианское",
        "Gluten-Free": "Без глютена",
        "Dairy-Free": "Без лактозы",
        "Nut-Free": "Без орехов",
        Halal: "Халяль",
        Kosher: "Кошерное",
        Keto: "Кето",
        Paleo: "Палео",
        "Low Carb": "Низкоуглеводное"
    }
  }
};

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>(CuisineType.Italian);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('English');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  
  // Get current translations
  const t = TRANSLATIONS[selectedLanguage];
  
  // Recipe & History State
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modification State
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const validateIngredients = (items: string[]) => {
    const porkKeywords = [
      'pork', 'bacon', 'ham', 'lard', 'prosciutto', 'pancetta', 'chorizo', 'salami', 'pepperoni', 'sausage',
      'cerdo', 'tocino', 'jamón', 'manteca', 'chorizo', 'salchicha',
      'свинина', 'бекон', 'ветчина', 'сало', 'колбаса', 'сосиски'
    ];

    const hasPork = items.some(item => 
      porkKeywords.some(keyword => item.toLowerCase().includes(keyword.toLowerCase()))
    );

    if (hasPork) {
      setError(t.blockedIngredient);
      return false;
    }

    // Basic "realness" check: length and characters
    const isReal = items.every(item => {
      const trimmed = item.trim();
      return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Zа-яА-Я\s\-\(\),]+$/.test(trimmed);
    });

    if (!isReal) {
      setError(t.invalidIngredients);
      return false;
    }

    return true;
  };

  // Helper to add to history
  const addToHistory = (newRecipe: Recipe, type: 'generated' | 'modification', prompt?: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      recipe: newRecipe,
      timestamp: Date.now(),
      type,
      prompt
    };
    setHistory(prev => [newItem, ...prev]);
  };

  // Auto-translate effect
  useEffect(() => {
    const handleTranslation = async () => {
        if (!recipe || loading || isModifying || isTranslating) return;
        
        if (recipe.language !== selectedLanguage) {
            setIsTranslating(true);
            setError(null);
            try {
                const translatedRecipe = await translateRecipe(recipe, selectedLanguage, false);
                setRecipe(translatedRecipe);
            } catch (err) {
                console.error("Translation failed", err);
            } finally {
                setIsTranslating(false);
            }
        }
    };

    handleTranslation();
  }, [selectedLanguage, recipe, loading, isModifying, isTranslating]);

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction) 
        ? prev.filter(r => r !== restriction) 
        : [...prev, restriction]
    );
  };

  const performFullGeneration = async (genParams: any) => {
    setLoading(true);
    setIsImageLoading(true);
    setError(null);
    setRecipe(null);
    setRecipeImage(null);
    setModificationPrompt('');

    try {
      const result = await generateRecipe(genParams);
      setRecipe(result);
      addToHistory(result, 'generated');
      setLoading(false); // Text is done

      // Check if the recipe is valid (not a refusal) before generating image
      if (result.steps && result.steps.length > 0 && result.ingredients && result.ingredients.length > 0) {
        try {
          const imageUrl = await generateRecipeImage(
            result.title, 
            result.description, 
            result.steps.map(s => s.instruction)
          );
          setRecipeImage(imageUrl);
        } catch (imgErr) {
          console.error("Image generation failed", imgErr);
        } finally {
          setIsImageLoading(false);
        }
      } else {
        setIsImageLoading(false);
      }
    } catch (err) {
      setError(t.failed);
      setLoading(false);
      setIsImageLoading(false);
    }
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    if (!validateIngredients(ingredients)) return;
    
    performFullGeneration({ 
      ingredients, 
      cuisine: selectedCuisine,
      dietaryRestrictions,
      avoidTitles: [],
      language: selectedLanguage,
      isMock: false 
    });
  };

  const handleRegenerate = () => {
    if (ingredients.length === 0) return;
    if (!validateIngredients(ingredients)) return;
    
    const cuisineToUse = recipe ? recipe.cuisine : selectedCuisine;
    const avoidTitles = history.map(h => h.recipe.title);
    
    performFullGeneration({ 
      ingredients, 
      cuisine: cuisineToUse,
      dietaryRestrictions,
      avoidTitles,
      language: selectedLanguage,
      isMock: false
    });
  };

  const handleModify = async () => {
    if (!recipe || !modificationPrompt.trim()) return;

    // Check for blocked keywords in modification prompt
    const porkKeywords = [
      'pork', 'bacon', 'ham', 'lard', 'prosciutto', 'pancetta', 'chorizo', 'salami', 'pepperoni', 'sausage',
      'cerdo', 'tocino', 'jamón', 'manteca', 'chorizo', 'salchicha',
      'свинина', 'бекон', 'ветчина', 'сало', 'колбаса', 'сосиски'
    ];
    
    const hasPork = porkKeywords.some(keyword => modificationPrompt.toLowerCase().includes(keyword.toLowerCase()));
    if (hasPork) {
      setError(t.blockedIngredient);
      return;
    }

    setIsModifying(true);
    setIsImageLoading(true);
    setError(null);

    try {
      const result = await modifyRecipe(recipe, modificationPrompt, selectedLanguage, false);
      setRecipe(result);
      addToHistory(result, 'modification', modificationPrompt);
      setModificationPrompt('');
      
      // Update the image based on modification if valid
      if (result.steps && result.steps.length > 0) {
        try {
          const imageUrl = await generateRecipeImage(
            result.title, 
            result.description, 
            result.steps.map(s => s.instruction)
          );
          setRecipeImage(imageUrl);
        } catch (imgErr) {
          console.error("Image generation failed during modification", imgErr);
        }
      }
    } catch (err) {
      setError("Failed to modify recipe. Please try again.");
    } finally {
      setIsModifying(false);
      setIsImageLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setRecipe(item.recipe);
    setIngredients(item.recipe.ingredients.map(i => i.name.split('(')[0].trim())); 
    setSelectedCuisine(item.recipe.cuisine);
    setIsHistoryOpen(false);
    // Note: We might want to regenerate the image for history items if we don't store it
    setRecipeImage(null);
    setIsImageLoading(true);
    generateRecipeImage(
      item.recipe.title, 
      item.recipe.description, 
      item.recipe.steps.map(s => s.instruction)
    )
        .then(url => setRecipeImage(url))
        .finally(() => setIsImageLoading(false));
  };

  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);
  
  const getCuisineDisplayName = (cuisineKey: string) => {
      return t.cuisines[cuisineKey as keyof typeof t.cuisines] || cuisineKey;
  };

  const isBusy = loading || isModifying || isTranslating;
  const loadingLabel = loading ? t.cooking : (isModifying ? t.adjusting : t.translating);

  return (
    <div className="min-h-screen bg-cream selection:bg-sage/20 selection:text-charcoal font-sans pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-cream-dark">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-charcoal hover:text-sage transition-colors cursor-pointer" onClick={() => window.location.reload()}>
            <span className="font-serif font-bold text-xl tracking-tight">Ingrediently</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative hidden sm:block">
               <button 
                  onClick={toggleLanguageMenu}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-cream-dark text-xs font-medium text-charcoal hover:border-sage transition-colors cursor-pointer"
               >
                  <Globe size={14} />
                  <span>{selectedLanguage}</span>
               </button>
               
               <AnimatePresence>
                {isLanguageMenuOpen && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-cream-dark overflow-hidden z-50"
                   >
                     {['English', 'Spanish', 'Russian'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                              setSelectedLanguage(lang as Language);
                              setIsLanguageMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-cream transition-colors ${selectedLanguage === lang ? 'font-bold text-sage' : 'text-charcoal'}`}
                        >
                          {lang}
                        </button>
                     ))}
                   </motion.div>
                )}
               </AnimatePresence>
             </div>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="p-2 text-charcoal hover:bg-white hover:text-sage rounded-full transition-all border border-transparent hover:border-cream-dark relative"
              title="History"
            >
              <History size={20} />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-sage rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-12">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {t.heroTitle}
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {t.heroSubtitle}
          </p>
        </motion.div>

        {/* Controls Section */}
        <div className="space-y-10 mb-16">
          <section className="flex flex-col items-center gap-4">
            <IngredientInput 
                ingredients={ingredients} 
                setIngredients={setIngredients} 
                placeholder={t.placeholder}
                emptyText={t.noIngredients}
                title={t.yourPantry}
            />
            <button
              onClick={() => setIsIngredientsModalOpen(true)}
              className="flex items-center gap-2 text-sage-dark font-medium text-sm hover:bg-white hover:shadow-sm px-4 py-2 rounded-full transition-all border border-transparent hover:border-sage/20"
            >
              <LayoutGrid size={16} />
              {t.browse}
            </button>
          </section>

          <div className="grid md:grid-cols-1 gap-8">
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider text-center md:text-left">
                {t.selectCuisine}
              </h3>
              <CuisineSelector 
                selectedCuisine={selectedCuisine} 
                onSelect={setSelectedCuisine}
                translations={t.cuisines}
              />
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider text-center md:text-left">
                {t.dietaryTitle}
              </h3>
              <DietarySelector
                selectedRestrictions={dietaryRestrictions}
                toggleRestriction={toggleDietaryRestriction}
                translations={t.dietaryOptions}
              />
            </section>
          </div>

          <div className="flex flex-col items-center gap-10 pt-4">
            <button
              onClick={handleGenerate}
              disabled={ingredients.length === 0 || isBusy}
              className={`
                group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300
                ${ingredients.length === 0 || isBusy 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-charcoal text-white hover:bg-sage hover:shadow-sage/30 hover:-translate-y-1'
                }
              `}
            >
              {isBusy ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>{loadingLabel}</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className={ingredients.length > 0 ? "text-yellow-200" : ""} />
                  <span>{t.generate}</span>
                </>
              )}
            </button>

            {/* Generated Image Section */}
            <AnimatePresence>
              {(recipeImage || isImageLoading) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-cream-dark overflow-hidden relative"
                >
                  {isImageLoading ? (
                    <div className="aspect-video bg-cream flex flex-col items-center justify-center text-sage">
                       <Utensils size={48} className="animate-pulse mb-4" />
                       <span className="font-medium text-charcoal/60">{t.plating}</span>
                    </div>
                  ) : recipeImage && (
                    <img 
                      src={recipeImage} 
                      alt={recipe?.title || "Recipe Image"} 
                      className="w-full h-auto object-cover aspect-video"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl text-center mb-8 border border-red-100"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Display */}
        <AnimatePresence mode="wait">
          {recipe && !isBusy && (
             <div className="mb-20 space-y-8">
               <RecipeCard recipe={recipe} labels={t.recipe} />
               
               {/* Modification & Regenerate Actions */}
               <div className="grid gap-6">
                 {/* Modification Interface */}
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white rounded-2xl p-6 shadow-lg border border-cream-dark"
                 >
                   <h3 className="font-serif text-lg font-bold text-charcoal mb-3 flex items-center gap-2">
                     <Wand2 size={18} className="text-sage" />
                     {t.tweakTitle}
                   </h3>
                   <div className="flex flex-col sm:flex-row gap-3">
                     <input
                       type="text"
                       value={modificationPrompt}
                       onChange={(e) => setModificationPrompt(e.target.value)}
                       placeholder={t.tweakPlaceholder}
                       className="flex-1 px-4 py-3 rounded-xl border border-cream-dark focus:border-sage focus:ring-1 focus:ring-sage outline-none bg-cream/50"
                       onKeyDown={(e) => e.key === 'Enter' && handleModify()}
                     />
                     <button 
                       onClick={handleModify}
                       disabled={!modificationPrompt.trim()}
                       className="bg-charcoal text-white px-6 py-3 rounded-xl font-medium hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                     >
                       <span>{t.refine}</span>
                       <Send size={16} />
                     </button>
                   </div>
                 </motion.div>

                 {/* Regenerate Button */}
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                 >
                    <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-2 text-charcoal bg-white border border-cream-dark hover:border-sage hover:text-sage px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-medium"
                    >
                        <RefreshCcw size={18} />
                        {t.generateAnother.replace('{cuisine}', getCuisineDisplayName(recipe.cuisine))}
                    </button>
                 </motion.div>
               </div>
             </div>
          )}
          
          {/* Loading Skeleton / Illustration */}
          {isBusy && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-20 text-sage/50"
             >
                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-sage/20"></div>
                  <ChefHat size={64} className="relative z-10 animate-bounce text-sage" />
                </div>
                <p className="mt-8 text-lg font-serif text-charcoal">
                  {loadingLabel}
                </p>
             </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Modals & Drawers */}
      <CommonIngredientsModal 
        isOpen={isIngredientsModalOpen} 
        onClose={() => setIsIngredientsModalOpen(false)}
        ingredients={ingredients}
        setIngredients={setIngredients}
        language={selectedLanguage}
        labels={t.commonModal}
      />
      
      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectRecipe={handleSelectHistoryItem}
        labels={t.history}
      />
    </div>
  );
};

export default App;