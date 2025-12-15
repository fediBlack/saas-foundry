<template>
  <div class="online-users-widget">
    <div class="flex items-center gap-3">
      <!-- Status Indicator -->
      <div class="flex items-center gap-2">
        <div
          :class="[
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-500' : 'bg-red-500',
          ]"
        />
        <span :class="['text-xs font-medium', isConnected ? 'text-green-700' : 'text-red-700']">
          {{ isConnected ? 'Live' : 'Offline' }}
        </span>
      </div>

      <!-- Online Count -->
      <div
        v-if="isConnected"
        class="text-xs text-gray-600"
      >
        {{ onlineCount }} online
      </div>

      <!-- Online Users Preview -->
      <div v-if="onlineUsers.length > 0" class="flex items-center gap-1">
        <div
          v-for="(user, index) in onlineUsers.slice(0, 3)"
          :key="user.socketId"
          :title="user.username"
          :style="{ zIndex: onlineUsers.length - index }"
          class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold -ml-2 first:ml-0"
        >
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <span v-if="onlineUsers.length > 3" class="text-xs text-gray-600 ml-1">
          +{{ onlineUsers.length - 3 }}
        </span>
      </div>
    </div>

    <!-- Tooltip -->
    <div v-if="showTooltip" class="absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const { isConnected, onlineUsers, onlineCount } = useWebSocket();

const showTooltip = ref(false);

const tooltipText = ref('');

const updateTooltip = (): void => {
  if (onlineUsers.value.length === 0) {
    tooltipText.value = 'No other users online';
  } else {
    tooltipText.value = onlineUsers.value.map((u) => u.username).join(', ');
  }
  // Method is defined but may not be used yet - reserved for future use
  void updateTooltip;
};
</script>

<style scoped>
.online-users-widget {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(248, 249, 250, 0.5);
  border-radius: 0.375rem;
}
</style>
