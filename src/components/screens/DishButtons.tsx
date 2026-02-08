import React from 'react';
import { MenuItem } from '../../types/types';

interface DishButtonsProps {
    menuData: MenuItem[];
    category: string;
    addItemToOrder: (item: MenuItem) => void;
}

export const DishButtons: React.FC<DishButtonsProps> = React.memo(({menuData, category, addItemToOrder }) => {

  const dishes: MenuItem[] = menuData.filter((dish) => dish.category === category) || [];

  return (
    <div className="p-4 flex flex-wrap gap-4 overflow-y-auto h-full content-start">
      {dishes.map((dish: MenuItem) => (
        <button
          key={dish.dishName}
          onClick={() => addItemToOrder(dish)}
          className="flex flex-col items-center justify-center w-32 h-32 text-center p-2 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:border-indigo-400 transition transform hover:-translate-y-0.5"
        >
          {/* <div className="text-indigo-500 mb-1">{React.createElement(dish.icon, { size: 24 })}</div> */}
          <span className="font-semibold text-gray-800 text-base leading-snug">{dish.dishName}</span>
          <span className="text-sm text-gray-500 mt-1">
            {new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(dish.price)}
          </span> 
        </button>
      ))}
      {dishes.length === 0 && (
        <p className="w-full text-center text-gray-500 italic p-10">No items available in this category.</p>
      )}
    </div>
  );
});
DishButtons.displayName = 'DishButtons';
