import { AlertCircle, Circle, Clock } from "lucide-react";
import React from "react";

interface StatusIndicatorProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
  showText = false,
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="text-blue-500" />,
          text: "pending",
          bgClass: "bg-blue-50",
          borderClass: "border-blue-200",
          textClass: "text-blue-600",
        };

      case "failed":
        return {
          icon: <AlertCircle className="text-red-500" />,
          text: "Failed",
          bgClass: "bg-red-50",
          borderClass: "border-red-200",
          textClass: "text-red-600",
        };
      default:
        return {
          icon: <Circle className="text-gray-400" />,
          text: "Default",
          bgClass: "bg-gray-50",
          borderClass: "border-gray-200",
          textClass: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusInfo();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconSize = sizeClasses[size];

  if (showText) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${statusInfo.bgClass} ${statusInfo.borderClass} border`}
      >
        <div className={iconSize}>{statusInfo.icon}</div>
        <span className={statusInfo.textClass}>{statusInfo.text}</span>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center ${iconSize}`}>
      {statusInfo.icon}
    </div>
  );
};

export default StatusIndicator;
