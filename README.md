# Emergency Drone Dashboard 🚁

A real-time emergency management dashboard built with React, Firebase Firestore, and React-Leaflet for visualizing Fire, Medical, and Patrol emergencies on an interactive map.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)

## Features

- 📍 **Interactive Map** - Real-time emergency visualization on Leaflet map
- 🔥 **Color-coded Markers** - Fire (Red), Medical (Blue), Patrol (Green)
- ⚡ **Real-time Updates** - Firebase Firestore live synchronization
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🎛️ **Filter Controls** - Filter by emergency type
- ➕ **Test Mode** - Add random emergencies for testing
- 🔄 **Status Management** - Toggle: Pending → In Progress → Resolved

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run in **Demo Mode** with mock data. Open [http://localhost:5173](http://localhost:5173) to view it.

## Firebase Setup (For Live Mode)

To enable real-time sync with Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Cloud Firestore** in Database section
4. Set Firestore rules to allow read/write (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /emergencies/{document} {
      allow read, write: if true;
    }
  }
}
```

### 2. Get Your Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps" and click "Add app" → Web
3. Copy the Firebase config object

### 3. Create Environment File

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Seed Initial Data (Optional)

```bash
npm run seed
```

## Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting (select your project)
firebase init hosting
# - Choose "dist" as public directory
# - Configure as SPA: Yes
# - Don't overwrite index.html

# Build for production
npm run build

# Deploy
firebase deploy --only hosting
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Dashboard header with status
│   ├── Footer.tsx          # Active count footer
│   ├── EmergencyList.tsx   # Sidebar with emergency cards
│   ├── MapView.tsx         # React-Leaflet map
│   ├── EmergencyMarker.tsx # Custom colored markers
│   ├── EmergencyPopup.tsx  # Marker popup details
│   ├── FilterDropdown.tsx  # Type filter
│   ├── AddEmergencyButton.tsx
│   └── StatusToggle.tsx    # Status cycle buttons
├── hooks/
│   └── useEmergencies.ts   # Data management hook
├── services/
│   └── firebase.ts         # Firebase operations
├── data/
│   └── mockData.ts         # Offline mock data
├── types/
│   └── emergency.ts        # TypeScript interfaces
└── utils/
    └── markerIcons.ts      # Leaflet icon configs
```

## Data Model

Each emergency record contains:

```typescript
interface Emergency {
  id: string;                                    // Auto-generated
  latitude: number;                              // -90 to 90
  longitude: number;                             // -180 to 180
  type: "Fire" | "Medical" | "Patrol";
  timestamp: Timestamp;                          // Firebase timestamp
  status: "pending" | "in-progress" | "resolved";
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run seed` | Seed Firestore with sample data |

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **React-Leaflet 5** - Map component
- **Firebase 12** - Backend (Firestore)
- **OpenStreetMap/CARTO** - Map tiles (free)

## License

MIT
