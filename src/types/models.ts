// Emergency types and interfaces (Renamed from emergency.ts)
export type EmergencyType = "Fire" | "Medical" | "Patrol";
export type EmergencyStatus = "pending" | "in-progress" | "resolved";

export interface Emergency {
    id: string;
    latitude: number;
    longitude: number;
    type: EmergencyType;
    timestamp: Date | { toDate: () => Date };
    status: EmergencyStatus;
}

export interface EmergencyFilter {
    type: EmergencyType | "All";
}

// Drone status from Firebase Realtime Database
export type DroneStatusType = "fire" | "medical" | "patrol";

export interface DroneStatus {
    lat: number;
    long: number;
    timestamp: number;
    type: DroneStatusType;
}
