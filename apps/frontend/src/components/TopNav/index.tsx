import React from "react";
import Brand from "./components/Brand";
import LogoutButton from "./components/LogoutButton";
import WalletInfo from "./components/WalletInfo";
import { useAuthStore } from "../../stores/authStore";

const TopNav: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="px-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Brand />
          <WalletInfo />
        </div>
        {isAuthenticated && <LogoutButton />}
      </div>
    </div>
  );
};

export default TopNav;
