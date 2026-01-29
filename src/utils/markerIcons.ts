// Custom Leaflet marker icons for emergency types
import L from "leaflet";
import type { EmergencyType, EmergencyStatus } from "../types/models";

// Color mapping for emergency types
const typeColors: Record<EmergencyType, string> = {
    Fire: "#ef4444", // Red
    Medical: "#3b82f6", // Blue
    Patrol: "#22c55e", // Green
};

// Status opacity mapping
const statusOpacity: Record<EmergencyStatus, number> = {
    pending: 1,
    "in-progress": 0.8,
    resolved: 0.4,
};

// Create custom div icon for emergency markers
export const createEmergencyIcon = (
    type: EmergencyType,
    status: EmergencyStatus
): L.DivIcon => {
    const color = typeColors[type];
    const opacity = statusOpacity[status];
    const pulseClass = status === "pending" ? "animate-pulse" : "";

    return L.divIcon({
        className: "custom-marker",
        html: `
      <div class="relative flex items-center justify-center ${pulseClass}" style="opacity: ${opacity}">
        <div class="absolute w-8 h-8 rounded-full" style="background-color: ${color}; opacity: 0.3;"></div>
        <div class="w-5 h-5 rounded-full border-2 border-white shadow-lg" style="background-color: ${color};"></div>
      </div>
    `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
};

// Get color for emergency type
export const getEmergencyColor = (type: EmergencyType): string => {
    return typeColors[type];
};

// Get emoji for emergency type
export const getEmergencyEmoji = (type: EmergencyType): string => {
    const emojis: Record<EmergencyType, string> = {
        Fire: "🔥",
        Medical: "🏥",
        Patrol: "🚔",
    };
    return emojis[type];
};
