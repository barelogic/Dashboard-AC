// Map View component with React-Leaflet
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import type { Emergency, EmergencyStatus } from "../types/models";
import { EmergencyMarker } from "./EmergencyMarker";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
    emergencies: Emergency[];
    onStatusChange: (id: string, status: EmergencyStatus) => void;
}

// Coimbatore, India coordinates
const CENTER: [number, number] = [11.0168, 76.9558];
const ZOOM = 13;

export const MapView: React.FC<MapViewProps> = ({
    emergencies,
    onStatusChange,
}) => {
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
            </MapContainer>

            {/* Map overlay gradient for better integration (Light mode: White fade) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
        </div>
    );
};
