// Main App component
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { EmergencyList } from "./components/EmergencyList";
import { MapView } from "./components/MapView";
import { useEmergencies } from "./hooks/useEmergencies";
import "./App.css";

function App() {
  const {
    emergencies,
    activeCount,
    filter,
    setFilter,
    addEmergency,
    updateStatus,
    isLoading,
    isFirebaseEnabled,
  } = useEmergencies();

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header isFirebaseEnabled={isFirebaseEnabled} />

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Emergency List */}
        <aside className="w-80 flex-shrink-0 border-r border-slate-200">
          <EmergencyList
            emergencies={emergencies}
            filter={filter}
            onFilterChange={setFilter}
            onAddEmergency={addEmergency}
            onStatusChange={updateStatus}
            isLoading={isLoading}
          />
        </aside>

        {/* Map View */}
        <section className="flex-1">
          <MapView emergencies={emergencies} onStatusChange={updateStatus} />
        </section>
      </main>

      <Footer activeCount={activeCount} />
    </div>
  );
}

export default App;
