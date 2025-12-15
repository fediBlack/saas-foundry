<script setup lang="ts">
import { Alert } from 'vue3-ui-kit';

defineProps<{
  message: string | null;
  title?: string;
}>();

const emit = defineEmits<{
  dismiss: [];
}>();
</script>

<template>
  <Alert
    v-if="message"
    variant="error"
    :title="title || 'Error'"
    :dismissible="true"
    @dismiss="emit('dismiss')"
  >
    {{ message }}
  </Alert>
</template>

<style scoped>
/* Component styles */
</style>
