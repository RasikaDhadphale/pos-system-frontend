import React, { useCallback } from 'react';
import { ClipboardList, ListChecks, Printer } from 'lucide-react';
import { useAppDispatch } from '../../context/AppContext';

export const HomeScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    
    const startOrder = useCallback(() => {
        dispatch({ type: 'SET_MODAL', payload: { type: 'tableCoverInput' } });
    }, [dispatch]);
    
    const viewOpenChecks = useCallback(() => {
        dispatch({ type: 'SET_VIEW', payload: 'openChecks' });
    }, [dispatch]);

    const viewClosedChecks = useCallback(() => {
        dispatch({ type: 'SET_VIEW', payload: 'closedChecks' });
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col space-y-8">
                <div className="flex space-x-8">
                    <button
                        onClick={startOrder} 
                        className="flex flex-col items-center justify-center p-10 w-64 h-64 bg-indigo-500 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition transform hover:scale-105"
                    >
                        <ClipboardList size={64} />
                        <span className="mt-4 text-2xl font-bold">New Order</span>
                    </button>
                    <button
                        onClick={viewOpenChecks}
                        className="flex flex-col items-center justify-center p-10 w-64 h-64 bg-teal-500 text-white rounded-2xl shadow-xl hover:bg-teal-600 transition transform hover:scale-105"
                    >
                        <ListChecks size={64} />
                        <span className="mt-4 text-2xl font-bold">Open Checks</span>
                    </button>
                </div>
                <button
                    onClick={viewClosedChecks}
                    className="flex items-center justify-center space-x-4 w-full h-24 bg-amber-500 text-white rounded-2xl shadow-xl hover:bg-amber-600 transition transform hover:scale-105"
                >
                    <Printer size={48} />
                    <span className="text-2xl font-bold">Reprint Closed Checks</span>
                </button>
            </div>
        </div>
    );
};
