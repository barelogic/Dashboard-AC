// Status Toggle component
import React from "react";
import type { EmergencyStatus } from "../types/models";

interface StatusToggleProps {
    currentStatus: EmergencyStatus;
    onStatusChange: (status: EmergencyStatus) => void;
}

const statusConfig: Record<EmergencyStatus, { label: string; color: string; bgColor: string }> = {
    pending: {
        label: "Pending",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100 border-yellow-200 hover:bg-yellow-200",
    },
    "in-progress": {
        label: "In Progress",
        color: "text-blue-700",
        bgColor: "bg-blue-100 border-blue-200 hover:bg-blue-200",
    },
    resolved: {
        label: "Resolved",
        color: "text-green-700",
        bgColor: "bg-green-100 border-green-200 hover:bg-green-200",
    },
};

const statusOrder: EmergencyStatus[] = ["pending", "in-progress", "resolved"];

export const StatusToggle: React.FC<StatusToggleProps> = ({
    currentStatus,
    onStatusChange,
}) => {
    const cycleStatus = () => {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        onStatusChange(statusOrder[nextIndex]);
    };

    const config = statusConfig[currentStatus];

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                cycleStatus();
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-200 ${config.bgColor} ${config.color}`}
        >
            {config.label}
        </button>
    );
};
