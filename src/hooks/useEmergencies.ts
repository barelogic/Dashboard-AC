// Custom hook for managing emergencies data
import { useState, useEffect, useCallback } from "react";
import type { Emergency, EmergencyType, EmergencyStatus } from "../types/models";
import {
    initializeFirebase,
    subscribeToEmergencies,
    addEmergency as addEmergencyService,
    updateEmergencyStatus as updateStatusService,
} from "../services/firebase";
import { getMockEmergencies } from "../data/mockData";

export const useEmergencies = () => {
    const [emergencies, setEmergencies] = useState<Emergency[]>([]);
    const [filter, setFilter] = useState<EmergencyType | "All">("All");
    const [isLoading, setIsLoading] = useState(true);
    const [isFirebaseEnabled, setIsFirebaseEnabled] = useState(false);
    const [localEmergencies, setLocalEmergencies] = useState<Emergency[]>([]);

    useEffect(() => {
        const firebaseInitialized = initializeFirebase();
        setIsFirebaseEnabled(firebaseInitialized);

        if (firebaseInitialized) {
            const unsubscribe = subscribeToEmergencies((data) => {
                setEmergencies(data);
                setIsLoading(false);
            });
            return () => unsubscribe();
        } else {
            // Use mock data
            // Check if we have local mock data, otherwise load initial mock data
            if (localEmergencies.length === 0) {
                const mockData = getMockEmergencies();
                setLocalEmergencies(mockData);
                setEmergencies(mockData);
            } else {
                setEmergencies(localEmergencies);
            }
            setIsLoading(false);
        }
    }, [localEmergencies.length]);

    // Filtered emergencies
    const filteredEmergencies = emergencies.filter(
        (e) => filter === "All" || e.type === filter
    );

    // Active emergencies count (not resolved)
    const activeCount = emergencies.filter((e) => e.status !== "resolved").length;

    // Add new emergency
    const addEmergency = useCallback(
        async (type?: EmergencyType) => {
            const randomType: EmergencyType =
                type || (["Fire", "Medical", "Patrol"] as EmergencyType[])[Math.floor(Math.random() * 3)];

            // Random location near Coimbatore (±0.05 degrees)
            const latitude = 11.0168 + (Math.random() - 0.5) * 0.1;
            const longitude = 76.9558 + (Math.random() - 0.5) * 0.1;

            if (isFirebaseEnabled) {
                await addEmergencyService(latitude, longitude, randomType);
            } else {
                // Local mock mode
                const newEmergency: Emergency = {
                    id: `local-${Date.now()}`,
                    latitude,
                    longitude,
                    type: randomType,
                    status: "pending",
                    timestamp: new Date(),
                };
                setLocalEmergencies((prev) => [...prev, newEmergency]);
                setEmergencies((prev) => [...prev, newEmergency]);
            }
        },
        [isFirebaseEnabled]
    );

    // Update emergency status
    const updateStatus = useCallback(
        async (id: string, status: EmergencyStatus) => {
            if (isFirebaseEnabled) {
                await updateStatusService(id, status);
            } else {
                // Local mock mode
                setLocalEmergencies((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, status } : e))
                );
                setEmergencies((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, status } : e))
                );
            }
        },
        [isFirebaseEnabled]
    );

    return {
        emergencies: filteredEmergencies,
        allEmergencies: emergencies,
        activeCount,
        filter,
        setFilter,
        addEmergency,
        updateStatus,
        isLoading,
        isFirebaseEnabled,
    };
};
