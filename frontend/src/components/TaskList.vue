<script setup lang="ts">
import { Card } from 'vue3-ui-kit';
import TaskItem from './TaskItem.vue';
import type { Task } from '@/types';

defineProps<{
  tasks: Task[];
  isLoading?: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  toggle: [taskId: number];
  delete: [taskId: number];
}>();
</script>

<template>
  <Card shadow="lg">
    <template #header>
      {{ title || 'Tasks' }} ({{ tasks.length }})
    </template>

    <div v-if="isLoading" class="text-sm text-slate-500 py-8 text-center">
      Loading tasks...
    </div>

    <div v-else-if="!tasks.length" class="text-sm text-slate-500 py-8 text-center">
      No tasks yet. Create your first one above.
    </div>

    <ul v-else class="space-y-2">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-loading="isLoading"
        @toggle="emit('toggle', task.id)"
        @delete="emit('delete', task.id)"
      />
    </ul>
  </Card>
</template>

<style scoped>
/* Component styles */
</style>
