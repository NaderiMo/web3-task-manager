import { useEffect } from "react";
import "./App.css";
import AnimatedBackground from "./components/AnimatedBackground";
import ErrorScreen from "./components/ErrorScreen";
import LoadingScreen from "./components/LoadingScreen";
import Tasks from "./components/Tasks";
import TopNav from "./components/TopNav";
import { initializeAuthStateFromLocalStorage } from "./stores/authStore";
import { useWeb3Store } from "./stores/web3Store";

function App() {
  const { initializeWeb3, isInitialized, error: web3Error } = useWeb3Store();

  useEffect(() => {
    initializeWeb3();
    initializeAuthStateFromLocalStorage();
  }, [initializeWeb3]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (web3Error) {
    return (
      <ErrorScreen error={web3Error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-8 mx-auto max-w-7xl">
        <TopNav />
        <main className="flex justify-center items-start animate-slide-in">
          <Tasks />
        </main>
      </div>
    </div>
  );
}

export default App;
