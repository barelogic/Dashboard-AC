// Emergency types and interfaces

// Use a generic type for timestamp that works with both Firebase and Date
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
