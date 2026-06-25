import { useState, useEffect, useCallback } from "react";

// --- System Components ---
import BootScreen from "./components/BootScreen";
import AnimatedBackground from "./components/AnimatedBackground";
import CursorShip from "./components/CursorShip";
import Taskbar from "./components/Taskbar";
import AuraHub from "./components/AuraHub2";
import Window from "./components/Windows";
import ShipStatus from "./components/ShipStatus";
import OrbitalWidget from "./components/OrbitalWidget";
import AlienPet from "./components/AlienPet";
import EmergencyScreen from "./components/EmergencyScree"; // Note: adjusted to match your filename

// --- Applications ---
import Explorer from "./apps/Explorer";
import Notes from "./apps/Notes";
import Calculator from "./apps/Calculator";
import AuraAI from "./apps/AuraAI";
import AuraMusic from "./apps/AuraMusic";
import StellarNavigation from "./apps/StellarNavigation";
import AuraCommand from "./apps/AuraCommand";
import Settings from "./apps/Settings";

// --- Hooks & Utils ---
import { useSystemAudio } from "./hooks/useSystemAudio"; // Ensure you created this hook earlier

// --- App Registry ---
const APP_REGISTRY = {
  explorer: { id: "explorer", name: "File Explorer", icon: "📁", component: Explorer, width: "800px", height: "550px" },
  notes: { id: "notes", name: "Notes", icon: "📝", component: Notes, width: "700px", height: "600px" },
  calc: { id: "calc", name: "Calculator", icon: "🔢", component: Calculator, width: "320px", height: "450px" },
  ai: { id: "ai", name: "Aura AI", icon: "🧠", component: AuraAI, width: "400px", height: "600px" },
  music: { id: "music", name: "Media Player", icon: "🎵", component: AuraMusic, width: "350px", height: "500px" },
  nav: { id: "nav", name: "Stellar Nav", icon: "🚀", component: StellarNavigation, width: "1000px", height: "700px" },
  cmd: { id: "cmd", name: "Aura Command", icon: "⌨️", component: AuraCommand, width: "750px", height: "500px" },
  settings: { id: "settings", name: "Settings", icon: "⚙️", component: Settings, width: "650px", height: "500px" },
};

export default function App() {
  const [systemState, setSystemState] = useState("booting"); // booting, running, emergency
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [hubOpen, setHubOpen] = useState(false);
  const [highestZ, setHighestZ] = useState(100);

  const { playClick } = useSystemAudio() || { playClick: () => {} };

  // --- Window Management ---
  const launchApp = useCallback((appId) => {
    setHubOpen(false);
    playClick();

    if (openWindows.find(w => w.id === appId)) {
      focusWindow(appId); // Already open, just focus it
      return;
    }

    const appDef = APP_REGISTRY[appId];
    if (!appDef) return;

    const newZ = highestZ + 1;
    setHighestZ(newZ);

    setOpenWindows(prev => [
      ...prev,
      {
        ...appDef,
        zIndex: newZ,
        isMinimized: false,
        x: Math.random() * 100 + 100, // Slight random offset
        y: Math.random() * 50 + 50
      }
    ]);
    setActiveWindowId(appId);
  }, [openWindows, highestZ, playClick]);

  const closeWindow = useCallback((appId) => {
    setOpenWindows(prev => prev.filter(w => w.id !== appId));
    if (activeWindowId === appId) setActiveWindowId(null);
  }, [activeWindowId]);

  const focusWindow = useCallback((appId) => {
    if (activeWindowId === appId) return;
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    
    setOpenWindows(prev => prev.map(w => 
      w.id === appId ? { ...w, zIndex: newZ, isMinimized: false } : w
    ));
    setActiveWindowId(appId);
  }, [activeWindowId, highestZ]);

  const toggleMinimize = useCallback((appId) => {
    setOpenWindows(prev => prev.map(w => {
      if (w.id === appId) {
        const minimizing = !w.isMinimized;
        if (minimizing && activeWindowId === appId) setActiveWindowId(null);
        return { ...w, isMinimized: minimizing };
      }
      return w;
    }));
  }, [activeWindowId]);

  // --- Render Logic ---
  if (systemState === "booting") {
    return <BootScreen onComplete={() => setSystemState("running")} />;
  }

  if (systemState === "emergency") {
    return <EmergencyScreen exitEmergency={() => setSystemState("running")} />;
  }

  // Convert object to array for the Hub
  const registeredAppsList = Object.values(APP_REGISTRY).map(app => ({
    ...app,
    action: () => launchApp(app.id)
  }));

  return (
    <div className="desktop-environment" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Background Layers */}
      <AnimatedBackground />
      <CursorShip />

      {/* Desktop Widgets */}
      <ShipStatus />
      <OrbitalWidget />
      <AlienPet />

      {/* Window Manager */}
      {openWindows.map(app => {
        if (app.isMinimized) return null;
        const Component = app.component;
        const isActive = activeWindowId === app.id;

        return (
          <Window
            key={app.id}
            id={app.id}
            title={app.name}
            icon={app.icon}
            defaultX={app.x}
            defaultY={app.y}
            width={app.width}
            height={app.height}
            zIndex={app.zIndex}
            isActive={isActive}
            onFocus={() => focusWindow(app.id)}
            onClose={() => closeWindow(app.id)}
            onMinimize={() => toggleMinimize(app.id)}
          >
            <Component />
          </Window>
        );
      })}

      {/* Central Hub Overlay */}
      {hubOpen && (
        <AuraHub 
          apps={registeredAppsList} 
          onClose={() => setHubOpen(false)}
          onEmergency={() => setSystemState("emergency")}
        />
      )}

      {/* Taskbar Dock */}
      <Taskbar 
        hubOpen={hubOpen}
        setHubOpen={setHubOpen}
        openApps={openWindows}
        activeAppId={activeWindowId}
        onAppClick={(id) => {
          const app = openWindows.find(w => w.id === id);
          if (app.isMinimized || activeWindowId !== id) focusWindow(id);
          else toggleMinimize(id);
        }}
      />
    </div>
  );
}