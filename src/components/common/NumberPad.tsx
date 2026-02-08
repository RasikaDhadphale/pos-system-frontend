import React, { useCallback } from 'react';

interface NumberPadProps {
    onInput: (value: string) => void;
}

export const NumberPad: React.FC<NumberPadProps> = React.memo(({ onInput }) => {
    const keys: string[] = [
        '1', '2', '3', 
        '4', '5', '6', 
        '7', '8', '9', 
        'C', '0', 'DEL'
    ];

    const handleClick = useCallback((value: string) => {
        onInput(value);
    }, [onInput]);

    const keyClass = "p-3 text-2xl font-bold rounded-lg shadow-md transition duration-150";

    return (
        <div className="grid grid-cols-3 gap-3 w-full px-5"> 
            {keys.map(key => (
                <button
                    key={key}
                    onClick={() => handleClick(key)}
                    className={keyClass + (key === 'C' 
                        ? ' bg-red-100 text-red-600 hover:bg-red-200' 
                        : key === 'DEL' 
                        ? ' bg-indigo-100 text-indigo-600 hover:bg-indigo-200' 
                        : ' bg-gray-100 text-gray-800 hover:bg-gray-200')}
                >
                    {key === 'DEL' ? '⌫' : key}
                </button>
            ))}
        </div>
    );
});

NumberPad.displayName = 'NumberPad';

export {};
