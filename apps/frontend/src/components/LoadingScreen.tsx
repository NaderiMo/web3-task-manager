import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center animate-fade-in">
        <div className="w-12 h-12 border-2 border-gray-300/50 border-t-blue-500/80 rounded-full animate-spin mx-auto mb-6 backdrop-blur-sm"></div>
        <p className="text-gray-600 font-medium backdrop-blur-sm">
          Initializing Web3...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
