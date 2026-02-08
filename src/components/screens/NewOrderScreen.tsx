import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppState } from '../../context/AppContext';
import { OrderCheck, MenuItem } from '../../types/types';
import { MenuTabs } from './MenuTabs';
import { DishButtons } from './DishButtons';
import { OrderSummary } from './OrderSummary';
import { postNewOrder } from '../../api_service_functions/apiService';
import { printKitchenCopy, printOrderCheck } from './utils';

interface NewOrderScreenProps {
    tableNumber: number;
    covers: number;
    editingCheck: OrderCheck | null;
}

function generateOrderId(): number {
    // Smallest 8-digit number
    const min_value = 10000000;
    // Largest 8-digit number
    const max_value = 99999999;

    // Calculate the range size (MAX - MIN + 1)
    const range = max_value - min_value + 1;

    // Formula to get a random integer within a specific range:
    // Math.floor(Math.random() * range) + MIN_VALUE
    const randomId = Math.floor(Math.random() * range) + min_value;

    return randomId;
}


export const NewOrderScreen: React.FC<NewOrderScreenProps> = ({ tableNumber, covers, editingCheck }) => {

  const processDishes = (menuData:MenuItem[]) => {
    // const grouped = menuData.reduce((acc : any, item: { category: any; }) => {
    //   const category = item.category;
    //   if (!acc[category]) {
    //     acc[category] = [];
    //   }
    //   acc[category].push(item);
    //   return acc;
    // }, {});
    // const keys = Object.keys(grouped);

    const keys= Array.from(new Set(
        menuData.map(dish => dish.category).filter(Boolean)
    )) as string[];

    setCategories(keys);
    
    setActiveCategory(keys[0]);

  }

  
  const dispatch = useAppDispatch();
  const { menuData } = useAppState();
  const [categories, setCategories] =useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  // Initialize order items from an existing check if editing
  const [orderItems, setOrderItems] = useState<MenuItem[]>(() =>
    editingCheck 
      ? editingCheck.items.map((item) => ({ 
          dishId: item.dishId,
          dishName: item.dishName,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
          quantity: item.quantity
      })) 
      : []
  );

  useEffect(() => {
    if (menuData && menuData.length > 0) {
      processDishes(menuData);
    }
  }, [menuData]);

  const newItemsOnly = useMemo(() => {
    if (!editingCheck) return orderItems; // If not editing, everything is new

    return orderItems.map(currentItem => {
      // Find the item in the original check
      const originalItem = editingCheck.items.find(i => i.dishId === currentItem.dishId);
      const originalQty = originalItem ? originalItem.quantity : 0;
      
      // Calculate how many were added in this session
      const addedQty = currentItem.quantity - originalQty;

      if (addedQty > 0) {
        return { ...currentItem, quantity: addedQty };
      }
      return null;
    }).filter((item): item is MenuItem => item !== null);
  }, [orderItems, editingCheck]);

  const hasNewItems = newItemsOnly.length > 0;

  const [isServiceChargeApplied, setIsServiceChargeApplied] = useState<boolean>(
    () => editingCheck ? editingCheck.isServiceChargeApplied : true
  );
    
  const [isPrinting, setIsPrinting] = useState<boolean>(false); 

  const isUpdateMode: boolean = !!editingCheck;

  // --- Order Calculations (Memoized) ---
  const subTotal = useMemo(() => {
    return orderItems.reduce((acc, item) => {
      return acc + (item.price * (item.quantity || 1));
    }, 0);
  }, [orderItems]);
  const serviceCharge: number = useMemo(() => isServiceChargeApplied ? subTotal * 0.10 : 0, [subTotal, isServiceChargeApplied]);
  const grandTotal: number = useMemo(() => subTotal + serviceCharge, [subTotal, serviceCharge]);

  const addCourseBreak = useCallback(() => {
    const breakItem: MenuItem = {
      dishId: -1,
      dishName: "**************",
      price: 0,
      quantity: 1
    };
    setOrderItems((prev) => [...prev, breakItem]);
  }, []);

  const addItemToOrder = useCallback((menuItem: MenuItem) => {
    setOrderItems((prev) => {
      const existingItem = prev.find(item => item.dishId === menuItem.dishId);

      if (existingItem) {
        return prev.map(item =>
          item.dishId === menuItem.dishId
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...menuItem, quantity: 1 }];
      }
    });
  }, []);

  const removeItemFromOrder = useCallback((id: number, index:number) => {
    if(id === -1)
    {
      setOrderItems((prev) => prev.filter((_, i) => i !== index));
    }
    else {
      setOrderItems((prev) => {
        const existingItem = prev.find(item => item.dishId === id);

        if (existingItem && existingItem.quantity > 1) {
          return prev.map(item =>
            item.dishId === id 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          );
        } else {
          return prev.filter(item => item.dishId !== id);
        }
      });
    }
    
  }, []);

  const handleOpenEditModal = useCallback(() => {
    dispatch({ 
        type: 'SET_MODAL', 
        payload: { 
            type: 'editTableCover', 
            initialTable: tableNumber, 
            initialCovers: covers 
        } 
    });
  }, [dispatch, tableNumber, covers]);



  // Logic for processing the order before dispatching a global state change
  const processOrder = useCallback(async (): Promise<OrderCheck | null> => {
    if (orderItems.length === 0) {
      dispatch({ type: 'SET_MESSAGE', payload: '🛒 Please add items to the order before proceeding.' });
      setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: null }), 3000);
      return null;
    }

    setIsPrinting(true);

    const orderId: number = editingCheck?.orderId || generateOrderId();

    const orderPayload: OrderCheck = {
      orderId: orderId, // Use orderId as the unique id for the check
      timestamp: new Date(),
      tableNumber: tableNumber,
      covers: covers,           
      subTotal: subTotal,
      serviceCharge: serviceCharge,
      isServiceChargeApplied: isServiceChargeApplied, 
      grandTotal: grandTotal,
      status: 'open',
      items: orderItems,
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsPrinting(false);
    
    return orderPayload;
  }, [orderItems, editingCheck, tableNumber, covers, subTotal, serviceCharge, grandTotal, isServiceChargeApplied, isUpdateMode, dispatch]);
  
  // Action 1: Print (Send to Kitchen and open/update check)
  const handleSend = async () => {
      const orderData = await processOrder();
      if (orderData) {

        const cleanItems = orderData.items.filter(item => item.dishId > 0);
        // Dispatch action to update the global openChecks array

        const finalItemData : MenuItem[] = cleanItems.map(item => ({
          dishId: item.dishId,
          dishName: item.dishName, 
          price: item.price,
          quantity: item.quantity,
        }));

        const finalOrderData : OrderCheck = {
          orderId: orderData.orderId,
          timestamp: orderData.timestamp,
          tableNumber: orderData.tableNumber,
          covers: orderData.covers,
          subTotal:orderData.subTotal,
          serviceCharge: orderData.serviceCharge,
          grandTotal: orderData.grandTotal,
          isServiceChargeApplied: orderData.isServiceChargeApplied,
          status: orderData.status,
          items: finalItemData
        }

        dispatch({ type: isUpdateMode ? 'UPDATE_OPEN_CHECK' : 'ADD_OPEN_CHECK', payload: orderData });

        await postNewOrder("api/Orders", finalOrderData)

        if(isUpdateMode){
          
          if (hasNewItems) {
            printKitchenCopy(newItemsOnly, orderData.tableNumber);
          } else {
            printOrderCheck(finalOrderData, false);
          }

        } else {
          printKitchenCopy(orderData.items, orderData.tableNumber);
        }
        
        const actionText = isUpdateMode ? 'Updated' : 'Sent & Opened';
        const message = `✅ Order ${actionText} for Table ${orderData.tableNumber} totaling $${orderData.grandTotal}!`;
        dispatch({ type: 'SET_MESSAGE', payload: message });     

        setTimeout(() => {
            dispatch({ type: 'SET_MESSAGE', payload: null });
            dispatch({ type: 'FINALIZE_NEW_ORDER_SESSION' });
        }, 5000); 
      }
  };

  // Action 2: Pay and Print (Send to Kitchen, open/update check, then immediately open payment modal)
  const handlePay = async () => {
    const payload = await processOrder();
    if (payload) {
      
        // Dispatch action to update the global openChecks array
        dispatch({ type: isUpdateMode ? 'UPDATE_OPEN_CHECK' : 'ADD_OPEN_CHECK', payload });
        
        // Open payment modal for the newly created/updated check
        dispatch({ type: 'SET_MODAL', payload: { type: 'payment', check: payload } });
        
        const message = `⏳ Check Updated/Opened for Table ${payload.tableNumber} (£${payload.grandTotal}). Awaiting Payment.`;
        dispatch({ type: 'SET_MESSAGE', payload: message });

        setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: null }), 3000); 
    }
  };


  const disableButtons: boolean = isPrinting || orderItems.length === 0;

  return (
    <div className="flex gap-4 h-full">
      {/* Left Section (Menu Tabs & Dishes) */}
      <div className="w-3/4 flex flex-col bg-white rounded-t-xl shadow-xl overflow-hidden h-full">
        <MenuTabs
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          addCourseBreak={addCourseBreak}
        />
        <div className="flex-grow overflow-hidden">
          <DishButtons
            menuData={menuData}
            category={activeCategory}
            addItemToOrder={addItemToOrder}
          />
        </div>
      </div>

      {/* Right Section (Order Summary) */}
      <div className="w-1/4 flex flex-col bg-white rounded-t-xl shadow-xl">
        <div className="flex-col h-[calc(100%-69px)]">
            <OrderSummary
              items={orderItems}
              subTotal={subTotal}
              serviceCharge={serviceCharge}
              grandTotal={grandTotal}
              removeItem={removeItemFromOrder}
              isServiceChargeApplied={isServiceChargeApplied}
              setIsServiceChargeApplied={setIsServiceChargeApplied}
              tableNumber={tableNumber}     
              covers={covers}    
              onOpenEditModal={handleOpenEditModal}        
            />
        </div>
        
        {/* Action Buttons */}
        <div className="p-2 bg-white shadow-xl">
            {isPrinting ? (
                <div className="w-full flex items-center justify-center px-4 py-3 text-white font-semibold rounded-lg bg-gray-400">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Order to Kitchen...
                </div>
            ) : (
                <div className="flex space-x-2"> 
                    {/* PAY BUTTON */}
                    <button
                      onClick={handlePay}
                      disabled={disableButtons}
                      className={`
                        flex-1 flex items-center justify-center 
                        px-4 py-3 md:px-3 md:px-2
                        text-sm lg:text-base xl:text-lg 
                        text-white font-semibold rounded-lg transition-all
                        ${disableButtons
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      Pay
                    </button>
                    {/* PRINT/UPDATE BUTTON */}
                    <button
                      onClick={handleSend}
                      disabled={disableButtons}
                      className={`
                        flex-1 flex items-center justify-center
                        px-4 py-3 md:px-3 md:px-2
                        text-sm lg:text-base xl:text-lg 
                        text-white font-semibold rounded-lg transition-all
                        ${disableButtons
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                        }
                      `}
                    >
                      {hasNewItems ? "Send" : "Print"}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

