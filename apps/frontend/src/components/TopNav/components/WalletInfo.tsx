import { useAuthStore } from "../../../stores/authStore";

const formatAddress = (addr: string) => {
  return `${addr.slice(0, 6)}•••${addr.slice(-4)}`;
};

const WalletInfo = () => {
  const { user } = useAuthStore();
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-100/50 backdrop-blur-sm px-2 py-1 rounded-full border border-blue-200/30">
      {user?.wallet && formatAddress(user.wallet)}
    </div>
  );
};

export default WalletInfo;
