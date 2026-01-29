// Add Emergency Button component
import React from "react";

interface AddEmergencyButtonProps {
    onAdd: () => void;
}
// No changes needed for button colors (blue gradient works well on white)
export const AddEmergencyButton: React.FC<AddEmergencyButtonProps> = ({ onAdd }) => {
    return (
        <button
            onClick={() => onAdd()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
        >
            <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                />
            </svg>
            Add Test Emergency
        </button>
    );
};
