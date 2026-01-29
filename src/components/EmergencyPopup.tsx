// Emergency Popup component for map markers
import React from "react";
import type { Emergency, EmergencyStatus } from "../types/models";
import { StatusToggle } from "./StatusToggle";
import { getEmergencyEmoji } from "../utils/markerIcons";

interface EmergencyPopupProps {
    emergency: Emergency;
    onStatusChange: (id: string, status: EmergencyStatus) => void;
}

export const EmergencyPopup: React.FC<EmergencyPopupProps> = ({
    emergency,
    onStatusChange,
}) => {
    const emoji = getEmergencyEmoji(emergency.type);

    // Format timestamp
    const timestamp = emergency.timestamp instanceof Date
        ? emergency.timestamp
        : emergency.timestamp.toDate();

    return (
        <div className="min-w-[200px] p-1 font-sans">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{emoji}</span>
                <span className="font-bold text-slate-800">{emergency.type}</span>
            </div>

            <div className="space-y-1.5 text-sm mb-3">
                <div className="text-slate-500 text-xs">ID: {emergency.id.slice(0, 8)}...</div>
                <div className="text-slate-600 font-mono text-xs">
                    {emergency.latitude.toFixed(4)}, {emergency.longitude.toFixed(4)}
                </div>
                <div className="text-slate-500 text-xs">
                    {timestamp.toLocaleTimeString()}
                </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Status:</span>
                    <StatusToggle
                        currentStatus={emergency.status}
                        onStatusChange={(status) => onStatusChange(emergency.id, status)}
                    />
                </div>
            </div>
        </div>
    );
};
