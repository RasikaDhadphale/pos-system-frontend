
import React, { ReactNode, createContext, useContext, useReducer } from 'react';
import { AppState, AppAction, AppView } from '../types/types';

const INITIAL_STATE: AppState = {
    view: 'home',
    openChecks: [],
    closedChecks: [],
    orderMessage: null,
    activeModal: null,
    currentTable: null,
    currentCovers: null,
    editingCheck: null,
    menuData: []
};

// Reducer Function (Pure function for state transition)
const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_VIEW':
            return { ...state, view: action.payload };
        case 'SET_MODAL':
            return { ...state, activeModal: action.payload };
        case 'SET_MESSAGE':
            return { ...state, orderMessage: action.payload };
        case 'START_NEW_ORDER_SESSION':
            return {
                ...state,
                view: 'newOrder',
                currentTable: action.payload.table,
                currentCovers: action.payload.covers,
                editingCheck: action.payload.check,
            };
        case 'FINALIZE_NEW_ORDER_SESSION':
            return {
                ...state,
                view: 'home',
                currentTable: null,
                currentCovers: null,
                editingCheck: null,
            };
        case 'SET_OPEN_CHECKS':
            return {
                ...state,
                openChecks: action.payload,
            };
        case 'SET_CLOSED_CHECKS':
            return {
                ...state,
                closedChecks: action.payload,
            };
        case 'ADD_OPEN_CHECK':
            return {
                ...state,
                openChecks: [...state.openChecks, action.payload],
            };
        case 'UPDATE_OPEN_CHECK':
            return {
                ...state,
                openChecks: state.openChecks.map(check => 
                    check.orderId === action.payload.orderId? action.payload : check
                ),
            };
        case 'REMOVE_OPEN_CHECK':
            return {
                ...state,
                openChecks: state.openChecks.filter(check => check.orderId !== action.payload),
            };
        case 'UPDATE_TABLE_COVERS':
            // Used to update the local order session details without changing the view
            return {
                ...state,
                currentTable: action.payload.table,
                currentCovers: action.payload.covers,
            };
        case 'SET_ALL_DISHES':
            // Used to update the local order session details without changing the view
            return {...state, menuData: action.payload,};
        default:
            return state;
    }
};

// Contexts
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);

// Custom Hooks for consumption
export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppProvider');
    }
    return context;
};

export const useAppDispatch = () => {
    const context = useContext(AppDispatchContext);
    if (context === undefined) {
        throw new Error('useAppDispatch must be used within an AppProvider');
    }
    return context;
};

// Provider Component
interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchContext.Provider value={dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppStateContext.Provider>
    );
};
