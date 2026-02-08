import React, { useState, useCallback, useEffect, ReactNode } from 'react';
import { Modal } from '../common/Modal';
import { NumberPad } from '../common/NumberPad';
import { useAppDispatch } from '../../context/AppContext';

interface TableCoverBaseModalProps {
    onClose: () => void;
    onFinalize: (tableNum: number, coverNum: number) => void;
    initialTable: number | null;
    initialCovers: number | null;
    title: string;
}

// Reusable component for both New Order start and Edit Cover/Table
const TableCoverBaseModal: React.FC<TableCoverBaseModalProps> = ({ 
    onClose, 
    onFinalize, 
    initialTable, 
    initialCovers, 
    title,
}) => {
    const dispatch = useAppDispatch();
    const isEditMode: boolean = initialTable !== null;
    
    const [step, setStep] = useState<'table' | 'covers'>('table'); 
    const [tableNumber, setTableNumber] = useState<string>(isEditMode && initialTable !== null ? String(initialTable) : '');
    const [covers, setCovers] = useState<string>(isEditMode && initialCovers !== null ? String(initialCovers) : '');

    // If in edit mode, jump straight to covers step as table is often less important to change
    useEffect(() => {
        if (isEditMode) {
            setStep('covers');
        }
    }, [isEditMode]);

    const handlePadInput = useCallback((value: string) => {
        let currentInput = step === 'table' ? tableNumber : covers;
        let setter = step === 'table' ? setTableNumber : setCovers;
    
        if (value === 'C') { // 'C' for Clear
            setter('');
        } else if (value === 'DEL') { // 'DEL' for Backspace
            setter(currentInput.slice(0, -1));
        } else if (/\d/.test(value)) { // Digits
            if (currentInput.length < 3) {
                setter(currentInput + value);
            }
        }
    }, [step, tableNumber, covers]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 3); 
        
        if (step === 'table') {
            setTableNumber(value);
        } else {
            setCovers(value);
        }
    };
    
    const handleNext = useCallback(() => {
        if (step === 'table') {
            const tableNum = parseInt(tableNumber);
            if (isNaN(tableNum) || tableNum <= 0) {
                dispatch({ type: 'SET_MESSAGE', payload: '❌ Please enter a valid Table Number (must be a positive number).' });
                setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: null }), 3000);
                return;
            }
            setStep('covers');
        } else if (step === 'covers') {
            const coverNum = parseInt(covers);
            if (isNaN(coverNum) || coverNum <= 0) {
                dispatch({ type: 'SET_MESSAGE', payload: '❌ Please enter a valid number for Covers (guests).' });
                setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: null }), 3000);
                return;
            }
            onFinalize(parseInt(tableNumber), coverNum);
            onClose();
        }

    }, [step, tableNumber, covers, onFinalize, onClose, dispatch]);

    // Keyboard shortcut (Enter key)
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const nextDisabled = (step === 'table' && tableNumber.length === 0) || (step === 'covers' && covers.length === 0);
            if (!nextDisabled) {
                handleNext();
            }
        }
    }, [step, tableNumber, covers, handleNext]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);


    const renderInput = (): ReactNode => {
        const inputClasses = "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 text-2xl font-mono text-center bg-white";

        if (step === 'table') {
            return (
                <div>
                    <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                    <input
                        id="tableNumber"
                        type="text"
                        value={tableNumber}
                        onChange={handleInputChange} 
                        placeholder="e.g., 5"
                        className={inputClasses}
                        inputMode="numeric" 
                        autoFocus
                    />
                </div>
            );
        } else if (step === 'covers') {
            return (
                <div>
                    <label htmlFor="covers" className="block text-sm font-medium text-gray-700 mb-1">Covers</label>
                    <input
                        id="covers"
                        type="text"
                        value={covers}
                        onChange={handleInputChange} 
                        placeholder="e.g., 2"
                        className={inputClasses}
                        inputMode="numeric" 
                        autoFocus
                    />
                </div>
            );
        }
        return null;
    };

    const handleBack = () => {
        setStep('table');
        setCovers(isEditMode && initialCovers !== null ? String(initialCovers) : ''); 
    };
    
    const nextDisabled = (step === 'table' && tableNumber.length === 0) || (step === 'covers' && covers.length === 0);
    const okText = isEditMode && step === 'covers' ? 'Update' : 'Next';

    return (
        <Modal onClose={onClose}>
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
                {title || (step === 'table' ? 'Enter Table Number' : `Table ${tableNumber} - Enter Covers`)}
            </h3>
            
            <div className="flex flex-col items-center space-y-6 w-full max-w-xs mx-auto">
                <div className="w-full space-y-2">
                    {renderInput()}
                </div>
                
                <NumberPad onInput={handlePadInput} />
            </div>

            <div className="mt-6 mx-2 flex justify-between space-x-3">
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 font-semibold rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    {step === 'covers' && !isEditMode && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-2 text-indigo-700 font-semibold rounded-lg bg-indigo-100 hover:bg-indigo-200 transition shadow-sm"
                        >
                            Back
                        </button>
                    )}
                </div>
                <button
                    onClick={handleNext}
                    disabled={nextDisabled}
                    className="px-6 py-2 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-lg disabled:bg-indigo-300"
                >
                    {okText}
                </button>
            </div>
        </Modal>
    );
};

export const TableCoverInputModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    
    const handleStartOrder = useCallback((tableNum: number, coverNum: number) => {
        dispatch({ 
            type: 'START_NEW_ORDER_SESSION', 
            payload: { table: tableNum, covers: coverNum, check: null } 
        });
        dispatch({ type: 'SET_MODAL', payload: null });
    }, [dispatch]);

    return (
        <TableCoverBaseModal 
            onClose={onClose} 
            onFinalize={handleStartOrder} 
            initialTable={null} 
            initialCovers={null}
            title= "Start New Order"
        />
    );
};

export const EditTableCoverModal: React.FC<{ onClose: () => void; initialTable: number; initialCovers: number }> = ({ onClose, initialTable, initialCovers }) => {
    const dispatch = useAppDispatch();
    
    const handleUpdateOrder = useCallback((tableNum: number, coverNum: number) => {
        dispatch({ type: 'UPDATE_TABLE_COVERS', payload: { table: tableNum, covers: coverNum } });
        
        const message = `✅ Table updated to ${tableNum} and Covers updated to ${coverNum}.`;
        dispatch({ type: 'SET_MESSAGE', payload: message });
        setTimeout(() => dispatch({ type: 'SET_MESSAGE', payload: null }), 4000);
        
        dispatch({ type: 'SET_MODAL', payload: null });
    }, [dispatch]);

    return (
        <TableCoverBaseModal 
            onClose={onClose} 
            onFinalize={handleUpdateOrder} 
            title={`Edit Table ${initialTable} / Covers ${initialCovers}`}
            initialTable={initialTable}
            initialCovers={initialCovers}
        />
    );
};