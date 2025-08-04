import { useToast } from "./useToast";

export const useTaskNotifications = () => {
  const showToast = useToast();

  const notifyTaskStatusChange = (newStatus: string) => {
    switch (newStatus) {
      case "processing":
        showToast.info(`Task is now processing...`);
        break;
      case "processed":
        showToast.success(`Task completed successfully!`);
        break;
      case "failed":
        showToast.error(`Task processing failed. Please try again.`);
        break;
      case "pending":
        showToast.info(`Task reset to pending status.`);
        break;
      default:
        showToast.info(`Task status updated to: ${newStatus}`);
    }
  };

  return {
    notifyTaskStatusChange,
  };
};
