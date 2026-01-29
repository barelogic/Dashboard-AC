// Map View component with React-Leaflet
import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Emergency, EmergencyStatus, DroneStatus, DroneStatusType } from "../types/models";
import { EmergencyMarker } from "./EmergencyMarker";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
    emergencies: Emergency[];
    onStatusChange: (id: string, status: EmergencyStatus) => void;
    droneStatus?: DroneStatus | null;
}

// Coimbatore, India coordinates
const CENTER: [number, number] = [11.0168, 76.9558];
const ZOOM = 13;

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

// Create dynamic drone icon based on type - colored location pin style
const createDroneIcon = (type: DroneStatusType): L.DivIcon => {
    const color = droneTypeColors[type];

    return L.divIcon({
        className: "custom-marker",
        html: `
            <div class="relative flex items-center justify-center animate-pulse">
                <div class="absolute w-8 h-8 rounded-full" style="background-color: ${color}; opacity: 0.3;"></div>
                <div class="w-5 h-5 rounded-full border-2 border-white shadow-lg" style="background-color: ${color};"></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
};

export const MapView: React.FC<MapViewProps> = ({
    emergencies,
    onStatusChange,
    droneStatus,
}) => {
    // Create drone icon dynamically based on current type
    const droneIcon = useMemo(() => {
        if (!droneStatus) return null;
        return createDroneIcon(droneStatus.type);
    }, [droneStatus?.type]);

    const droneColor = droneStatus ? droneTypeColors[droneStatus.type] : "#3b82f6";
    const droneEmoji = droneStatus ? droneTypeEmojis[droneStatus.type] : "🚁";

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={CENTER}
                zoom={ZOOM}
                className="h-full w-full"
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {emergencies.map((emergency) => (
                    <EmergencyMarker
                        key={emergency.id}
                        emergency={emergency}
                        onStatusChange={onStatusChange}
                    />
                ))}

                {/* Real-time Drone Marker */}
                {droneStatus && droneIcon && (
                    <Marker
                        position={[droneStatus.lat, droneStatus.long]}
                        icon={droneIcon}
                    >
                        <Popup>
                            <div className="text-center">
                                <div className="font-bold" style={{ color: droneColor }}>
                                    {droneEmoji} Alert Location
                                </div>
                                <div className="text-sm mt-1">
                                    <div>Type: <span className="capitalize font-medium">{droneStatus.type}</span></div>
                                    <div>Lat: {droneStatus.lat.toFixed(6)}</div>
                                    <div>Lng: {droneStatus.long.toFixed(6)}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(droneStatus.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Map overlay gradient for better integration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>

            {/* Alert Status Overlay */}
            {droneStatus && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                            style={{ backgroundColor: `${droneColor}20` }}
                        >
                            {droneEmoji}
                        </span>
                        <div>
                            <div className="text-xs text-gray-500">Live Alert</div>
                            <div className="text-sm font-semibold capitalize" style={{ color: droneColor }}>
                                {droneStatus.type}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
