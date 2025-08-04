import React, { useState, useEffect, useRef, useCallback } from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../../../types/task";

interface VirtualizedTaskListProps {
  tasks: Task[];
  isLoading: boolean;
  loadingTasks: Set<string>;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
  onClick: (task: Task) => void;
  itemHeight?: number;
  containerHeight?: number;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  isLoading,
  loadingTasks,
  onDelete,
  onToggle,
  onClick,
  itemHeight = 70,
  containerHeight = 600,
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, tasks.length);

  const visibleTasks = tasks.slice(startIndex, endIndex);

  const totalHeight = tasks.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  }, [tasks.length]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 rounded-full border-b-2 border-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleTasks.map((task, index) => {
          const actualIndex = startIndex + index;
          const top = actualIndex * itemHeight;

          return (
            <div
              key={task.id}
              style={{
                position: "absolute",
                top,
                width: "100%",
              }}
            >
              <TaskItem
                task={task}
                onDelete={() => onDelete(task)}
                onToggle={() => onToggle(task)}
                onClick={() => onClick(task)}
                isLoading={loadingTasks.has(task.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VirtualizedTaskList;
