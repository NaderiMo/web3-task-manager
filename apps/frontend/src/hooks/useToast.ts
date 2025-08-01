import { useToastStore } from "../stores/toastStore";

export const useToast = () => {
  const { showToast } = useToastStore();
  return showToast;
};
