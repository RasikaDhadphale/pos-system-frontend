import React, { useCallback, useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import { useAppState, useAppDispatch } from './context/AppContext';
import { HomeScreen } from './components/screens/HomeScreen';
import { OpenChecksScreen } from './components/screens/OpenChecksScreen';
import { NewOrderScreen } from './components/screens/NewOrderScreen';
import { PaymentModal } from './components/modals/PaymentModal';
import { TableCoverInputModal, EditTableCoverModal } from './components/modals/TableCoverBaseModal';
import { MessageBanner } from './components/common/MessageBanner';
import { getAllDishes, getAllOrders } from './api_service_functions/apiService';
import { MenuItem, OrderCheck } from './types/types';
import { ClosedOrdersScreen } from './components/screens/ClosedOrdersScreen';

export const AppContent: React.FC = () => {
    const { view, activeModal, orderMessage, currentTable, currentCovers, editingCheck} = useAppState();
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const loadMenu = async () => {
            try {
                // 1. Fetch data from the API
                const data: MenuItem[] = await getAllDishes("api/Dish");
                
                // 2. Dispatch the action to save it in the global state
                dispatch({
                    type: 'SET_ALL_DISHES',
                    payload: data,
                });
                
            } catch (error) {
                console.error('Failed to fetch menu data:', error);
                // Optionally dispatch an error message
                dispatch({
                    type: 'SET_MESSAGE',
                    payload: 'Failed to load menu. Please check the network.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        const loadOpenChecks = async () => {
            try {
                const orders = await getAllOrders("api/Orders");

                const openOrders: OrderCheck[] = orders
                .filter((order: any) => order.status === 'open')
                .map((order: any) => ({
                        ...order,
                        timestamp: new Date(order.timestamp) // String -> Date object
                    })
                );

                const closedOrders: OrderCheck[] = orders
                .filter((order: any) => order.status === 'closed')
                .map((order: any) => ({
                        ...order,
                        timestamp: new Date(order.timestamp) // String -> Date object
                    })
                );
                
                dispatch({
                    type: 'SET_OPEN_CHECKS',
                    payload: openOrders,
                });
                dispatch({
                    type: 'SET_CLOSED_CHECKS',
                    payload: closedOrders,
                });
            } catch (error) {
                console.error('Failed to fetch open checks data:', error);
                // Optionally dispatch an error message
                dispatch({
                    type: 'SET_MESSAGE',
                    payload: 'Failed to load open checks. Please check the network.',
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadMenu();
        loadOpenChecks();
    }, []);

    
    const handleGlobalHomeClick = useCallback(() => {
        // If coming from a new order session, finalize it first
        if (view === 'newOrder') {
            dispatch({ type: 'FINALIZE_NEW_ORDER_SESSION' });
        }
        dispatch({ type: 'SET_MODAL', payload: null });
        dispatch({ type: 'SET_VIEW', payload: 'home' });
    }, [view, dispatch]);

    const renderView = () => {
        switch (view) {
            case 'newOrder':
                // Guard: Ensure session details exist
                if (currentTable === null || currentCovers === null) {
                    dispatch({ type: 'FINALIZE_NEW_ORDER_SESSION' });
                    return null;
                }
                return (
                    <NewOrderScreen 
                        tableNumber={currentTable}     
                        covers={currentCovers}
                        editingCheck={editingCheck}
                    />
                );
            case 'openChecks':
                return <OpenChecksScreen />;
            case 'closedChecks':
                return <ClosedOrdersScreen/>;
            case 'home':
            default:
                return <HomeScreen />;
        }
    };
    
    const renderModal = () => {
        if (!activeModal) return null;
        
        switch (activeModal.type) {
            case 'payment':
                return (
                    <PaymentModal
                        check={activeModal.check}
                        onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
                    />
                );
            case 'tableCoverInput':
                return (
                    <TableCoverInputModal
                        onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
                    />
                );
            case 'editTableCover':
                return (
                    <EditTableCoverModal
                        onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
                        initialTable={activeModal.initialTable}
                        initialCovers={activeModal.initialCovers}
                    />
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                <p className="ml-4 text-lg text-gray-600">Loading Menu...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
            <div className="max-w-6xl mx-auto h-[90vh] min-h-[600px] relative">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h1 className="text-xl md:text-3xl font-extrabold text-gray-800">
                        Restaurant POS System
                    </h1>
                    
                    {view !== 'home' && (
                        <button 
                            onClick={handleGlobalHomeClick} 
                            className="p-2 md:p-3 bg-indigo-600 rounded-full shadow-lg text-white hover:bg-indigo-700 transition z-10 transform hover:scale-105"
                            title="Go to Home Screen"
                        >
                            <Home size={24} />
                        </button>
                    )}
                </div>
                
                <div className="h-[calc(100%-60px)]">
                    {renderView()}
                </div>

                {/* --- GLOBAL MESSAGE BANNER --- */}
                <MessageBanner message={orderMessage} />
                
                {/* --- GLOBAL MODAL LAYER --- */}
                {renderModal()}
            </div>
        </div>
    );
};
