import React from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Circle,
  BarChart3,
} from "lucide-react";

interface TaskStatsProps {
  stats: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  onFilterByStatus: (status: string | null) => void;
  currentFilter: string | null;
}

const TaskStats: React.FC<TaskStatsProps> = ({
  stats,
  onFilterByStatus,
  currentFilter,
}) => {
  const statItems = [
    {
      label: "Total",
      value: stats.total,
      icon: <BarChart3 className="w-4 h-4" />,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      filterValue: null,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <Circle className="w-4 h-4 text-gray-400" />,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      filterValue: "pending",
    },
    {
      label: "Processing",
      value: stats.processing,
      icon: <Clock className="w-4 h-4 text-blue-500" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-300",
      filterValue: "processing",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
      filterValue: "processed",
    },
    {
      label: "Failed",
      value: stats.failed,
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
      filterValue: "failed",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 rounded-lg border border-gray-200 backdrop-blur-sm sm:grid-cols-5 bg-white/60">
      {statItems.map((item) => (
        <button
          key={item.label}
          onClick={() => onFilterByStatus(item.filterValue)}
          className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
            currentFilter === item.filterValue
              ? `${item.bgColor} ${item.borderColor} ${item.color}`
              : "bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex gap-1 items-center">
            {item.icon}
            <span className="text-lg font-semibold">{item.value}</span>
          </div>
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TaskStats;
