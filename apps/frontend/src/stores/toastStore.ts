import { create } from "zustand";

interface ToastMessage {
  id: string;
  type: "error" | "success" | "info";
  message: string;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (type: "error" | "success" | "info", message: string) => void;
  removeToast: (id: string) => void;
  showToast: {
    error: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
  };
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (type: "error" | "success" | "info", message: string) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, type, message };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    setTimeout(
      () => {
        get().removeToast(id);
      },
      type === "error" ? 5000 : type === "success" ? 3000 : 4000
    );
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  showToast: {
    error: (message: string) => get().addToast("error", message),
    success: (message: string) => get().addToast("success", message),
    info: (message: string) => get().addToast("info", message),
  },
}));
