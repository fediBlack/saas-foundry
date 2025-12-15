<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Input, Card } from 'vue3-ui-kit';
import type { CreateTaskPayload, TaskPriority } from '@/types';

const emit = defineEmits<{
  submit: [payload: CreateTaskPayload];
}>();

const title = ref('');
const description = ref('');
const priority = ref<TaskPriority>('MEDIUM');
const isLoading = ref(false);

const isValid = computed(() => title.value.trim().length > 0);

const handleSubmit = () => {
  if (!isValid.value) return;

  emit('submit', {
    title: title.value,
    description: description.value || undefined,
    priority: priority.value,
  });

  // Reset form
  title.value = '';
  description.value = '';
  priority.value = 'MEDIUM';
};
</script>

<template>
  <Card shadow="lg">
    <template #header>Create New Task</template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <Input
        v-model="title"
        label="Title"
        placeholder="Task title..."
        required
      />
      <Input
        v-model="description"
        label="Description"
        type="text"
        placeholder="Task description (optional)..."
      />
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          Priority
        </label>
        <select
          v-model="priority"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
      <Button :loading="isLoading" class="w-full" type="submit" :disabled="!isValid">
        Add Task
      </Button>
    </form>
  </Card>
</template>

<style scoped>
/* Component styles */
</style>
