import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative p-6">
            <button 
                onClick={onClose} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                aria-label="Close modal"
            >
                <X size={20} />
            </button>
            {children}
        </div>
    </div>
);
