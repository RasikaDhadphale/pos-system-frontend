import React, { useCallback } from 'react';
import { DollarSign, ListChecks } from 'lucide-react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { OrderCheck } from '../../types/types';

export const OpenChecksScreen: React.FC = () => {
    const { openChecks } = useAppState();
    const dispatch = useAppDispatch();
    
    const handleOpenPaymentModal = useCallback((check: OrderCheck) => {
        dispatch({ type: 'SET_MODAL', payload: { type: 'payment', check } });
    }, [dispatch]);
    
    const handleEditCheck = useCallback((check: OrderCheck) => {
        dispatch({ 
            type: 'START_NEW_ORDER_SESSION', 
            payload: { 
                table: check.tableNumber, 
                covers: check.covers, 
                check: check
            } 
        });
    }, [dispatch]);

    return (
        <div className="flex flex-col h-full p-4 bg-white rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                <ListChecks className="mr-2" /> Open Checks ({openChecks.length})
            </h2>
            <div className="flex-grow overflow-y-auto space-y-4"> 
                {openChecks.length === 0 ? (
                    <div className="text-center p-10 text-gray-500 italic">
                        No orders are currently open. Start a new order!
                    </div>
                ) : (
                    openChecks.map((check: OrderCheck) => (
                        <div 
                            key={check.orderId} 
                            onClick={(e: React.MouseEvent) => {
                                // Ignore click if it originated from a button inside
                                if ((e.target as HTMLElement).closest('button')) return; 
                                handleEditCheck(check);
                            }}
                            className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center transition hover:shadow-md cursor-pointer"
                        >
                            <div className="flex-grow">
                                <p className="font-semibold text-lg text-indigo-700">Check #{check.orderId}</p>
                                <p className="text-sm text-gray-600">Table: {check.tableNumber} | Covers: {check.covers}</p>
                                <p className="text-xs text-gray-400">Time: {check.timestamp.toLocaleTimeString('en-GB', {hour: '2-digit',minute: '2-digit',hour12: false})}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <p className="text-lg font-bold text-green-600">${check.grandTotal.toFixed(2)}</p> 
                                <button
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleOpenPaymentModal(check); 
                                    }}
                                    className="flex items-center text-sm bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition shadow"
                                >
                                    <DollarSign size={16} className="mr-1" /> Close Check
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
