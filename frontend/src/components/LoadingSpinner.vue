<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-8">
    <!-- Spinner -->
    <div
      class="animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"
      :class="{
        'w-6 h-6': size === 'sm',
        'w-10 h-10': size === 'md' || !size,
        'w-14 h-14': size === 'lg',
      }"
    />

    <!-- Loading text -->
    <p v-if="text" class="text-sm text-slate-500">{{ text }}</p>
  </div>
</template>

<style scoped>
/* Component styles */
</style>
