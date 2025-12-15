<script setup lang="ts">
import { onMounted } from 'vue';
import { useTaskStore } from '@/stores/task';
import { useAuthStore } from '@/stores/auth';
import { useWebSocket } from '@/composables/useWebSocket';
import AppLayout from '@/layouts/AppLayout.vue';
import TaskForm from '@/components/TaskForm.vue';
import TaskList from '@/components/TaskList.vue';
import ErrorDisplay from '@/components/ErrorDisplay.vue';
import NotificationCenter from '@/components/NotificationCenter.vue';
import OnlineUsers from '@/components/OnlineUsers.vue';
import type { CreateTaskPayload } from '@/types';

const tasks = useTaskStore();
const auth = useAuthStore();
const { emitTaskDeleted } = useWebSocket(
  auth.user?.id?.toString(),
  auth.user?.name || undefined
);

const handleCreateTask = async (payload: CreateTaskPayload) => {
  await tasks.createTask(payload);
};

const handleToggleTask = async (taskId: number) => {
  await tasks.toggleTask(taskId);
};

const handleDeleteTask = async (taskId: number) => {
  await tasks.deleteTask(taskId);
  emitTaskDeleted(taskId);
};

onMounted(async () => {
  await tasks.fetchTasks();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header with WebSocket Status -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">My Tasks</h1>
          <p class="text-slate-600 mt-2">Manage your tasks efficiently</p>
        </div>
        <div class="flex items-center gap-4">
          <NotificationCenter />
          <OnlineUsers />
        </div>
      </div>

      <!-- Task Form -->
      <TaskForm @submit="handleCreateTask" />

      <!-- Error Display -->
      <ErrorDisplay
        :message="tasks.error"
        @dismiss="tasks.clearError"
      />

      <!-- Task List -->
      <TaskList
        :tasks="tasks.tasks"
        :is-loading="tasks.loading"
        :title="`My Tasks`"
        @toggle="handleToggleTask"
        @delete="handleDeleteTask"
      />

      <!-- Task Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-slate-600">Total Tasks</p>
          <p class="text-2xl font-bold text-slate-900">{{ tasks.taskCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-slate-600">Completed</p>
          <p class="text-2xl font-bold text-green-600">{{ tasks.completedCount }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-slate-600">Pending</p>
          <p class="text-2xl font-bold text-orange-600">{{ tasks.pendingCount }}</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>