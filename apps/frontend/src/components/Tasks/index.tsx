import {
  ArrowLeft,
  CheckCircle,
  Edit,
  List,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTaskNotifications } from "../../hooks/useTaskNotifications";
import { useToast } from "../../hooks/useToast";
import { useAuthStore } from "../../stores/authStore";
import { useTasksStore } from "../../stores/tasksStore";
import { useWeb3Store } from "../../stores/web3Store";
import type { Task } from "../../types/task";
import Button from "../Button";
import Card from "../Card";
import ConfirmModal from "../ConfirmModal";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import LoadingTasks from "./components/LoadingTasks";
import SearchTask from "./components/SearchTask";
import StatusIndicator from "./components/StatusIndicator";
import VirtualizedTaskList from "./components/VirtualizedTaskList";

type ViewMode = "list" | "add" | "detail" | "edit";

const Tasks: React.FC = () => {
  const {
    isConnected,
    address,
    connect,
    disconnect,
    isLoading: web3Loading,
    error: web3Error,
  } = useWeb3Store();

  const {
    isAuthenticated,
    login,
    isLoading: authLoading,
    error: authError,
  } = useAuthStore();

  const {
    tasks,
    isLoading: tasksLoading,
    loadingTasks,
    error: tasksError,
    searchQuery,
    statusFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    startTaskProcessing,
    setSearchQuery,
  } = useTasksStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const showToast = useToast();
  const { notifyTaskStatusChange } = useTaskNotifications();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  useEffect(() => {
    const handleTaskStatusChange = (event: CustomEvent) => {
      const { newStatus } = event.detail;
      notifyTaskStatusChange(newStatus);
    };

    window.addEventListener(
      "taskStatusChanged",
      handleTaskStatusChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "taskStatusChanged",
        handleTaskStatusChange as EventListener
      );
    };
  }, [notifyTaskStatusChange]);

  useEffect(() => {
    if (web3Error) {
      showToast.error(web3Error);
    }
  }, [web3Error, showToast]);

  useEffect(() => {
    if (authError) {
      showToast.error(authError);
    }
  }, [authError, showToast]);

  useEffect(() => {
    if (tasksError) {
      showToast.error(tasksError);
    }
  }, [tasksError, showToast]);

  const handleConnect = async () => {
    try {
      await connect();
      showToast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Connection error:", error);
      showToast.error(
        "Failed to connect wallet. Please make sure MetaMask is installed and try again."
      );
    }
  };

  const handleLogin = async () => {
    try {
      await login();
      showToast.success("Welcome");
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("Authentication failed. Please try again.");
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleAddTask = async () => {
    if (newTask.title.trim()) {
      try {
        if (viewMode === "edit" && selectedTask) {
          await updateTask(selectedTask.id, {
            title: newTask.title.trim(),
            description: newTask.description.trim() || undefined,
          });
          showToast.success("Task updated successfully!");
          setViewMode("detail");
        } else {
          await createTask(
            newTask.title.trim(),
            newTask.description.trim() || undefined
          );
          showToast.success("Task added successfully!");
          setViewMode("list");
        }
        setNewTask({ title: "", description: "" });
        setSelectedTask(null);
      } catch (error) {
        console.error("Failed to save task:", error);
        showToast.error("Failed to save task. Please try again.");
      }
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteClickById = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete.id);
        showToast.success("Task deleted successfully!");
        setShowDeleteModal(false);
        setTaskToDelete(null);
        if (
          viewMode === "detail" &&
          selectedTask &&
          selectedTask.id === taskToDelete.id
        ) {
          setViewMode("list");
          setSelectedTask(null);
        }
      } catch (error) {
        console.error("Failed to delete task:", error);
        showToast.error("Failed to delete task. Please try again.");
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task && (task.status === "" || task.status === null)) {
        await startTaskProcessing(taskId);
        showToast.success("Task processing started!");

        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({ ...selectedTask, status: "processing" });
        }
      } else if (task && task.status === "processed") {
        await updateTask(taskId, { status: "" });
        showToast.success("Task reset to default!");

        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask({ ...selectedTask, status: "" });
        }
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      showToast.error("Failed to update task. Please try again.");
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setNewTask({ title: "", description: "" });
    setSelectedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setViewMode("detail");
  };

  const handleEditTask = (task: Task) => {
    setNewTask({
      title: task.title,
      description: task.description || "",
    });
    setSelectedTask(task);
    setViewMode("edit");
  };

  let mainContent;

  if (!isConnected) {
    mainContent = (
      <Card>
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 rounded-2xl backdrop-blur-sm bg-blue-50/80">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 backdrop-blur-sm">
            Connect your Web3 wallet to access your tasks
          </p>
        </div>

        <button
          className="w-full btn-primary"
          onClick={handleConnect}
          disabled={web3Loading}
        >
          <div className="btn-content">
            {web3Loading && <LoadingSpinner size="sm" color="white" />}
            {web3Loading ? "Connecting..." : "Connect Wallet"}
          </div>
        </button>
      </Card>
    );
  } else if (!isAuthenticated) {
    mainContent = (
      <div className="mx-auto max-w-md animate-fade-in">
        <div className="p-8 glass-card glass-card-hover">
          <div className="mb-8 text-center">
            <div className="flex justify-center items-center mx-auto mb-6 w-16 h-16 rounded-2xl backdrop-blur-sm bg-green-50/80">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Authenticate
            </h2>
            <p className="mb-4 text-gray-600 backdrop-blur-sm">
              Sign a message to verify your wallet ownership
            </p>
            <div className="p-4 mb-6 rounded-xl border backdrop-blur-sm bg-gray-50/80 border-white/30">
              <p className="text-sm text-gray-600">Connected:</p>
              <p className="font-mono text-sm text-gray-900">
                {address && formatAddress(address)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="w-full btn-success"
              onClick={handleLogin}
              disabled={authLoading}
            >
              <div className="btn-content">
                {authLoading && <LoadingSpinner size="sm" color="white" />}
                {authLoading ? "Signing..." : "Sign Message & Login"}
              </div>
            </button>

            <button className="w-full btn-secondary" onClick={disconnect}>
              <div className="btn-content">Disconnect Wallet</div>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (viewMode === "add" || viewMode === "edit") {
    mainContent = (
      <Card isFullWidth>
        <div className="flex gap-4 items-center mb-6">
          <button
            onClick={handleBackToList}
            className="flex gap-2 items-center text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" size={1.5} />
            Back to Tasks
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            {viewMode === "edit" ? "Edit Task" : "Add New Task"}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="px-4 py-3 w-full rounded-xl border border-gray-300 backdrop-blur-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              rows={4}
              className="px-4 py-3 w-full rounded-xl border border-gray-300 backdrop-blur-sm transition-all duration-200 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white/80"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleBackToList}
            className="flex-1 px-4 py-3 font-medium text-gray-700 rounded-xl border border-gray-300 transition-all duration-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTask}
            disabled={!newTask.title.trim() || tasksLoading}
            className="flex-1 px-4 py-3 font-medium text-white bg-blue-500 rounded-xl transition-all duration-200 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tasksLoading ? (
              <div className="flex gap-2 justify-center items-center">
                <LoadingSpinner size="sm" color="white" />
                {viewMode === "edit" ? "Updating..." : "Adding..."}
              </div>
            ) : viewMode === "edit" ? (
              "Update Task"
            ) : (
              "Add Task"
            )}
          </button>
        </div>
      </Card>
    );
  } else if (viewMode === "detail" && selectedTask) {
    mainContent = (
      <Card isFullWidth>
        <div className="flex gap-4 items-center mb-6">
          <button
            onClick={handleBackToList}
            className="flex gap-2 items-center text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" size={1.5} />
            Back to Tasks
          </button>
          <h3 className="text-xl font-semibold text-gray-900">Task Details</h3>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => handleToggleTask(selectedTask.id)}
              disabled={selectedTask.status === "processing"}
              className="transition-all duration-200 focus:outline-none disabled:opacity-50"
            >
              <StatusIndicator status={selectedTask.status} size="lg" />
            </button>
            <h4 className="text-lg font-medium text-gray-900">
              {selectedTask.title}
            </h4>
          </div>

          {selectedTask.description && (
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700">
                Description
              </h5>
              <p className="leading-relaxed text-gray-600">
                {selectedTask.description}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span className="font-medium">Status:</span>
              <StatusIndicator
                status={selectedTask.status}
                size="sm"
                showText
              />
            </div>
            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span className="font-medium">Created:</span>
              <span>
                {new Date(selectedTask.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2 items-center text-sm text-gray-500">
              <span className="font-medium">Last updated:</span>
              <span>
                {new Date(selectedTask.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleEditTask(selectedTask)}
              className="flex flex-1 gap-2 justify-center items-center px-4 py-2 font-medium text-blue-600 rounded-xl border border-blue-300 transition-all duration-200 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
              Edit Task
            </button>
            <button
              onClick={() => handleDeleteClick(selectedTask)}
              className="flex flex-1 gap-2 justify-center items-center px-4 py-2 font-medium text-red-600 rounded-xl border border-red-300 transition-all duration-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Delete Task
            </button>
          </div>
        </div>
      </Card>
    );
  } else {
    mainContent = (
      <Card isFullWidth>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Task List</h3>
          <Button
            onClick={() => setViewMode("add")}
            variant="primary"
            Icon={<Plus className="w-4 h-4" />}
          >
            Add Task
          </Button>
        </div>

        <SearchTask searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {tasksLoading ? (
          <LoadingTasks />
        ) : (
          <div className="min-h-[400px]">
            {tasks.length === 0 ? (
              <EmptyState
                title="No tasks found"
                description={
                  searchQuery || statusFilter
                    ? "Try adjusting your search or filters"
                    : "Create your first task to get started"
                }
                icon={<List className="w-8 h-8 text-gray-400" />}
              />
            ) : (
              <VirtualizedTaskList
                tasks={tasks}
                isLoading={tasksLoading}
                loadingTasks={loadingTasks}
                onDelete={(task) => handleDeleteClickById(task.id)}
                onToggle={(task) => handleToggleTask(task.id)}
                onClick={handleTaskClick}
                itemHeight={80}
                containerHeight={400}
              />
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <>
      {mainContent}
      {showDeleteModal && taskToDelete && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the task "${taskToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          icon={<Trash2 className="w-8 h-8 text-red-500" />}
        />
      )}
    </>
  );
};

export default Tasks;
