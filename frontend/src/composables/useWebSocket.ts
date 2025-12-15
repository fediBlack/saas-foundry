import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import io, { Socket } from 'socket.io-client';

interface WebSocketUser {
  id: string;
  socketId: string;
  username: string;
  connectedAt: string;
}

interface Notification {
  id: string;
  userId: string;
  type: 'task' | 'system' | 'message';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useWebSocket(userId?: string, username?: string) {
  // Connection state
  const isConnected = ref(false);
  const connectionError = ref<string | null>(null);

  // User data
  const onlineUsers = ref<WebSocketUser[]>([]);
  const onlineCount = ref(0);

  // Tasks
  const taskEvents = reactive<{
    created: Task[];
    updated: Task[];
    deleted: number[];
    toggled: Task[];
  }>({
    created: [],
    updated: [],
    deleted: [],
    toggled: [],
  });

  // Notifications
  const notifications = ref<Notification[]>([]);
  const unreadNotificationCount = computed(() =>
    notifications.value.filter((n) => !n.read).length
  );

  // Typing indicators
  const typingUsers = ref<Set<string>>(new Set());

  // Socket instance
  let socket: Socket | null = null;

  const connect = () => {
    try {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      socket = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        isConnected.value = true;
        connectionError.value = null;
        console.log('[WebSocket] Connected');

        // Join with user data
        if (userId && username) {
          socket?.emit('user:join', {
            userId,
            username,
          });
        }
      });

      socket.on('disconnect', () => {
        isConnected.value = false;
        console.log('[WebSocket] Disconnected');
      });

      socket.on('connect_error', (error: any) => {
        connectionError.value = error.message || 'Connection error';
        console.error('[WebSocket] Connection error:', error);
      });

      // User events
      socket.on('users:online', (data: { users: WebSocketUser[]; count: number }) => {
        onlineUsers.value = data.users;
        onlineCount.value = data.count;
      });

      socket.on('user:online', (data: { userId: string; username: string; onlineCount: number }) => {
        onlineCount.value = data.onlineCount;
        console.log(`[WebSocket] ${data.username} is now online`);
      });

      socket.on('user:offline', (data: { userId: string; username: string; onlineCount: number }) => {
        onlineCount.value = data.onlineCount;
        console.log(`[WebSocket] ${data.username} is now offline`);
      });

      // Task events
      socket.on('task:created', (data: { task: Task; userId: string; timestamp: string }) => {
        taskEvents.created.unshift(data.task);
      });

      socket.on('task:updated', (data: { task: Task; userId: string; timestamp: string }) => {
        taskEvents.updated.unshift(data.task);
      });

      socket.on('task:deleted', (data: { taskId: number; userId: string; timestamp: string }) => {
        if (!taskEvents.deleted.includes(data.taskId)) {
          taskEvents.deleted.unshift(data.taskId);
        }
      });

      socket.on('task:toggled', (data: { task: Task; userId: string; timestamp: string }) => {
        taskEvents.toggled.unshift(data.task);
      });

      // Notification events
      socket.on('notification:created', (data: Notification) => {
        notifications.value.unshift(data);
      });

      socket.on('notification:received', (data: Notification) => {
        notifications.value.unshift(data);
      });

      // Typing events
      socket.on('user:typing', (data: { userId: string; username: string }) => {
        typingUsers.value.add(data.username);
      });

      socket.on('user:stopped-typing', (data: { userId: string; username: string }) => {
        typingUsers.value.delete(data.username);
      });

      // Error handling
      socket.on('error', (error: any) => {
        console.error('[WebSocket] Error:', error);
        connectionError.value = 'An error occurred with WebSocket';
      });
    } catch (error: any) {
      connectionError.value = error.message;
      console.error('[WebSocket] Failed to connect:', error);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
    }
  };

  const emitTaskCreated = (task: Task) => {
    socket?.emit('task:created', { task });
  };

  const emitTaskUpdated = (task: Task) => {
    socket?.emit('task:updated', { task });
  };

  const emitTaskDeleted = (taskId: number) => {
    socket?.emit('task:deleted', { taskId });
  };

  const emitTaskToggled = (task: Task) => {
    socket?.emit('task:toggled', { task });
  };

  const emitTyping = (userId: string, username: string) => {
    socket?.emit('user:typing', { userId, username });
  };

  const emitStoppedTyping = (userId: string, username: string) => {
    socket?.emit('user:stopped-typing', { userId, username });
  };

  const sendNotification = (userId: string, notification: Omit<Notification, 'id' | 'createdAt'>) => {
    socket?.emit('notification:send', {
      ...notification,
      userId,
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    const notification = notifications.value.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  const clearTaskEvents = () => {
    taskEvents.created = [];
    taskEvents.updated = [];
    taskEvents.deleted = [];
    taskEvents.toggled = [];
  };

  onMounted(() => {
    connect();
  });

  onUnmounted(() => {
    disconnect();
  });

  return {
    // Connection
    isConnected,
    connectionError,
    connect,
    disconnect,

    // Users
    onlineUsers,
    onlineCount,

    // Tasks
    taskEvents,
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
    emitTaskToggled,
    clearTaskEvents,

    // Notifications
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    clearNotifications,
    sendNotification,

    // Typing
    typingUsers,
    emitTyping,
    emitStoppedTyping,
  };
}
