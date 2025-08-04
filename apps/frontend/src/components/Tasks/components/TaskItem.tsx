import React from "react";
import { X, Circle, CircleCheckBig, Clock, AlertCircle } from "lucide-react";
import type { Task } from "../../../types/task";
import StatusIndicator from "./StatusIndicator";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onClick: (task: Task) => void;
  isLoading?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onClick,
  isLoading = false,
}) => {
  const getStatusInfo = () => {
    switch (task.status) {
      case "processing":
        return {
          icon: <Clock className="w-4 h-4 text-blue-500" />,
          statusText: "Processing",
          statusClass: "text-blue-600 bg-blue-50",
          containerClass: "border-blue-200/50",
          opacity: "opacity-80",
        };
      case "processed":
        return {
          icon: <CircleCheckBig className="w-4 h-4 text-green-500" />,
          statusText: "Done",
          statusClass: "text-green-600 bg-green-50",
          containerClass: "border-green-200/50",
          opacity: "opacity-60",
        };
      case "failed":
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          statusText: "Failed",
          statusClass: "text-red-600 bg-red-50",
          containerClass: "border-red-200/50",
          opacity: "opacity-80",
        };
      default:
        return {
          icon: <Circle className="w-4 h-4 text-gray-400" />,
          statusText: "Pending",
          statusClass: "text-gray-600 bg-gray-50",
          containerClass: "border-gray-200/50",
          opacity: "",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`bg-white/60 backdrop-blur-sm rounded-lg p-6 border transition-all duration-200 cursor-pointer hover:bg-white/80 ${statusInfo.containerClass} ${statusInfo.opacity}`}
      onClick={() => onClick(task)}
    >
      <div className="flex gap-2 items-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (
              !isLoading &&
              (task.status === "" ||
                task.status === null ||
                task.status === "processed")
            ) {
              onToggle(task.id);
            }
          }}
          disabled={isLoading || task.status === "processing"}
          className="flex-shrink-0 transition-all duration-200 focus:outline-none"
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full border-2 border-gray-400 animate-spin border-t-transparent"></div>
          ) : (
            <StatusIndicator status={task.status} size="sm" />
          )}
        </button>

        <div className="flex flex-1 gap-3 items-center min-w-0">
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 items-center">
              <h5
                className={`font-medium text-gray-900 truncate flex-1 min-w-0 ${
                  task.status === "processed" ? "line-through" : ""
                }`}
                title={task.title}
              >
                {task.title}
              </h5>
              {/* Only show description on larger screens */}
              {task.description && (
                <span
                  className={`text-sm text-gray-600 truncate max-w-32 hidden sm:inline-block ${
                    task.status === "processed" ? "line-through" : ""
                  }`}
                  title={task.description}
                >
                  • {task.description}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-shrink-0 gap-2 items-center">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${statusInfo.statusClass}`}
            >
              {statusInfo.statusText}
            </span>

            <span className="flex-shrink-0 text-xs text-gray-500">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          disabled={task.status === "processing"}
          className="flex-shrink-0 text-red-400 opacity-0 transition-colors hover:text-red-600 group-hover:opacity-100 focus:outline-none disabled:opacity-30"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
