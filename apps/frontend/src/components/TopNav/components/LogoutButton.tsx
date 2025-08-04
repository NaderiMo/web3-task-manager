import { LogOut } from "lucide-react";

import { useAuthStore } from "../../../stores/authStore";
import { useWeb3Store } from "../../../stores/web3Store";
import { useToast } from "../../../hooks/useToast";

const LogoutButton = () => {
  const { logout } = useAuthStore();
  const { disconnect } = useWeb3Store();
  const showToast = useToast();
  const handleLogout = () => {
    logout();
    disconnect();
    showToast.info("Logged out successfully.");
  };

  return (
    <button onClick={handleLogout} className="btn-danger">
      <div className="btn-content">
        <LogOut className="w-4 h-4" />
        Logout
      </div>
    </button>
  );
};

export default LogoutButton;
