<template>
  <div class="notification-center">
    <!-- Notification Bell Icon with Badge -->
    <div class="relative">
      <button
        @click="isOpen = !isOpen"
        class="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        :aria-label="`Notifications (${unreadNotificationCount})`"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          v-if="unreadNotificationCount > 0"
          class="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
        >
          {{ unreadNotificationCount }}
        </span>
      </button>

      <!-- Notification Panel -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50"
        >
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              @click="clearAll"
              v-if="notifications.length > 0"
              class="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear All
            </button>
          </div>

          <!-- Notifications List -->
          <div class="max-h-96 overflow-y-auto">
            <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
              No notifications yet
            </div>

            <div
              v-for="notification in notifications"
              :key="notification.id"
              @click="markAsRead(notification.id)"
              :class="[
                'px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors',
                notification.read ? 'bg-white' : 'bg-blue-50',
                'hover:bg-gray-50',
              ]"
            >
              <!-- Notification Icon -->
              <div class="flex items-start gap-3">
                <div
                  :class="[
                    'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                    getNotificationIconClass(notification.type),
                  ]"
                >
                  <svg
                    v-if="notification.type === 'task'"
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>

                <!-- Notification Content -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">
                    {{ notification.title }}
                  </p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ formatTime(notification.createdAt) }}
                  </p>
                </div>

                <!-- Unread Indicator -->
                <div
                  v-if="!notification.read"
                  class="flex-shrink-0 w-2 h-2 mt-1 bg-blue-600 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Click outside to close -->
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40"
        @click="isOpen = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const { notifications, unreadNotificationCount, markNotificationAsRead, clearNotifications } =
  useWebSocket();

const isOpen = ref(false);

const markAsRead = (notificationId: string) => {
  markNotificationAsRead(notificationId);
};

const clearAll = () => {
  clearNotifications();
  isOpen.value = false;
};

const getNotificationIconClass = (type: string): string => {
  const classes: Record<string, string> = {
    task: 'bg-blue-100 text-blue-600',
    system: 'bg-purple-100 text-purple-600',
    message: 'bg-green-100 text-green-600',
  };
  return classes[type] || classes.system;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};
</script>

<style scoped>
.notification-center {
  position: relative;
}
</style>
