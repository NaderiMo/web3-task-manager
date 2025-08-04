import React from "react";
import { List } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No tasks yet",
  description = "Create your first task to get started",
  icon = <List className="w-8 h-8 text-gray-400" />,
}) => {
  return (
    <div className="py-12 text-center">
      <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-2xl backdrop-blur-sm bg-gray-50/80">
        {icon}
      </div>
      <h4 className="mb-2 text-lg font-medium text-gray-900">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default EmptyState;
