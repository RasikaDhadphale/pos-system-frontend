import React from 'react';

interface MenuTabsProps {
    categories: string[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    addCourseBreak?: () => void;
}

export const MenuTabs: React.FC<MenuTabsProps> = React.memo(({ categories, activeCategory, setActiveCategory, addCourseBreak }) => (
  // <div className="flex overflow-x-auto border-b border-gray-200 bg-white sticky top-0 z-10">
  <div className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 z-10">
    {/* Category List */}
    <div className="flex overflow-x-auto no-scrollbar">
      {categories.map((category: string) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`
            flex-shrink-0 px-4 py-3 text-sm font-medium transition-all duration-200
            ${activeCategory === category
              ? 'border-b-4 border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>

    <button
        onClick={addCourseBreak}
        className="flex-shrink-0 mx-2 px-3 py-1.5 bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-600 rounded-md text-xs font-bold transition-all border border-gray-200 flex items-center gap-1 shadow-sm"
        title="Insert Course Separator"
      >
        <span className="text-lg leading-none">+</span>
        Break
    </button>
  </div>

));
MenuTabs.displayName = 'MenuTabs';
