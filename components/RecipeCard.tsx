import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, Flame, ChefHat, CheckCircle2 } from 'lucide-react';
import Timer from './Timer';
import { motion } from 'framer-motion';

export interface RecipeLabels {
  cuisine: string;
  totalTime: string;
  servings: string;
  calories: string;
  ingredients: string;
  instructions: string;
  kitchenTimer: string;
  bonAppetit: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  labels: RecipeLabels;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, labels }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-xl shadow-sage/10 overflow-hidden border border-cream-dark"
    >
      <div className="bg-sage/10 p-8 border-b border-sage/10">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 text-sage-dark font-medium text-sm mb-3 uppercase tracking-wider">
            <ChefHat size={16} />
            {recipe.cuisine} {labels.cuisine}
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
            {recipe.title}
          </h2>
          <p className="text-charcoal-light text-lg leading-relaxed">
            {recipe.description}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-sage/10">
          <div className="flex items-center gap-2 text-charcoal">
            <Clock size={18} className="text-sage" />
            <span className="font-medium">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
            <span className="text-sm text-gray-500">({labels.totalTime})</span>
          </div>
          <div className="flex items-center gap-2 text-charcoal">
            <Users size={18} className="text-sage" />
            <span className="font-medium">{recipe.servings} {labels.servings}</span>
          </div>
          <div className="flex items-center gap-2 text-charcoal">
            <Flame size={18} className="text-sage" />
            <span className="font-medium">{recipe.caloriesPerServing} {labels.calories}</span>
          </div>
        </motion.div>
      </div>

      <div className="p-8 grid md:grid-cols-3 gap-8">
        {/* Ingredients Column */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <h3 className="font-serif text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
            {labels.ingredients}
          </h3>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-cream transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-sage mt-2 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-charcoal">{ing.name}</span>
                  <span className="text-sm text-gray-500">{ing.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Steps Column */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <h3 className="font-serif text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
            {labels.instructions}
          </h3>
          <div className="space-y-6">
            {recipe.steps.map((step) => (
              <div key={step.stepNumber} className="relative pl-8 pb-2 group">
                 {/* Connecting Line */}
                 {step.stepNumber !== recipe.steps.length && (
                    <div className="absolute left-[11px] top-8 bottom-[-16px] w-px bg-cream-dark group-hover:bg-sage/30 transition-colors" />
                 )}
                
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-cream border border-sage/40 flex items-center justify-center text-xs font-bold text-sage-dark">
                  {step.stepNumber}
                </div>
                
                <div className="bg-white rounded-xl p-4 border border-cream-dark hover:border-sage/30 hover:shadow-md transition-all">
                  <p className="text-charcoal leading-relaxed mb-3">
                    {step.instruction}
                  </p>
                  {step.timerSeconds && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-medium text-sage-dark uppercase tracking-wider">{labels.kitchenTimer}</span>
                      <Timer durationSeconds={step.timerSeconds} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <div className="pl-8 pt-2">
              <div className="flex items-center gap-2 text-sage font-bold">
                <CheckCircle2 size={24} />
                <span>{labels.bonAppetit}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;