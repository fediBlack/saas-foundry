<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTaskStore } from '@/stores/task';
import { Button, Input, Card, Alert } from 'vue3-ui-kit';
import type { CreateTaskPayload, TaskPriority } from '@/types';

const auth = useAuthStore();
const tasks = useTaskStore();
const router = useRouter();

// Form state
const newTitle = ref('');
const newDescription = ref('');
const newPriority = ref<TaskPriority>('MEDIUM');

const handleAddTask = async () => {
  if (!newTitle.value.trim()) return;

  const payload: CreateTaskPayload = {
    title: newTitle.value,
    description: newDescription.value || undefined,
    priority: newPriority.value,
  };

  const result = await tasks.createTask(payload);
  if (result) {
    newTitle.value = '';
    newDescription.value = '';
    newPriority.value = 'MEDIUM';
  }
};

const handleLogout = async () => {
  await auth.logout();
  router.push({ name: 'login' });
};

onMounted(async () => {
  await tasks.fetchTasks();
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-10">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Dashboard</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-600">{{ auth.user?.email }}</span>
          <Button @click="handleLogout">Logout</Button>
        </div>
      </div>

      <!-- New Task Form -->
      <Card shadow="lg">
        <template #header>Create New Task</template>

        <form class="space-y-4" @submit.prevent="handleAddTask">
          <Input v-model="newTitle" label="Title" placeholder="Task title..." required />
          <Input
            v-model="newDescription"
            label="Description"
            type="text"
            placeholder="Task description (optional)..."
          />
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <select
              v-model="newPriority"
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <Button :loading="tasks.loading" class="w-full" type="submit">
            Add Task
          </Button>
        </form>
      </Card>

      <!-- Error Alert -->
      <Alert v-if="tasks.error" variant="error" title="Error" :dismissible="true">
        {{ tasks.error }}
      </Alert>

      <!-- Tasks List -->
      <Card shadow="lg">
        <template #header>
          My Tasks ({{ tasks.taskCount }})
        </template>

        <div v-if="tasks.loading" class="text-sm text-slate-500">Loading tasks...</div>

        <div v-else-if="!tasks.taskCount" class="text-sm text-slate-500">
          No tasks yet. Create your first one above.
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="task in tasks.tasks"
            :key="task.id"
            class="flex items-center justify-between rounded border bg-white px-3 py-2 hover:bg-slate-50 transition"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p
                  class="font-medium"
                  :class="{ 'line-through text-slate-400': task.completed }"
                >
                  {{ task.title }}
                </p>
                <span
                  class="text-xs px-2 py-1 rounded"
                  :class="{
                    'bg-red-100 text-red-700': task.priority === 'HIGH',
                    'bg-yellow-100 text-yellow-700': task.priority === 'MEDIUM',
                    'bg-green-100 text-green-700': task.priority === 'LOW',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
              <p v-if="task.description" class="text-xs text-slate-500 mt-1">
                {{ task.description }}
              </p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <Button size="sm" @click="tasks.toggleTask(task.id)">
                {{ task.completed ? 'Undo' : 'Done' }}
              </Button>
              <Button size="sm" variant="danger" @click="tasks.deleteTask(task.id)">
                Delete
              </Button>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>