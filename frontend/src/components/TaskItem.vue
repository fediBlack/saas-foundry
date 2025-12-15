<script setup lang="ts">
import { Button } from 'vue3-ui-kit';
import type { Task } from '@/types';

defineProps<{
  task: Task;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  delete: [];
}>();
</script>

<template>
  <li
    class="flex items-center justify-between rounded border bg-white px-4 py-3 hover:bg-slate-50 transition"
  >
    <div class="flex-1">
      <div class="flex items-center gap-3">
        <!-- Checkbox -->
        <input
          type="checkbox"
          :checked="task.completed"
          class="w-5 h-5 rounded cursor-pointer accent-blue-600"
          @change="emit('toggle')"
        />

        <!-- Title -->
        <p
          class="font-medium"
          :class="{ 'line-through text-slate-400': task.completed }"
        >
          {{ task.title }}
        </p>

        <!-- Priority Badge -->
        <span
          class="text-xs px-2 py-1 rounded font-medium"
          :class="{
            'bg-red-100 text-red-700': task.priority === 'HIGH',
            'bg-yellow-100 text-yellow-700': task.priority === 'MEDIUM',
            'bg-green-100 text-green-700': task.priority === 'LOW',
          }"
        >
          {{ task.priority }}
        </span>
      </div>

      <!-- Description -->
      <p v-if="task.description" class="text-sm text-slate-500 mt-2 ml-8">
        {{ task.description }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2 ml-4">
      <Button size="sm" :disabled="isLoading" @click="emit('toggle')">
        {{ task.completed ? 'Undo' : 'Done' }}
      </Button>
      <Button size="sm" variant="danger" :disabled="isLoading" @click="emit('delete')">
        Delete
      </Button>
    </div>
  </li>
</template>

<style scoped>
/* Component styles */
</style>
