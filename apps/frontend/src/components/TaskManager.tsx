import React, { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useWeb3Store } from "../stores/web3Store";
import LoadingSpinner from "./LoadingSpinner";
import { useToast } from "../hooks/useToast";
import { Lock, CheckCircle, Plus, X } from "lucide-react";
import AddTaskModal from "./AddTaskModal";
import Card from "./Card";

interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  completed: boolean;
}

const TaskManager: React.FC = () => {
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

  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const showToast = useToast();

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
      setIsLoading(true);
      await login();
      showToast.success("Welcome");
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        createdAt: new Date(),
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: "", description: "" });
      setShowAddTask(false);
      showToast.success("Task added successfully!");
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    showToast.success("Task deleted successfully!");
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Show toast for store errors
  React.useEffect(() => {
    if (web3Error) {
      showToast.error(web3Error);
    }
  }, [web3Error, showToast]);

  React.useEffect(() => {
    if (authError) {
      showToast.error(authError);
    }
  }, [authError, showToast]);

  if (!isConnected) {
    return (
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
  }

  if (!isAuthenticated) {
    return (
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
              disabled={authLoading || isLoading}
            >
              <div className="btn-content">
                {(authLoading || isLoading) && (
                  <LoadingSpinner size="sm" color="white" />
                )}
                {authLoading || isLoading
                  ? "Signing..."
                  : "Sign Message & Login"}
              </div>
            </button>

            <button className="w-full btn-secondary" onClick={disconnect}>
              <div className="btn-content">Disconnect Wallet</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">My Tasks</h3>
        <button onClick={() => setShowAddTask(true)} className="btn-primary">
          <div className="btn-content">
            <Plus className="w-4 h-4" />
            Add Task
          </div>
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-2xl backdrop-blur-sm bg-gray-50/80">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              No tasks yet
            </h4>
            <p className="text-gray-600">
              Create your first task to get started
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/30 transition-all duration-300 ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-1 gap-3 items-start">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 transition-all duration-200 ${
                      task.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {task.completed && (
                      <div className="flex justify-center items-center w-full h-full">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                  <div className="flex-1">
                    <h5
                      className={`font-medium text-gray-900 mb-1 ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </h5>
                    {task.description && (
                      <p
                        className={`text-sm text-gray-600 mb-2 ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {task.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 text-red-400 backdrop-blur-sm transition-colors hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTask}
        onClose={() => setShowAddTask(false)}
        task={newTask}
        onTaskChange={setNewTask}
        onAddTask={addTask}
      />
    </Card>
  );
};

export default TaskManager;
