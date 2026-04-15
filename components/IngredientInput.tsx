import React, { useState, KeyboardEvent } from 'react';
import { X, Plus, ShoppingBasket, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  placeholder: string;
  emptyText: string;
  title: string;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients, placeholder, emptyText, title }) => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
      if (!isExpanded) setIsExpanded(true); // Auto expand when adding
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (ingredientToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling the box when clicking delete
    setIngredients(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Input Field */}
      <div className="relative z-10">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-lg bg-white rounded-2xl shadow-sm border border-cream-dark focus:border-sage focus:ring-2 focus:ring-sage/20 outline-none transition-all placeholder:text-gray-400 text-charcoal"
        />
        <button
          onClick={addIngredient}
          disabled={!inputValue.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-sage text-white rounded-xl hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* The Box */}
      <AnimatePresence mode="popLayout">
        {ingredients.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl border border-cream-dark shadow-sm overflow-hidden"
          >
            {/* Header / Toggle */}
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between px-5 py-3 bg-sage/5 cursor-pointer hover:bg-sage/10 transition-colors select-none"
            >
                <div className="flex items-center gap-2 text-sage-dark font-medium text-sm uppercase tracking-wider">
                    <ShoppingBasket size={16} />
                    <span>{title} ({ingredients.length})</span>
                </div>
                <button className="text-sage-dark p-1 rounded-full hover:bg-sage/20 transition-colors">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
            </div>

            {/* Content Area */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                    >
                        <div className="p-4 flex flex-wrap gap-2 border-t border-cream-dark/50">
                             {ingredients.map(ing => (
                                <motion.span
                                  layout
                                  key={ing}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-sage/30 text-charcoal shadow-sm hover:border-sage transition-colors"
                                >
                                  {ing}
                                  <button
                                    onClick={(e) => removeIngredient(ing, e)}
                                    className="ml-2 p-0.5 text-sage hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </motion.span>
                             ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      {ingredients.length === 0 && (
         <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 italic text-sm py-2"
         >
            {emptyText}
         </motion.p>
      )}
    </div>
  );
};

export default IngredientInput;