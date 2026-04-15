import React, { useRef, useEffect } from 'react';
import { DietaryRestriction } from '../types';

interface DietarySelectorProps {
  selectedRestrictions: string[];
  toggleRestriction: (restriction: string) => void;
  translations: Record<string, string>;
}

const DietarySelector: React.FC<DietarySelectorProps> = ({ selectedRestrictions, toggleRestriction, translations }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemsRaw = Object.values(DietaryRestriction);
  // Create 3 sets for infinite scrolling: [Buffer, Main, Buffer]
  const items = [...itemsRaw, ...itemsRaw, ...itemsRaw];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Center the scroll view initially to the middle set
    const initializeScroll = () => {
        if (el.scrollWidth > el.clientWidth) {
            const singleSetWidth = el.scrollWidth / 3;
            el.scrollLeft = singleSetWidth;
        }
    }
    
    initializeScroll();
    setTimeout(initializeScroll, 50);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY; 
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const singleSetWidth = el.scrollWidth / 3;
    
    if (el.scrollLeft < singleSetWidth) {
        el.scrollLeft += singleSetWidth;
    } 
    else if (el.scrollLeft >= singleSetWidth * 2) {
        el.scrollLeft -= singleSetWidth;
    }
  };

  return (
    <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto hide-scrollbar py-2 cursor-grab active:cursor-grabbing"
    >
      <div className="flex gap-3 px-1 w-max">
        {items.map((restriction, index) => {
          const isSelected = selectedRestrictions.includes(restriction);
          return (
            <button
              key={`${restriction}-${index}`}
              onClick={() => toggleRestriction(restriction)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ease-out border ${
                isSelected
                  ? 'bg-sage-dark text-white border-sage-dark shadow-md'
                  : 'bg-white text-gray-500 border-cream-dark hover:border-sage hover:text-sage'
              }`}
            >
              {translations[restriction] || restriction}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DietarySelector;