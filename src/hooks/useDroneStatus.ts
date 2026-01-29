// Custom hook for real-time drone status from Firebase Realtime Database
import { useState, useEffect } from "react";
import type { DroneStatus } from "../types/models";
import { initializeFirebase, subscribeToDroneStatus } from "../services/firebase";

export const useDroneStatus = () => {
    const [droneStatus, setDroneStatus] = useState<DroneStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize Firebase first
        const isInitialized = initializeFirebase();

        if (!isInitialized) {
            setError("Firebase not configured");
            setIsLoading(false);
            return;
        }

        // Subscribe to drone status updates
        const unsubscribe = subscribeToDroneStatus((status) => {
            setDroneStatus(status);
            setIsLoading(false);
            if (!status) {
                setError("No drone status available");
            } else {
                setError(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Helper to get location as object
    const location = droneStatus ? {
        latitude: droneStatus.lat,
        longitude: droneStatus.long,
    } : null;

    return {
        droneStatus,
        location,
        isLoading,
        error,
        isConnected: !isLoading && !error && droneStatus !== null,
    };
};
