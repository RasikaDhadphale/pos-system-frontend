// Defines the structure of an item in the main menu
import { ReactNode } from 'react';

export interface MenuItem {
    dishId: number;
    dishName: string;    
    category?: string;
    price: number;   
    quantity: number;
}

// Defines the structure of an item currently in the user's order cart (local state)
export interface OrderItem {
    id: string; // Unique ID for React key and removal
    name: string;
    price: number;
}

// Defines the structure of an Open Check stored in the system (global state)
export interface OrderCheck {
    orderId: number; // The orderId, used as the unique check identifier
    timestamp: Date;
    tableNumber: number;
    covers: number;
    subTotal: number;
    serviceCharge: number;
    isServiceChargeApplied: boolean;
    grandTotal: number;
    status: 'open' | 'closed';
    paymentMethod?: 'cash' | 'card';
    items: MenuItem[];
}

// Defines the structure for the modal state
export type ActiveModal =
    | { type: 'payment'; check: OrderCheck }
    | { type: 'tableCoverInput' }
    | { type: 'editTableCover'; initialTable: number; initialCovers: number }
    | null;

export type AppView = 'home' | 'newOrder' | 'openChecks' | 'closedChecks';

export interface AppState {
    view: AppView;
    openChecks: OrderCheck[];
    closedChecks: OrderCheck[];
    orderMessage: string | null;
    activeModal: ActiveModal;
    // Current Order Session details
    currentTable: number | null;
    currentCovers: number | null;
    editingCheck: OrderCheck | null;
    menuData: MenuItem[];
}

// Action Types for useReducer
export type AppAction =
    | { type: 'SET_VIEW'; payload: AppView }
    | { type: 'SET_MODAL'; payload: ActiveModal }
    | { type: 'SET_MESSAGE'; payload: string | null }
    | { type: 'START_NEW_ORDER_SESSION'; payload: { table: number; covers: number; check: OrderCheck | null } }
    | { type: 'FINALIZE_NEW_ORDER_SESSION' }
    | { type: 'SET_OPEN_CHECKS'; payload: OrderCheck[] }
    | { type: 'SET_CLOSED_CHECKS'; payload: OrderCheck[] }
    | { type: 'ADD_OPEN_CHECK'; payload: OrderCheck }
    | { type: 'UPDATE_OPEN_CHECK'; payload: OrderCheck }
    | { type: 'REMOVE_OPEN_CHECK'; payload: number } // checkId
    | { type: 'SET_ALL_DISHES'; payload: MenuItem[]}
    | { type: 'UPDATE_TABLE_COVERS'; payload: { table: number; covers: number } };
