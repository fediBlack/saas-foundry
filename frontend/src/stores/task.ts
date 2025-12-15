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
        const { data, error } = await apiUtils.get<any>('/tasks');

        if (error) {
          this.error = getFirstErrorMessage(error);
          this.loading = false;
          return false;
        }

        // Handle different response formats from backend
        // Backend returns either { tasks: [...], count: ... } or just the array
        let tasks: Task[] = [];
        
        if (Array.isArray(data)) {
          tasks = data;
        } else if (data && typeof data === 'object' && 'tasks' in data) {
          tasks = Array.isArray(data.tasks) ? data.tasks : [];
        }

        this.tasks = tasks;
        this.loading = false;
        return true;
      } catch (err) {
        this.error = 'Failed to fetch tasks';
        this.loading = false;
        return false;
      }
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
     * Create new task (with optimistic update)
     */
    async createTask(payload: CreateTaskPayload) {
      this.error = null;

      try {
        // Create temporary task with optimistic ID
        const tempTask: Task = {
          id: -Date.now(), // Temporary negative ID
          title: payload.title,
          description: payload.description || null,
          priority: payload.priority || 'MEDIUM',
          completed: false,
          userId: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add to UI immediately
        this.tasks.unshift(tempTask);

        // Send request
        const { data, error } = await apiUtils.post<any>('/tasks', payload);

        if (error) {
          // Rollback on error
          this.tasks = this.tasks.filter((t) => t.id !== tempTask.id);
          this.error = getFirstErrorMessage(error);
          return null;
        }

        // Replace temp task with real task from server
        const task = data?.task || data;
        if (task && typeof task === 'object' && 'id' in task) {
          const index = this.tasks.findIndex((t) => t.id === tempTask.id);
          if (index !== -1) {
            this.tasks[index] = task as Task;
          }
          return task as Task;
        }
      } catch (err) {
        // Rollback on exception
        this.tasks = this.tasks.filter((t) => t.id !== (-Date.now()));
        this.error = 'Failed to create task';
      }

      return null;
    },

    /**
     * Update task (with optimistic update)
     */
    async updateTask(id: number, payload: UpdateTaskPayload) {
      this.error = null;

      try {
        // Find the task
        const index = this.tasks.findIndex((t: Task) => t.id === id);
        if (index === -1) {
          this.error = 'Task not found';
          return null;
        }

        // Store original state for rollback
        const originalTask = this.tasks[index]!;

        // Update UI immediately (optimistic)
        const updatedTask: Task = {
          ...this.tasks[index],
          ...payload,
          updatedAt: new Date().toISOString(),
        } as Task;
        this.tasks[index] = updatedTask;

        // Send request
        const { data, error } = await apiUtils.put<any>(`/tasks/${id}`, payload);

        if (error) {
          // Rollback on error
          const idx = this.tasks.findIndex((t: Task) => t.id === id);
          if (idx !== -1) {
            this.tasks[idx] = originalTask;
          }
          this.error = getFirstErrorMessage(error);
          return null;
        }

        // Update with server response
        const task = data?.task || data;
        if (task && typeof task === 'object' && 'id' in task) {
          this.tasks[index] = task as Task;
          return task as Task;
        }

        // If no data, keep optimistic update
        return this.tasks[index];
      } catch (err) {
        // Rollback on exception
        const index = this.tasks.findIndex((t: Task) => t.id === id);
        if (index !== -1) {
          // Re-assign to trigger reactivity
          this.tasks[index] = this.tasks[index]!;
        }
        this.error = 'Failed to update task';
      }

      return null;
    },

    /**
     * Toggle task completion status (with optimistic update)
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
     * Delete task (with optimistic update)
     */
    async deleteTask(id: number) {
      this.error = null;

      try {
        // Store original task for rollback
        const index = this.tasks.findIndex((t: Task) => t.id === id);
        if (index === -1) {
          this.error = 'Task not found';
          return false;
        }

        const originalTask = this.tasks[index];

        // Remove from UI immediately (optimistic)
        this.tasks.splice(index, 1);

        // Send request
        const { data, error } = await apiUtils.delete<any>(`/tasks/${id}`);

        if (error) {
          // Rollback on error - add task back
          if (originalTask) {
            this.tasks.splice(index, 0, originalTask);
          }
          this.error = getFirstErrorMessage(error);
          return false;
        }

        // Check for success message in response
        if (data?.message || data?.success) {
          return true;
        }

        // If no success message, rollback
        if (originalTask) {
          this.tasks.splice(index, 0, originalTask);
        }
        return false;
      } catch (err) {
        // Rollback on exception - re-add the task
        const index = this.tasks.findIndex((t: Task) => t.id === id);
        if (index === -1) {
          // Task was already removed, find where it should go
          const insertIndex = this.tasks.findIndex((t) => t.id > id);
          const originalTask = this.tasks.find((t) => t.id === id);
          if (originalTask) {
            if (insertIndex === -1) {
              this.tasks.push(originalTask);
            } else {
              this.tasks.splice(insertIndex, 0, originalTask);
            }
          }
        }
        this.error = 'Failed to delete task';
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
