<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button, Input, Card } from 'vue3-ui-kit';
import { useTaskValidation } from '@/composables/useFormValidation';
import type { CreateTaskPayload, TaskPriority } from '@/types';

const emit = defineEmits<{
  submit: [payload: CreateTaskPayload];
}>();

const title = ref('');
const description = ref('');
const priority = ref<TaskPriority>('MEDIUM');
const isLoading = ref(false);

const validation = useTaskValidation();

const isValid = computed(() => title.value.trim().length > 0);

const handleSubmit = () => {
  const data = {
    title: title.value,
    description: description.value || undefined,
    priority: priority.value,
  };

  if (!validation.validate(data)) {
    return;
  }

  emit('submit', data);

  // Reset form
  title.value = '';
  description.value = '';
  priority.value = 'MEDIUM';
  validation.clearErrors();
};

const handleBlur = (field: string) => {
  validation.markTouched(field);
};
</script>

<template>
  <Card shadow="lg">
    <template #header>Create New Task</template>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <Input
          v-model="title"
          label="Title"
          placeholder="Task title..."
          @blur="handleBlur('title')"
          required
        />
        <p v-if="validation.getFieldError('title')" class="text-red-600 text-sm mt-1">
          {{ validation.getFieldError('title') }}
        </p>
      </div>

      <div>
        <Input
          v-model="description"
          label="Description"
          type="text"
          placeholder="Task description (optional)..."
          @blur="handleBlur('description')"
        />
        <p v-if="validation.getFieldError('description')" class="text-red-600 text-sm mt-1">
          {{ validation.getFieldError('description') }}
        </p>
      </div>

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
