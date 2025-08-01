import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="text-center max-w-md mx-auto p-8 glass-card animate-fade-in">
        <div className="w-16 h-16 bg-red-100/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Connection Error
        </h2>
        <p className="text-gray-600 mb-6 backdrop-blur-sm">{error}</p>
        <button onClick={onRetry} className="btn-primary animate-float">
          <div className="btn-content">Try Again</div>
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
