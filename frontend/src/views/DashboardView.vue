<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { Button, Input, Card, Alert } from "vue3-ui-kit";

interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt?: string;
}

const tasks = ref<Task[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const newTitle = ref("");
const newDescription = ref("");

const auth = useAuthStore();
const router = useRouter();

const fetchTasks = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get("/tasks", {
      // si tu veux aussi accepter le header token en plus du cookie:
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    });
    tasks.value = res.data.tasks || res.data;
  } catch (err: any) {
    error.value = err.response?.data?.error || "Failed to load tasks";
    if (err.response?.status === 401) {
      auth.user = null;
      auth.token = null;
      router.push({ name: "login" });
    }
  } finally {
    loading.value = false;
  }
};

const addTask = async () => {
  if (!newTitle.value.trim()) return;
  try {
    const res = await axios.post(
      "/tasks",
      {
        title: newTitle.value,
        description: newDescription.value || null,
      },
      {
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      }
    );
    tasks.value.unshift(res.data.task || res.data);
    newTitle.value = "";
    newDescription.value = "";
  } catch (err: any) {
    error.value = err.response?.data?.error || "Failed to add task";
  }
};

const toggleCompleted = async (task: Task) => {
  try {
    const res = await axios.put(
      `/tasks/${task.id}`,
      { completed: !task.completed },
      {
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      }
    );
    const updated = res.data.task || res.data;
    const index = tasks.value.findIndex((t) => t.id === task.id);
    if (index !== -1) tasks.value[index] = updated;
  } catch (err: any) {
    error.value = err.response?.data?.error || "Failed to update task";
  }
};

const deleteTask = async (task: Task) => {
  try {
    await axios.delete(`/tasks/${task.id}`, {
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    });
    tasks.value = tasks.value.filter((t) => t.id !== task.id);
  } catch (err: any) {
    error.value = err.response?.data?.error || "Failed to delete task";
  }
};

const logout = async () => {
  await auth.logout();
  router.push({ name: "login" });
};

onMounted(() => {
  fetchTasks();
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 py-10">
    <div class="max-w-3xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Dashboard</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm text-slate-600">
            {{ auth.user?.email }}
          </span>
          <Button @click="logout">Logout</Button>
        </div>
      </div>

      <Card shadow="lg">
        <template #header>New Task</template>

        <form class="space-y-4" @submit.prevent="addTask">
          <Input v-model="newTitle" label="Title" required />
          <Input v-model="newDescription" label="Description" type="text" />
          <Button class="w-full" type="submit">Add task</Button>
        </form>
      </Card>

      <Alert v-if="error" variant="error" title="Error" :dismissible="false">
        {{ error }}
      </Alert>

      <Card shadow="lg">
        <template #header>My Tasks</template>

        <div v-if="loading" class="text-sm text-slate-500">
          Loading tasks...
        </div>

        <div v-else-if="!tasks.length" class="text-sm text-slate-500">
          No tasks yet. Create your first one above.
        </div>

        <ul v-else class="space-y-2">
          <li
            v-for="task in tasks"
            :key="task.id"
            class="flex items-center justify-between rounded border bg-white px-3 py-2"
          >
            <div>
              <p
                class="font-medium"
                :class="{ 'line-through text-slate-400': task.completed }"
              >
                {{ task.title }}
              </p>
              <p v-if="task.description" class="text-xs text-slate-500">
                {{ task.description }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Button size="sm" @click="toggleCompleted(task)">
                {{ task.completed ? "Undo" : "Done" }}
              </Button>
              <Button size="sm" variant="danger" @click="deleteTask(task)">
                Delete
              </Button>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>
