/**
 * Seed Data Script for Emergency Drone Dashboard
 * 
 * This script populates Firestore with sample emergency data.
 * 
 * Usage:
 *   npm run seed
 * 
 * Make sure you have set up your .env file with Firebase credentials first.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env file manually if needed
const loadEnv = () => {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim();
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.log('Could not load .env file manually');
    }
};

loadEnv();

// Load environment variables (when running with tsx/node)
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

// Sample emergency data near Coimbatore, India
const sampleEmergencies = [
    {
        latitude: 11.0168,
        longitude: 76.9558,
        type: 'Fire',
        status: 'pending',
    },
    {
        latitude: 11.0245,
        longitude: 76.9672,
        type: 'Medical',
        status: 'in-progress',
    },
    {
        latitude: 11.0052,
        longitude: 76.9615,
        type: 'Patrol',
        status: 'pending',
    },
    {
        latitude: 11.0321,
        longitude: 76.9423,
        type: 'Fire',
        status: 'resolved',
    },
    {
        latitude: 10.9985,
        longitude: 76.9789,
        type: 'Medical',
        status: 'pending',
    },
    {
        latitude: 11.0089,
        longitude: 76.9345,
        type: 'Patrol',
        status: 'in-progress',
    },
    {
        latitude: 11.0412,
        longitude: 76.9501,
        type: 'Fire',
        status: 'pending',
    },
];

async function seedDatabase() {
    console.log('🚀 Starting database seeding...\n');

    // Check if Firebase is configured
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.error('❌ Firebase not configured!');
        console.log('\nPlease create a .env file with your Firebase credentials:');
        console.log('  VITE_FIREBASE_API_KEY=your-api-key');
        console.log('  VITE_FIREBASE_PROJECT_ID=your-project-id');
        console.log('  ... (see README.md for full list)\n');
        process.exit(1);
    }

    try {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const emergenciesRef = collection(db, 'emergencies');

        console.log('📦 Connected to Firebase project:', firebaseConfig.projectId);

        // Option to clear existing data
        const existingDocs = await getDocs(emergenciesRef);
        if (existingDocs.size > 0) {
            console.log(`\n🗑️  Clearing ${existingDocs.size} existing emergencies...`);
            for (const docSnapshot of existingDocs.docs) {
                await deleteDoc(doc(db, 'emergencies', docSnapshot.id));
            }
            console.log('   ✓ Cleared existing data');
        }

        // Add sample emergencies
        console.log('\n📝 Adding sample emergencies...\n');

        for (const emergency of sampleEmergencies) {
            const docRef = await addDoc(emergenciesRef, {
                ...emergency,
                timestamp: Timestamp.now(),
            });
            console.log(`   ✓ Added ${emergency.type} emergency (${emergency.status}) - ID: ${docRef.id}`);
        }

        console.log(`\n✅ Successfully seeded ${sampleEmergencies.length} emergencies!`);
        console.log('\n🌐 Open the dashboard to see them on the map.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
