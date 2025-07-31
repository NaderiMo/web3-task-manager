import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useWeb3Store } from "../stores/web3Store";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "../hooks/useToast";

const TaskManager: React.FC = () => {
  const {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading: web3Loading,
    error: web3Error,
  } = useWeb3Store();

  const {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading: authLoading,
    error: authError,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      showToast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Connection error:", error);
      showToast.error(
        "Failed to connect wallet. Please make sure MetaMask is installed and try again."
      );
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
      showToast.success(
        "Authentication successful! Welcome to Web3 Task Manager."
      );
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    disconnect();
    showToast.info("Logged out successfully.");
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Show toast for store errors
  React.useEffect(() => {
    if (web3Error) {
      showToast.error(web3Error);
    }
  }, [web3Error, showToast]);

  React.useEffect(() => {
    if (authError) {
      showToast.error(authError);
    }
  }, [authError, showToast]);

  if (!isConnected) {
    return (
      <div className="task-manager">
        <div className="auth-container">
          <h2 className="text-3xl font-semibold mb-4">
            Welcome to Web3 Task Manager
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Connect your wallet to get started
          </p>
          <button
            className="btn-primary m-2 flex items-center justify-center gap-2"
            onClick={handleConnect}
            disabled={web3Loading}
          >
            {web3Loading && <LoadingSpinner size="sm" color="white" />}
            {web3Loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="task-manager">
        <div className="auth-container">
          <h2 className="text-3xl font-semibold mb-4">
            Authenticate with Web3
          </h2>
          <p className="text-lg opacity-90 mb-2">
            Connected wallet: {address && formatAddress(address)}
          </p>
          <p className="text-lg opacity-90 mb-6">
            Sign a message to authenticate and access your tasks
          </p>
          <button
            className="btn-primary m-2 flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={authLoading || isLoading}
          >
            {(authLoading || isLoading) && (
              <LoadingSpinner size="sm" color="white" />
            )}
            {authLoading || isLoading
              ? "Authenticating..."
              : "Sign Message & Login"}
          </button>
          <button className="btn-secondary m-2" onClick={disconnect}>
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-manager">
      <div className="header">
        <h2 className="text-2xl font-bold text-gray-800">Task Manager</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">
            Welcome, {user?.wallet && formatAddress(user.wallet)}
          </span>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="tasks-container">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h3>
        <p className="text-gray-600 italic">
          Task management features will be implemented here...
        </p>
        {/* Task management components will be added here */}
      </div>
    </div>
  );
};

export default TaskManager;
