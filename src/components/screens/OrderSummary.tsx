import React from 'react';
import { X, ChevronRight, Pencil } from 'lucide-react';
import { MenuItem, OrderItem } from '../../types/types';

interface OrderSummaryProps {
    items: MenuItem[];
    subTotal: number;
    serviceCharge: number;
    grandTotal: number;
    removeItem: (id: number, index:number) => void;
    isServiceChargeApplied: boolean;
    setIsServiceChargeApplied: React.Dispatch<React.SetStateAction<boolean>>;
    tableNumber: number;
    covers: number;
    onOpenEditModal: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = React.memo(({ 
    items, 
    subTotal, 
    serviceCharge, 
    grandTotal, 
    removeItem, 
    isServiceChargeApplied, 
    setIsServiceChargeApplied, 
    tableNumber, 
    covers, 
    onOpenEditModal 
}) => (
  <div className="flex flex-col h-full bg-white rounded-t-xl shadow-xl">
    <div className="p-3 bg-indigo-600 text-white rounded-t-xl flex justify-between items-start"> 
      <div>
        <h2 className="text-lg font-bold">
          Table: {tableNumber} | Covers: {covers}
        </h2>
      </div>
      
      <button
        onClick={onOpenEditModal}
        className="p-1 bg-indigo-700 rounded-full hover:bg-indigo-800 transition shadow-md"
        title="Edit Table and Covers"
      >
        <Pencil size={18} />
      </button>
    </div>
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="justify-center  p-2 overflow-y-auto min-h-0 space-y-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-between text-gray-400 p-3">
            <ChevronRight size={32} className="animate-pulse" />
            <p className="mt-1 text-center text-sm">Select dishes to add.</p>
          </div>
        ) : (
          items.map((item: MenuItem, index:number) => (
            <div
              key={item.dishId === -1 ? `break-${index}` : item.dishId}
              className="grid grid-cols-[30px_1fr_50px_25px] items-center text-sm py-1 border-b border-gray-50 last:border-0"
            >
              {item.dishId === -1 ? (
                <div className="col-span-full flex justify-center">
                  <button onClick={() => removeItem(item.dishId, index)}>
                    <span className="flex-shrink text-center mx-4 text-gray-400 tracking-[0.3em] text-[10px]">
                      {item.dishName}
                    </span>
                  </button>
                </div>                
              ) : (
                <>
                  <span className="font-mono text-gray-500 bg-gray-100 text-center rounded p-0.5">
                    {item.quantity}
                  </span>

                  <span className="font-medium text-gray-700 px-1">
                    {item.dishName}
                  </span>

                  <span className="font-mono text-gray-500 text-right">
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeItem(item.dishId, index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title={`Remove ${item.dishName}`}
                    >
                      <X size={14} />
                    </button> 
                  </div>
                </>
              )}
              
              
            </div>
          ))
        )}
      </div>
    </div>

    <div className="p-2 bg-white border-t border-gray-200">
      <div className="flex justify-between items-center mb-1 text-base">
        <span className="text-gray-700">Subtotal:</span>
        <span className="font-mono text-gray-800">£{subTotal.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between items-center mb-2 text-sm"> 
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isServiceChargeApplied}
              onChange={() => setIsServiceChargeApplied(prev => !prev)}
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className={`text-gray-700 select-none ${!isServiceChargeApplied ? 'opacity-70' : 'opacity-100'}`}>
              Service Charge ({0.10 * 100}%):
            </span>
          </label>
        
        <span className={`font-mono text-gray-600 ${!isServiceChargeApplied ? 'line-through opacity-70' : 'opacity-100'}`}>
          £{serviceCharge.toFixed(2)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-3 text-lg font-bold border-t pt-2 border-gray-300">
        <span className="text-gray-800">Grand Total:</span>
        <span className="text-indigo-600 text-xl font-extrabold">£{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  </div>
));
OrderSummary.displayName = 'OrderSummary';
