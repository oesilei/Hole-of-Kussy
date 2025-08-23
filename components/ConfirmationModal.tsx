import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: (() => void) | null;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] border-2 border-red-500 p-8 max-w-sm w-full text-center">
                <p className="mb-6 text-lg">{message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onCancel} className="font-bold py-2 px-6 rounded-none bg-transparent border-2 border-red-500 text-red-500 transition-all duration-300 uppercase hover:bg-red-500 hover:text-gray-900 hover:shadow-[0_0_10px_#f00]">
                        Cancelar
                    </button>
                    <button onClick={handleConfirm} className="font-bold py-2 px-6 rounded-none bg-transparent border-2 border-cyan-400 text-cyan-400 transition-all duration-300 uppercase hover:bg-cyan-400 hover:text-gray-900 hover:shadow-[0_0_10px_#0ff]">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;