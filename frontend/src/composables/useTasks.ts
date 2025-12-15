import { ref, computed } from 'vue';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types';
import { useApi } from './useApi';

/**
 * Composable for task management operations
 */
export function useTasks() {
  const { get, post, patch, delete: delete_, loading, error, errorMessages } = useApi();

  const tasks = ref<Task[]>([]);
  const selectedTask = ref<Task | null>(null);

  // Computed properties
  const tasksCount = computed(() => tasks.value.length);
  const completedCount = computed(() => tasks.value.filter((t: Task) => t.completed).length);
  const pendingCount = computed(() => tasks.value.filter((t: Task) => !t.completed).length);

  const tasksByPriority = computed(() => {
    return {
      HIGH: tasks.value.filter((t: Task) => t.priority === 'HIGH'),
      MEDIUM: tasks.value.filter((t: Task) => t.priority === 'MEDIUM'),
      LOW: tasks.value.filter((t: Task) => t.priority === 'LOW'),
    };
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    const data = await get<Task[]>('/tasks');
    if (data) {
      tasks.value = data;
    }
    return data;
  };

  // Fetch single task
  const fetchTask = async (id: number) => {
    const data = await get<Task>(`/tasks/${id}`);
    if (data) {
      selectedTask.value = data;
    }
    return data;
  };

  // Create task
  const createTask = async (payload: CreateTaskPayload) => {
    const data = await post<Task>('/tasks', payload);
    if (data) {
      tasks.value.push(data);
    }
    return data;
  };

  // Update task
  const updateTask = async (id: number, payload: UpdateTaskPayload) => {
    const data = await patch<Task>(`/tasks/${id}`, payload);
    if (data) {
      const index = tasks.value.findIndex((t) => t.id === id);
      if (index !== -1) {
        tasks.value[index] = data;
      }
      if (selectedTask.value?.id === id) {
        selectedTask.value = data;
      }
    }
    return data;
  };

  // Toggle task completion
  const toggleTask = async (id: number) => {
    const task = tasks.value.find((t: Task) => t.id === id);
    if (!task) return null;

    return updateTask(id, { completed: !task.completed });
  };

  // Delete task
  const deleteTask = async (id: number) => {
    const result = await delete_<{ success: boolean }>(`/tasks/${id}`);
    if (result?.success) {
      tasks.value = tasks.value.filter((t: Task) => t.id !== id);
      if (selectedTask.value?.id === id) {
        selectedTask.value = null;
      }
    }
    return result;
  };

  // Clear tasks
  const clearTasks = () => {
    tasks.value = [];
    selectedTask.value = null;
  };

  return {
    // State
    tasks,
    selectedTask,
    loading,
    error,
    errorMessages,

    // Computed
    tasksCount,
    completedCount,
    pendingCount,
    tasksByPriority,

    // Methods
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearTasks,
  };
}
