// Firebase configuration and Firestore/Realtime Database operations
import { initializeApp, type FirebaseApp, getApps, getApp } from "firebase/app";
import {
    getFirestore,
    collection,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    type Firestore,
    Timestamp,
} from "firebase/firestore";
import {
    getDatabase,
    ref,
    onValue,
    type Database,
} from "firebase/database";
import type { Emergency, EmergencyType, EmergencyStatus, DroneStatus } from "../types/models";
import { getMockEmergencies } from "../data/mockData";

// Firebase configuration - Replace with your own config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://drone-rescue-system-default-rtdb.firebaseio.com",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let rtdb: Database | null = null;

// Check if Firebase is configured
const isFirebaseConfigured = (): boolean => {
    return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// Initialize Firebase
export const initializeFirebase = (): boolean => {
    if (!isFirebaseConfigured()) {
        console.log("Firebase not configured, using mock data");
        return false;
    }

    try {
        if (getApps().length === 0) {
            app = initializeApp(firebaseConfig);
        } else {
            app = getApp();
        }
        db = getFirestore(app);
        rtdb = getDatabase(app);
        return true;
    } catch (error) {
        console.error("Failed to initialize Firebase:", error);
        return false;
    }
};

// Subscribe to emergencies collection
export const subscribeToEmergencies = (
    callback: (emergencies: Emergency[]) => void
): (() => void) => {
    if (!db) {
        // Return mock data if Firebase not configured
        callback(getMockEmergencies());
        return () => { };
    }

    const emergenciesRef = collection(db, "emergencies");
    return onSnapshot(emergenciesRef, (snapshot) => {
        const emergencies: Emergency[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Emergency[];
        callback(emergencies);
    });
};

// Add a new emergency
export const addEmergency = async (
    latitude: number,
    longitude: number,
    type: EmergencyType
): Promise<string | null> => {
    if (!db) {
        console.log("Mock mode: Would add emergency", { latitude, longitude, type });
        return `mock-${Date.now()}`;
    }

    try {
        const docRef = await addDoc(collection(db, "emergencies"), {
            latitude,
            longitude,
            type,
            status: "pending" as EmergencyStatus,
            timestamp: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Failed to add emergency:", error);
        return null;
    }
};

// Update emergency status
export const updateEmergencyStatus = async (
    id: string,
    status: EmergencyStatus
): Promise<boolean> => {
    if (!db) {
        console.log("Mock mode: Would update emergency", { id, status });
        return true;
    }

    try {
        const docRef = doc(db, "emergencies", id);
        await updateDoc(docRef, { status });
        return true;
    } catch (error) {
        console.error("Failed to update emergency:", error);
        return false;
    }
};

// Subscribe to drone status from Firebase Realtime Database
export const subscribeToDroneStatus = (
    callback: (droneStatus: DroneStatus | null) => void
): (() => void) => {
    if (!rtdb) {
        console.log("Realtime Database not initialized");
        callback(null);
        return () => { };
    }

    const droneStatusRef = ref(rtdb, "drone_status");
    return onValue(droneStatusRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val() as DroneStatus;
            console.log("Drone status update received:", data);
            callback(data);
        } else {
            console.log("No drone status data available");
            callback(null);
        }
    }, (error) => {
        console.error("Error listening to drone status:", error);
        callback(null);
    });
};
