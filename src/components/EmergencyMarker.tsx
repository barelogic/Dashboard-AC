// Individual Marker component
import React from "react";
import { Marker, Popup } from "react-leaflet";
import type { Emergency, EmergencyStatus } from "../types/models";
import { createEmergencyIcon } from "../utils/markerIcons";
import { EmergencyPopup } from "./EmergencyPopup";

interface EmergencyMarkerProps {
    emergency: Emergency;
    onStatusChange: (id: string, status: EmergencyStatus) => void;
}

export const EmergencyMarker: React.FC<EmergencyMarkerProps> = ({
    emergency,
    onStatusChange,
}) => {
    const icon = createEmergencyIcon(emergency.type, emergency.status);

    return (
        <Marker
            position={[emergency.latitude, emergency.longitude]}
            icon={icon}
        >
            <Popup>
                <EmergencyPopup emergency={emergency} onStatusChange={onStatusChange} />
            </Popup>
        </Marker>
    );
};
