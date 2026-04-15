import React from 'react';
import { X, History, ChevronRight, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from '../types';

export interface HistoryLabels {
  title: string;
  empty: string;
  tweaked: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectRecipe: (item: HistoryItem) => void;
  labels: HistoryLabels;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, history, onSelectRecipe, labels }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-cream-dark"
          >
            <div className="p-6 border-b border-cream-dark flex items-center justify-between bg-cream/50">
              <div className="flex items-center gap-2 text-charcoal">
                <History size={20} />
                <h2 className="font-serif font-bold text-xl">{labels.title}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-cream-dark rounded-full transition-colors text-charcoal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-8">
                  <History size={48} className="mb-4 opacity-20" />
                  <p>{labels.empty}</p>
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectRecipe(item)}
                    className="w-full text-left bg-white border border-cream-dark p-4 rounded-xl hover:border-sage hover:shadow-md transition-all group relative overflow-hidden"
                  >
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                     
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-sage-dark uppercase tracking-wider">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {item.type === 'modification' && (
                             <span className="flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">
                                 <Wand2 size={10} /> {labels.tweaked}
                             </span>
                        )}
                     </div>

                    <h3 className="font-bold text-charcoal mb-1 line-clamp-1 group-hover:text-sage-dark transition-colors">
                        {item.recipe.title}
                    </h3>
                    
                    {item.type === 'modification' && item.prompt && (
                        <p className="text-xs text-gray-500 italic mb-2 line-clamp-2">
                            "{item.prompt}"
                        </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400 font-medium">
                            {item.recipe.cuisine} • {item.recipe.caloriesPerServing} kcal
                        </span>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-sage group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryDrawer;