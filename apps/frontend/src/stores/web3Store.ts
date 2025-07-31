import { create } from "zustand";

interface Web3State {
  isConnected: boolean;
  address: string | null;
  isInitialized: boolean;
  error: string | null;
  isLoading: boolean;

  // Actions
  initializeWeb3: () => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useWeb3Store = create<Web3State>((set, get) => ({
  isConnected: false,
  address: null,
  isInitialized: false,
  error: null,
  isLoading: false,

  initializeWeb3: async () => {
    try {
      set({ isLoading: true, error: null });

      // Check if MetaMask is available
      if (typeof window.ethereum !== "undefined") {
        // Set up event listeners
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length === 0) {
            set({
              isConnected: false,
              address: null,
              error: null,
            });
          } else {
            set({
              isConnected: true,
              address: accounts[0],
              error: null,
            });
          }
        });

        window.ethereum.on("disconnect", () => {
          set({
            isConnected: false,
            address: null,
            error: null,
          });
        });

        // Check if already connected
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            set({
              isConnected: true,
              address: accounts[0],
              error: null,
            });
          }
        } catch (error) {
          console.log("No existing connection", error);
        }
      }

      set({ isInitialized: true, isLoading: false });
    } catch (error) {
      console.error("Failed to initialize Web3:", error);
      set({
        error:
          "Failed to initialize Web3. Please make sure MetaMask is installed.",
        isInitialized: true,
        isLoading: false,
      });
    }
  },

  connect: async () => {
    try {
      set({ isLoading: true, error: null });

      if (!get().isInitialized) {
        throw new Error("Web3 not initialized");
      }

      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask not found. Please install MetaMask.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        set({
          isConnected: true,
          address: accounts[0],
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(
          "No accounts found. Please connect your wallet in MetaMask."
        );
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect wallet";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  disconnect: () => {
    try {
      set({
        isConnected: false,
        address: null,
        error: null,
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
      set({ error: "Failed to disconnect" });
    }
  },

  signMessage: async (message: string) => {
    const { isConnected, address } = get();

    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask not found");
    }

    try {
      set({ isLoading: true, error: null });
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });
      set({ isLoading: false, error: null });
      return signature;
    } catch (error) {
      console.error("Failed to sign message:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to sign message";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
