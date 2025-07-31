import { useEffect } from "react";
import "./App.css";
import TaskManager from "./components/TaskManager";
import { ToastProvider } from "./components/Toast";
import { initializeAuthStateFromLocalStorage } from "./stores/authStore";
import { useWeb3Store } from "./stores/web3Store";

function App() {
  const { initializeWeb3, isInitialized, error: web3Error } = useWeb3Store();

  useEffect(() => {
    initializeWeb3();

    initializeAuthStateFromLocalStorage();
  }, [initializeWeb3]);

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Initializing Web3...
      </div>
    );
  }

  if (web3Error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {web3Error}
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="App">
        <header className="App-header">
          <h1>Web3 Task Manager</h1>
        </header>
        <main>
          <TaskManager />
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
