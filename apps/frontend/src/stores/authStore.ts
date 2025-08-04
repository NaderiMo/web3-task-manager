import { create } from "zustand";
import { useWeb3Store } from "./web3Store";
import type { User } from "../types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: () => Promise<void>;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const API_BASE_URL = "http://localhost:3000";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async () => {
    try {
      set({ isLoading: true, error: null });

      const { address, signMessage } = useWeb3Store.getState();

      if (!address) {
        throw new Error("Wallet not connected");
      }

      const nonceResponse = await fetch(
        `${API_BASE_URL}/auth/nonce/${address}`
      );
      if (!nonceResponse.ok) {
        throw new Error(
          "Failed to get authentication nonce. Please try again."
        );
      }
      const { message } = await nonceResponse.json();

      const signature = await signMessage(message);

      const authResponse = await fetch(`${API_BASE_URL}/auth/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet: address,
          signature,
          message,
        }),
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Authentication failed. Please try again."
        );
      }

      const authData = await authResponse.json();

      set({
        token: authData.access_token,
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem("auth_token", authData.access_token);
      localStorage.setItem("auth_user", JSON.stringify(authData.user));
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });

    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export const initializeAuthStateFromLocalStorage = () => {
  const savedToken = localStorage.getItem("auth_token");
  const savedUser = localStorage.getItem("auth_user");

  if (savedToken && savedUser) {
    useAuthStore.setState({
      token: savedToken,
      user: JSON.parse(savedUser),
      isAuthenticated: true,
    });
  }
};
