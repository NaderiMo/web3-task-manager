import { create } from "zustand";
import { useAuthStore } from "./authStore";

declare global {
  interface Window {
    taskPollingIntervals?: Map<string, () => void>;
  }
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  loadingTasks: Set<string>;
  error: string | null;
  pollingTasks: Set<string>;

  pagination: PaginationInfo | null;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  statusFilter: string | null;

  fetchTasks: (
    page?: number,
    limit?: number,
    search?: string,
    status?: string
  ) => Promise<void>;
  createTask: (title: string, description?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  startTaskProcessing: (id: string) => Promise<void>;
  startStatusPolling: (taskId: string) => void;
  stopStatusPolling: (taskId: string) => void;
  pollTaskStatus: (taskId: string) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string | null) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;

  getFilteredTasks: () => Task[];
  getTaskStats: () => {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

const API_BASE_URL = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  loadingTasks: new Set<string>(),
  pollingTasks: new Set<string>(),
  error: null,

  pagination: null,
  currentPage: 1,
  itemsPerPage: 20,
  searchQuery: "",
  statusFilter: null,

  fetchTasks: async (page = 1, limit = 20, search = "", status?: string) => {
    try {
      set({ isLoading: true, error: null });

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (status) {
        params.append("status", status);
      }

      const response = await fetch(
        `${API_BASE_URL}/tasks?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      set({
        tasks: data.tasks,
        pagination: data.pagination,
        currentPage: page,
        itemsPerPage: limit,
        searchQuery: search,
        statusFilter: status,
        isLoading: false,
      });

      const activeTasks = data.tasks.filter(
        (task: Task) => task.status === "processing"
      );
      activeTasks.forEach((task: Task) => {
        get().startStatusPolling(task.id);
      });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tasks";
      set({ error: errorMessage, isLoading: false });
    }
  },

  createTask: async (title: string, description?: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const responseData = await response.json();

      set((state) => ({
        tasks: [responseData.task, ...state.tasks],
        isLoading: false,
      }));

      if (responseData.task.status === "processing") {
        get().startStatusPolling(responseData.task.id);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create task";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  createTaskImmediate: async (title: string, description?: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/tasks/create-immediate`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const responseData = await response.json();

      set((state) => ({
        tasks: [responseData.task, ...state.tasks],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to create task:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create task";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    try {
      set((state) => ({
        loadingTasks: new Set([...state.loadingTasks, id]),
        error: null,
      }));

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const responseData = await response.json();

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? responseData.task : task
        ),
        loadingTasks: new Set(
          [...state.loadingTasks].filter((taskId) => taskId !== id)
        ),
      }));
    } catch (error) {
      console.error("Failed to update task:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update task";
      set((state) => ({
        error: errorMessage,
        loadingTasks: new Set(
          [...state.loadingTasks].filter((taskId) => taskId !== id)
        ),
      }));
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete task:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete task";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  startTaskProcessing: async (id: string) => {
    try {
      set((state) => ({
        loadingTasks: new Set([...state.loadingTasks, id]),
        error: null,
      }));

      const response = await fetch(
        `${API_BASE_URL}/tasks/${id}/start-processing`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start task processing");
      }

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, status: "processing" } : task
        ),
        loadingTasks: new Set(
          [...state.loadingTasks].filter((taskId) => taskId !== id)
        ),
      }));

      get().startStatusPolling(id);
    } catch (error) {
      console.error("Failed to start task processing:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to start task processing";
      set((state) => ({
        error: errorMessage,
        loadingTasks: new Set(
          [...state.loadingTasks].filter((taskId) => taskId !== id)
        ),
      }));
      throw error;
    }
  },

  startStatusPolling: (taskId: string) => {
    const state = get();
    if (state.pollingTasks.has(taskId)) {
      return;
    }

    set((state) => ({
      pollingTasks: new Set([...state.pollingTasks, taskId]),
    }));

    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval);
      set((state) => ({
        pollingTasks: new Set(
          [...state.pollingTasks].filter((id) => id !== taskId)
        ),
      }));
    }, 30000);

    const pollInterval = setInterval(async () => {
      const currentState = get();
      const task = currentState.tasks.find((t) => t.id === taskId);

      if (!task || task.status !== "processing") {
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
        set((state) => ({
          pollingTasks: new Set(
            [...state.pollingTasks].filter((id) => id !== taskId)
          ),
        }));
        return;
      }

      try {
        await get().pollTaskStatus(taskId);
      } catch (error) {
        console.error(`Failed to poll status for task ${taskId}:`, error);
        clearInterval(pollInterval);
        clearTimeout(timeoutId);
        set((state) => ({
          pollingTasks: new Set(
            [...state.pollingTasks].filter((id) => id !== taskId)
          ),
        }));
      }
    }, 1000);

    const intervalId = pollInterval;

    const cleanup = () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      set((state) => ({
        pollingTasks: new Set(
          [...state.pollingTasks].filter((id) => id !== taskId)
        ),
      }));
    };

    if (!window.taskPollingIntervals) {
      window.taskPollingIntervals = new Map();
    }
    window.taskPollingIntervals.set(taskId, cleanup);
  },

  stopStatusPolling: (taskId: string) => {
    if (
      window.taskPollingIntervals &&
      window.taskPollingIntervals.has(taskId)
    ) {
      const cleanup = window.taskPollingIntervals.get(taskId);
      if (cleanup) {
        cleanup();
        window.taskPollingIntervals.delete(taskId);
      }
    }

    set((state) => ({
      pollingTasks: new Set(
        [...state.pollingTasks].filter((id) => id !== taskId)
      ),
    }));
  },

  pollTaskStatus: async (taskId: string) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch task status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const updatedTask = data.task;

      const currentTask = get().tasks.find((t) => t.id === taskId);
      const statusChanged =
        currentTask && currentTask.status !== updatedTask.status;

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
      }));

      if (statusChanged) {
        window.dispatchEvent(
          new CustomEvent("taskStatusChanged", {
            detail: {
              taskId,
              newStatus: updatedTask.status,
              task: updatedTask,
            },
          })
        );
      }

      if (updatedTask.status !== "processing") {
        get().stopStatusPolling(taskId);
      }
    } catch (error) {
      console.error(`Failed to poll task status for ${taskId}:`, error);

      if (error instanceof Error && error.name === "AbortError") {
      }
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchTasks(
      page,
      get().itemsPerPage,
      get().searchQuery,
      get().statusFilter || undefined
    );
  },

  setItemsPerPage: (limit: number) => {
    set({ itemsPerPage: limit, currentPage: 1 });
    get().fetchTasks(
      1,
      limit,
      get().searchQuery,
      get().statusFilter || undefined
    );
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query, currentPage: 1 });
    get().fetchTasks(
      1,
      get().itemsPerPage,
      query,
      get().statusFilter || undefined
    );
  },

  setStatusFilter: (status: string | null) => {
    set({ statusFilter: status, currentPage: 1 });
    get().fetchTasks(
      1,
      get().itemsPerPage,
      get().searchQuery,
      status || undefined
    );
  },

  goToNextPage: () => {
    const { currentPage, pagination } = get();
    if (pagination && pagination.hasNext) {
      get().setPage(currentPage + 1);
    }
  },

  goToPrevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      get().setPage(currentPage - 1);
    }
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  getFilteredTasks: () => {
    const state = get();
    let filteredTasks = [...state.tasks];

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    if (state.statusFilter) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === state.statusFilter
      );
    }

    return filteredTasks;
  },

  getTaskStats: () => {
    const state = get();
    const stats = {
      total: state.tasks.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    state.tasks.forEach((task) => {
      switch (task.status) {
        case "":
        case null:
        case "pending":
          stats.pending++;
          break;
        case "processing":
          stats.processing++;
          break;
        case "processed":
          stats.completed++;
          break;
        case "failed":
          stats.failed++;
          break;
      }
    });

    return stats;
  },
}));
