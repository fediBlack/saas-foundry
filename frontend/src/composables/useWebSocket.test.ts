import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useWebSocket } from '@/composables/useWebSocket';
import type { Task } from '@/types';

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Connection Management', () => {
    it('should initialize with disconnected state', () => {
      const { isConnected, connectionError } = useWebSocket();
      expect(isConnected.value).toBe(false);
      expect(connectionError.value).toBeNull();
    });

    it('should track online users', () => {
      const { onlineUsers, onlineCount } = useWebSocket();
      expect(onlineUsers.value).toEqual([]);
      expect(onlineCount.value).toBe(0);
    });
  });

  describe('Task Events', () => {
    it('should track created tasks', () => {
      const { taskEvents } = useWebSocket();
      expect(taskEvents.created).toEqual([]);
      expect(taskEvents.updated).toEqual([]);
      expect(taskEvents.deleted).toEqual([]);
      expect(taskEvents.toggled).toEqual([]);
    });

    it('should provide methods to emit task events', () => {
      const { emitTaskCreated, emitTaskUpdated, emitTaskDeleted, emitTaskToggled } =
        useWebSocket();

      expect(typeof emitTaskCreated).toBe('function');
      expect(typeof emitTaskUpdated).toBe('function');
      expect(typeof emitTaskDeleted).toBe('function');
      expect(typeof emitTaskToggled).toBe('function');
    });

    it('should clear task events', () => {
      const { clearTaskEvents, taskEvents } = useWebSocket();

      // Add some fake events
      taskEvents.created.push({
        id: 1,
        title: 'Test Task',
        description: null,
        completed: false,
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task);

      expect(taskEvents.created.length).toBeGreaterThan(0);

      clearTaskEvents();

      expect(taskEvents.created).toEqual([]);
      expect(taskEvents.updated).toEqual([]);
      expect(taskEvents.deleted).toEqual([]);
      expect(taskEvents.toggled).toEqual([]);
    });
  });

  describe('Notifications', () => {
    it('should initialize with empty notifications', () => {
      const { notifications, unreadNotificationCount } = useWebSocket();
      expect(notifications.value).toEqual([]);
      expect(unreadNotificationCount.value).toBe(0);
    });

    it('should count unread notifications correctly', () => {
      const { notifications, unreadNotificationCount } = useWebSocket();

      notifications.value = [
        {
          id: '1',
          userId: '1',
          type: 'task',
          title: 'Task Created',
          message: 'New task created',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: '1',
          type: 'task',
          title: 'Task Updated',
          message: 'Task was updated',
          read: true,
          createdAt: new Date().toISOString(),
        },
      ];

      expect(unreadNotificationCount.value).toBe(1);
    });

    it('should mark notification as read', () => {
      const { notifications, markNotificationAsRead } = useWebSocket();

      notifications.value = [
        {
          id: '1',
          userId: '1',
          type: 'task',
          title: 'Test',
          message: 'Test notification',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];

      expect(notifications.value[0].read).toBe(false);

      markNotificationAsRead('1');

      expect(notifications.value[0].read).toBe(true);
    });

    it('should clear all notifications', () => {
      const { notifications, clearNotifications } = useWebSocket();

      notifications.value = [
        {
          id: '1',
          userId: '1',
          type: 'task',
          title: 'Test',
          message: 'Test',
          read: false,
          createdAt: new Date().toISOString(),
        },
      ];

      expect(notifications.value.length).toBe(1);

      clearNotifications();

      expect(notifications.value).toEqual([]);
    });
  });

  describe('Typing Indicators', () => {
    it('should provide typing methods', () => {
      const { emitTyping, emitStoppedTyping } = useWebSocket();

      expect(typeof emitTyping).toBe('function');
      expect(typeof emitStoppedTyping).toBe('function');
    });

    it('should track typing users', () => {
      const { typingUsers } = useWebSocket();
      expect(typingUsers.value instanceof Set).toBe(true);
      expect(typingUsers.value.size).toBe(0);
    });
  });

  describe('Notifications API', () => {
    it('should provide method to send notifications', () => {
      const { sendNotification } = useWebSocket();
      expect(typeof sendNotification).toBe('function');
    });
  });
});
