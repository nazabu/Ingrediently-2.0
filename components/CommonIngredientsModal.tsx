import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

export interface CommonModalLabels {
    title: string;
    selected: string;
    done: string;
}

interface CommonIngredientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  language: Language;
  labels: CommonModalLabels;
}

const INGREDIENT_DATA: Record<Language, Record<string, string[]>> = {
  English: {
    "Vegetables": ["Onion", "Garlic", "Tomato", "Potato", "Carrot", "Bell Pepper", "Broccoli", "Spinach", "Mushroom", "Zucchini"],
    "Fruits": ["Lemon", "Lime", "Avocado", "Apple", "Banana", "Berry"],
    "Proteins": ["Chicken", "Beef", "Eggs", "Tofu", "Salmon", "Shrimp", "Ground Beef"],
    "Dairy": ["Milk", "Butter", "Cheese", "Yogurt", "Cream", "Parmesan"],
    "Pantry": ["Rice", "Pasta", "Flour", "Sugar", "Olive Oil", "Vinegar", "Soy Sauce", "Honey"],
    "Spices": ["Salt", "Black Pepper", "Cumin", "Paprika", "Basil", "Oregano", "Chili Powder", "Cinnamon"]
  },
  Spanish: {
    "Verduras": ["Cebolla", "Ajo", "Tomate", "Patata", "Zanahoria", "Pimiento", "Brócoli", "Espinaca", "Champiñón", "Calabacín"],
    "Frutas": ["Limón", "Lima", "Aguacate", "Manzana", "Plátano", "Baya"],
    "Proteínas": ["Pollo", "Ternera", "Huevos", "Tofu", "Salmón", "Camarones", "Carne Molida"],
    "Lácteos": ["Leche", "Mantequilla", "Queso", "Yogur", "Nata", "Parmesano"],
    "Despensa": ["Arroz", "Pasta", "Harina", "Azúcar", "Aceite Oliva", "Vinagre", "Salsa Soja", "Miel"],
    "Especias": ["Sal", "Pimienta", "Comino", "Pimentón", "Albahaca", "Orégano", "Chile", "Canela"]
  },
  Russian: {
    "Овощи": ["Лук", "Чеснок", "Помидор", "Картофель", "Морковь", "Перец", "Брокколи", "Шпинат", "Грибы", "Кабачок"],
    "Фрукты": ["Лимон", "Лайм", "Авокадо", "Яблоко", "Банан", "Ягоды"],
    "Белки": ["Курица", "Говядина", "Яйца", "Тофу", "Лосось", "Креветки", "Фарш"],
    "Молочные": ["Молоко", "Масло", "Сыр", "Йогурт", "Сливки", "Пармезан"],
    "Кладовая": ["Рис", "Паста", "Мука", "Сахар", "Оливк. масло", "Уксус", "Соевый соус", "Мед"],
    "Специи": ["Соль", "Перец", "Тмин", "Паприка", "Базилик", "Орегано", "Чили", "Корица"]
  }
};

const CommonIngredientsModal: React.FC<CommonIngredientsModalProps> = ({ isOpen, onClose, ingredients, setIngredients, language, labels }) => {
  
  const currentIngredients = INGREDIENT_DATA[language];

  const toggleIngredient = (item: string) => {
    if (ingredients.includes(item)) {
      setIngredients(ingredients.filter(i => i !== item));
    } else {
      setIngredients([...ingredients, item]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto max-w-3xl max-h-[85vh] w-[95%] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-cream-dark flex justify-between items-center bg-cream/50">
              <h2 className="text-2xl font-serif font-bold text-charcoal">{labels.title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-cream-dark rounded-full transition-colors">
                <X size={24} className="text-charcoal" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {Object.entries(currentIngredients).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-bold text-sage-dark mb-4 uppercase tracking-wider text-sm border-b border-cream-dark/50 pb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(items as string[]).map((item) => {
                        const isSelected = ingredients.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => toggleIngredient(item)}
                            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                              isSelected 
                                ? 'bg-sage/10 border-sage text-charcoal shadow-inner ring-1 ring-sage' 
                                : 'bg-cream border border-transparent hover:border-sage/30 text-gray-600'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-sage border-sage text-white' : 'border-gray-300 bg-white'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className="text-sm font-medium">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-cream-dark bg-cream/50 flex justify-between items-center">
               <span className="text-sm text-gray-500">
                 {ingredients.length} {labels.selected}
               </span>
               <button 
                onClick={onClose}
                className="bg-charcoal text-white px-8 py-3 rounded-xl font-bold hover:bg-sage transition-colors"
               >
                 {labels.done}
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommonIngredientsModal;