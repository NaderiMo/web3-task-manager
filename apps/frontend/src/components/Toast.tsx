import React, { createContext, useState } from "react";

interface ToastMessage {
  id: string;
  type: "error" | "success" | "info";
  message: string;
}

interface ToastContextType {
  showToast: {
    error: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
  };
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "error" | "success" | "info", message: string) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(
      () => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      },
      type === "error" ? 5000 : type === "success" ? 3000 : 4000
    );
  };

  const showToast = {
    error: (message: string) => addToast("error", message),
    success: (message: string) => addToast("success", message),
    info: (message: string) => addToast("info", message),
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium text-sm transition-all duration-300 ${
              toast.type === "error"
                ? "bg-red-500"
                : toast.type === "success"
                  ? "bg-green-500"
                  : "bg-blue-500"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
