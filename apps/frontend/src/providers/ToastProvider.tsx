import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useToastStore } from "../stores/toastStore";

const ToastProvider: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getToastStyles = (type: "error" | "success" | "info") => {
    const baseStyles =
      "px-4 py-3 rounded-xl shadow-xl font-medium text-sm transition-all duration-300 animate-fade-in flex items-center gap-2 backdrop-blur-xl border border-white/20";

    switch (type) {
      case "error":
        return `${baseStyles} bg-red-50/90 text-red-700`;
      case "success":
        return `${baseStyles} bg-green-50/90 text-green-700`;
      case "info":
        return `${baseStyles} bg-blue-50/90 text-blue-700`;
      default:
        return baseStyles;
    }
  };

  const getIcon = (type: "error" | "success" | "info") => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 space-y-3 w-full max-w-sm">
      {toasts.map((toast) => (
        <div key={toast.id} className={getToastStyles(toast.type)}>
          {getIcon(toast.type)}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
