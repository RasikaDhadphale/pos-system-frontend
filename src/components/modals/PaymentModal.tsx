import React, { useCallback } from 'react';
import { DollarSign, CreditCard, Wallet, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { OrderCheck } from '../../types/types';
import { useAppDispatch, useAppState } from '../../context/AppContext';
import { postNewOrder } from '../../api_service_functions/apiService';

interface PaymentModalProps {
    check: OrderCheck;
    onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ check, onClose }) => {
    const dispatch = useAppDispatch();
    const { closedChecks } = useAppState();
    
    const total = check.grandTotal.toFixed(2); 
    const checkIdDisplay = check.orderId;

    const handlePayment = useCallback(async (method: 'cash' | 'card') => {

        const closePayload: OrderCheck = check;

        closePayload.status = "closed";
        closePayload.paymentMethod = method;

        postNewOrder("api/Orders", closePayload)

        // Update global state via dispatch
        dispatch({ type: 'SET_CLOSED_CHECKS', payload: [...closedChecks, closePayload]})
        dispatch({ type: 'REMOVE_OPEN_CHECK', payload: check.orderId });
        dispatch({ type: 'SET_MODAL', payload: null });
        dispatch({ type: 'FINALIZE_NEW_ORDER_SESSION' });

        const message = `💲 Check ID ${checkIdDisplay} closed for ${check.grandTotal} via ${method}.`;
        dispatch({ type: 'SET_MESSAGE', payload: message });
        setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: null }), 4000);
        
    }, [dispatch, check, checkIdDisplay]);

    return (
        <Modal onClose={onClose}>
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 text-center">
                Close Check #{checkIdDisplay}
            </h3>
            
            <div className="flex justify-center items-center bg-indigo-50 p-4 rounded-lg mb-6">
                <span className="text-xl font-bold text-indigo-800">${total} Due</span>
            </div>
            
            <p className="text-gray-600 mb-4 text-center">Select Payment Method:</p>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handlePayment('cash')}
                    className="flex flex-col items-center p-6 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600 transition transform hover:scale-[1.02]"
                >
                    <Wallet size={40} />
                    <span className="mt-2 text-xl font-bold">Cash</span>
                </button>
                <button
                    onClick={() => handlePayment('card')}
                    className="flex flex-col items-center p-6 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition transform hover:scale-[1.02]"
                >
                    <CreditCard size={40} />
                    <span className="mt-2 text-xl font-bold">Card</span>
                </button>
            </div>
        </Modal>
    );
};

export {};
