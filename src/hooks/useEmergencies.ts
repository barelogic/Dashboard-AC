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
    // Separate state for Firebase and Local data to prevent sync conflicts
    const [firebaseEmergencies, setFirebaseEmergencies] = useState<Emergency[]>([]);
    const [localEmergencies, setLocalEmergencies] = useState<Emergency[]>([]);

    const [filter, setFilter] = useState<EmergencyType | "All">("All");
    const [isLoading, setIsLoading] = useState(true);
    const [isFirebaseEnabled, setIsFirebaseEnabled] = useState(false);

    // Initialization Effect: Run once to determine mode
    useEffect(() => {
        const firebaseInitialized = initializeFirebase();
        setIsFirebaseEnabled(firebaseInitialized);

        // If not firebase, ensure we have initial mock data
        if (!firebaseInitialized) {
            setLocalEmergencies(getMockEmergencies());
            setIsLoading(false);
        }
    }, []);

    // Firebase Subscription Effect
    useEffect(() => {
        if (isFirebaseEnabled) {
            setIsLoading(true);
            const unsubscribe = subscribeToEmergencies((data) => {
                setFirebaseEmergencies(data);
                setIsLoading(false);
            });
            return () => unsubscribe();
        }
    }, [isFirebaseEnabled]);

    // DERIVED STATE: The source of truth for the UI
    const emergencies = isFirebaseEnabled ? firebaseEmergencies : localEmergencies;

    // Filtered emergencies
    const filteredEmergencies = emergencies.filter(
        (e) => filter === "All" || e.type === filter
    );

    // Active emergencies count (not resolved)
    const activeCount = emergencies.filter((e) => e.status !== "resolved").length;

    // Add new emergency
    const addEmergency = useCallback(
        async (type?: EmergencyType) => {
            // Ensure type is a valid string/EmergencyType
            const isValidType = type && typeof type === 'string';
            const randomType: EmergencyType =
                isValidType ? type : (["Fire", "Medical", "Patrol"] as EmergencyType[])[Math.floor(Math.random() * 3)];

            // Random location near Coimbatore (±0.05 degrees)
            const latitude = 11.0168 + (Math.random() - 0.5) * 0.1;
            const longitude = 76.9558 + (Math.random() - 0.5) * 0.1;

            if (isFirebaseEnabled) {
                await addEmergencyService(latitude, longitude, randomType);
            } else {
                // Local mock mode: Directly update local state
                const newEmergency: Emergency = {
                    id: `local-${Date.now()}`,
                    latitude,
                    longitude,
                    type: randomType,
                    status: "pending",
                    timestamp: new Date(),
                };
                setLocalEmergencies((prev) => [...prev, newEmergency]);
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
                // Local mock mode: Directly update local state
                setLocalEmergencies((prev) =>
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
