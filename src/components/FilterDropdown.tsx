// Filter dropdown component
import React from "react";
import type { EmergencyType } from "../types/models";

interface FilterDropdownProps {
    filter: EmergencyType | "All";
    onFilterChange: (filter: EmergencyType | "All") => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
    filter,
    onFilterChange,
}) => {
    const options: (EmergencyType | "All")[] = ["All", "Fire", "Medical", "Patrol"];

    return (
        <div className="relative">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Filter by Type
            </label>
            <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as EmergencyType | "All")}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "2.5rem",
                }}
            >
                {options.map((option) => (
                    <option key={option} value={option} className="bg-white">
                        {option === "All" ? "All Types" : option}
                    </option>
                ))}
            </select>
        </div>
    );
};
