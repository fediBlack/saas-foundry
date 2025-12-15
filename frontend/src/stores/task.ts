import { defineStore } from 'pinia';
import { apiUtils } from '@/utils';
import { getFirstErrorMessage } from '@/utils/errors';
import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskState } from '@/types';

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    loading: false,
    error: null,
  }),

  getters: {
    taskCount: (state) => state.tasks.length,
    completedCount: (state) => state.tasks.filter((t: Task) => t.completed).length,
    pendingCount: (state) => state.tasks.filter((t: Task) => !t.completed).length,
    highPriorityTasks: (state) => state.tasks.filter((t: Task) => t.priority === 'HIGH'),
    mediumPriorityTasks: (state) => state.tasks.filter((t: Task) => t.priority === 'MEDIUM'),
    lowPriorityTasks: (state) => state.tasks.filter((t: Task) => t.priority === 'LOW'),
  },

  actions: {
    /**
     * Fetch all tasks
     */
    async fetchTasks() {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.get<Task[]>('/tasks');

        if (error) {
          this.error = getFirstErrorMessage(error);
          return false;
        }

        if (Array.isArray(data)) {
          this.tasks = data;
          return true;
        }
      } catch (err) {
        this.error = 'Failed to fetch tasks';
      } finally {
        this.loading = false;
      }

      return false;
    },

    /**
     * Fetch single task by ID
     */
    async fetchTask(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.get<Task>(`/tasks/${id}`);

        if (error) {
          this.error = getFirstErrorMessage(error);
          return null;
        }

        return data || null;
      } catch (err) {
        this.error = 'Failed to fetch task';
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new task
     */
    async createTask(payload: CreateTaskPayload) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.post<Task>('/tasks', payload);

        if (error) {
          this.error = getFirstErrorMessage(error);
          return null;
        }

        if (data) {
          this.tasks.push(data);
          return data;
        }
      } catch (err) {
        this.error = 'Failed to create task';
      } finally {
        this.loading = false;
      }

      return null;
    },

    /**
     * Update task
     */
    async updateTask(id: number, payload: UpdateTaskPayload) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.patch<Task>(`/tasks/${id}`, payload);

        if (error) {
          this.error = getFirstErrorMessage(error);
          return null;
        }

        if (data) {
          const index = this.tasks.findIndex((t: Task) => t.id === id);
          if (index !== -1) {
            this.tasks[index] = data;
          }
          return data;
        }
      } catch (err) {
        this.error = 'Failed to update task';
      } finally {
        this.loading = false;
      }

      return null;
    },

    /**
     * Toggle task completion status
     */
    async toggleTask(id: number) {
      const task = this.tasks.find((t: Task) => t.id === id);
      if (!task) {
        this.error = 'Task not found';
        return null;
      }

      return this.updateTask(id, { completed: !task.completed });
    },

    /**
     * Delete task
     */
    async deleteTask(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.delete<{ success: boolean }>(`/tasks/${id}`);

        if (error) {
          this.error = getFirstErrorMessage(error);
          return false;
        }

        if (data?.success) {
          this.tasks = this.tasks.filter((t: Task) => t.id !== id);
          return true;
        }
      } catch (err) {
        this.error = 'Failed to delete task';
      } finally {
        this.loading = false;
      }

      return false;
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    },

    /**
     * Clear all tasks
     */
    clearTasks() {
      this.tasks = [];
      this.error = null;
    },
  },
});
