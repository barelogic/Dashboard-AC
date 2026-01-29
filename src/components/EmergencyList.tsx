// Emergency List Sidebar component
import React from "react";
import type { Emergency, EmergencyType, EmergencyStatus, DroneStatus, DroneStatusType } from "../types/models";
import { FilterDropdown } from "./FilterDropdown";
import { AddEmergencyButton } from "./AddEmergencyButton";
import { StatusToggle } from "./StatusToggle";
import { getEmergencyEmoji, getEmergencyColor } from "../utils/markerIcons";

// Color mapping for drone status types
const droneTypeColors: Record<DroneStatusType, string> = {
    fire: "#ef4444", // Red
    medical: "#3b82f6", // Blue
    patrol: "#22c55e", // Green
};

// Emoji mapping for drone status types
const droneTypeEmojis: Record<DroneStatusType, string> = {
    fire: "🔥",
    medical: "🏥",
    patrol: "🚔",
};

interface EmergencyListProps {
    emergencies: Emergency[];
    filter: EmergencyType | "All";
    onFilterChange: (filter: EmergencyType | "All") => void;
    onAddEmergency: () => void;
    onStatusChange: (id: string, status: EmergencyStatus) => void;
    isLoading: boolean;
    droneStatus?: DroneStatus | null;
}

export const EmergencyList: React.FC<EmergencyListProps> = ({
    emergencies,
    filter,
    onFilterChange,
    onAddEmergency,
    onStatusChange,
    isLoading,
    droneStatus,
}) => {
    const formatTimestamp = (timestamp: Date | { toDate: () => Date }) => {
        const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    // Get drone status display values
    const droneColor = droneStatus ? droneTypeColors[droneStatus.type] : "#3b82f6";
    const droneEmoji = droneStatus ? droneTypeEmojis[droneStatus.type] : "🔔";

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Live Alert Card */}
            {droneStatus && (
                <div
                    className="p-4 border-b border-slate-200"
                    style={{ backgroundColor: `${droneColor}15` }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                            style={{ backgroundColor: droneColor }}
                        >
                            <span className="text-white">{droneEmoji}</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">Live Alert</span>
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: droneColor }}
                                ></span>
                            </div>
                            <div className="text-xs text-slate-600 capitalize">
                                Type: <span className="font-medium" style={{ color: droneColor }}>{droneStatus.type}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                                {droneStatus.lat.toFixed(4)}, {droneStatus.long.toFixed(4)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header section */}
            <div className="p-4 space-y-4 border-b border-slate-200">
                <FilterDropdown filter={filter} onFilterChange={onFilterChange} />
                <AddEmergencyButton onAdd={onAddEmergency} />
            </div>


            {/* Emergency list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Live Alert as Emergency Card */}
                        {droneStatus && (
                            <div
                                className="p-4 rounded-xl shadow-sm border-l-4 transition-all hover:shadow-md"
                                style={{
                                    borderLeftColor: droneColor,
                                    backgroundColor: `${droneColor}08`
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ backgroundColor: `${droneColor}20` }}
                                    >
                                        {droneEmoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="font-semibold capitalize"
                                                style={{ color: droneColor }}
                                            >
                                                {droneStatus.type} Alert
                                            </span>
                                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                LIVE
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Real-time location update
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono mt-1">
                                            📍 {droneStatus.lat.toFixed(4)}, {droneStatus.long.toFixed(4)}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {new Date(droneStatus.timestamp).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Regular Emergencies */}
                        {emergencies.map((emergency) => (
                            <EmergencyCard
                                key={emergency.id}
                                emergency={emergency}
                                onStatusChange={onStatusChange}
                                formatTimestamp={formatTimestamp}
                            />
                        ))}

                        {/* Empty state - only if no drone status and no emergencies */}
                        {!droneStatus && emergencies.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-slate-500 text-sm">No emergencies found</div>
                                <div className="text-slate-400 text-xs mt-1">
                                    {filter !== "All" ? "Try changing the filter" : "Add a test emergency"}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Summary */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="text-xs text-slate-500">
                    Showing {emergencies.length} emergency{emergencies.length !== 1 ? "ies" : "y"}
                    {filter !== "All" && ` (${filter} only)`}
                </div>
            </div>
        </div>
    );
};

// Individual emergency card component
interface EmergencyCardProps {
    emergency: Emergency;
    onStatusChange: (id: string, status: EmergencyStatus) => void;
    formatTimestamp: (timestamp: Date | { toDate: () => Date }) => string;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({
    emergency,
    onStatusChange,
    formatTimestamp,
}) => {
    const color = getEmergencyColor(emergency.type);
    const emoji = getEmergencyEmoji(emergency.type);
    const isResolved = emergency.status === "resolved";

    return (
        <div
            className={`rounded-lg border transition-all duration-200 hover:border-slate-300 shadow-sm ${isResolved
                ? "bg-slate-50 border-slate-200 opacity-60"
                : "bg-white border-slate-200"
                }`}
        >
            <div className="p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                            style={{ backgroundColor: `${color}15` }}
                        >
                            {emoji}
                        </span>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 text-sm">
                                    {emergency.type}
                                </span>
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: color }}
                                ></span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                                {formatTimestamp(emergency.timestamp)}
                            </div>
                        </div>
                    </div>
                    <StatusToggle
                        currentStatus={emergency.status}
                        onStatusChange={(status) => onStatusChange(emergency.id, status)}
                    />
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Location</span>
                        <span className="font-mono text-slate-500">
                            {emergency.latitude.toFixed(4)}, {emergency.longitude.toFixed(4)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
