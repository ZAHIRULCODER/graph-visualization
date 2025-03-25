import { Provider } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import { store } from "./store";
import GraphVisualization from "./components/GraphVisualization";
import Sidebar from "./components/Sidebar";
import { useEffect } from "react";
import { useAppSelector } from "./hooks/useAppSelector";
import { applyDarkMode } from "./utils/theme";

// Inner App component that can use hooks
const AppContent = () => {
  const isDarkMode = useAppSelector((state) => state.graph.isDarkMode);

  // Effect to set up theme based on Redux state
  useEffect(() => {
    applyDarkMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} ${
        isDarkMode ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <Sidebar />
      <div className="flex-1 relative">
        <GraphVisualization />
      </div>
    </div>
  );
};

// Main App component with providers
const App = () => {
  return (
    <Provider store={store}>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </Provider>
  );
};

export default App;
