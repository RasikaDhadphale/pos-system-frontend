import React from 'react';

interface MessageBannerProps {
    message: string | null;
}

export const MessageBanner: React.FC<MessageBannerProps> = ({ message }) => {
    if (!message) return null;

    const isSuccess = message.includes('Sent') || message.includes('Updated') || message.includes('closed');
    const isWarning = message.includes('Awaiting');
    const isError = message.includes('❌') || message.includes('🛒');
    
    let bgColor = 'bg-blue-500'; 
    
    if (isSuccess) {
        bgColor = 'bg-green-600';
    } else if (isWarning) {
        bgColor = 'bg-yellow-600';
    } else if (isError) {
        bgColor = 'bg-red-500';
    } else if (message.includes('updated')) {
        bgColor = 'bg-indigo-600'; 
    }

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
            <div className={`
                mb-3 p-4 text-white rounded-xl shadow-2xl text-center font-bold text-lg 
                transition-all duration-300 min-w-[300px]
                ${bgColor}
            `}>
                {message}
            </div>
        </div>
    );
};
