// Mock data for offline/initial testing
import type { Emergency } from "../types/models";

export const mockEmergencies: Omit<Emergency, "timestamp">[] = [
    {
        id: "mock-1",
        latitude: 11.0168,
        longitude: 76.9558,
        type: "Fire",
        status: "pending",
    },
    {
        id: "mock-2",
        latitude: 11.0245,
        longitude: 76.9672,
        type: "Medical",
        status: "in-progress",
    },
    {
        id: "mock-3",
        latitude: 11.0052,
        longitude: 76.9615,
        type: "Patrol",
        status: "pending",
    },
    {
        id: "mock-4",
        latitude: 11.0321,
        longitude: 76.9423,
        type: "Fire",
        status: "resolved",
    },
    {
        id: "mock-5",
        latitude: 10.9985,
        longitude: 76.9789,
        type: "Medical",
        status: "pending",
    },
];

// Convert mock data to full Emergency objects with timestamps
export const getMockEmergencies = (): Emergency[] => {
    return mockEmergencies.map((e) => ({
        ...e,
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Random time in last hour
    }));
};
