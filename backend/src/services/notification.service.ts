import { WebSocketServer } from "../websocket/socket";

export interface Notification {
  id: string;
  userId: string;
  type: "task" | "system" | "message";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

export class NotificationService {
  private wsServer: WebSocketServer;
  private notifications: Map<string, Notification[]> = new Map();

  constructor(wsServer: WebSocketServer) {
    this.wsServer = wsServer;
  }

  public createNotification(
    userId: string,
    type: Notification["type"],
    title: string,
    message: string,
    data?: Record<string, any>
  ): Notification {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date(),
      data,
    };

    // Store notification
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)?.push(notification);

    // Emit via WebSocket
    this.wsServer.emitToUser(userId, "notification:created", notification);

    return notification;
  }

  public notifyTaskCreated(userId: string, taskTitle: string, taskId: number) {
    return this.createNotification(
      userId,
      "task",
      "Task Created",
      `Your task "${taskTitle}" has been created.`,
      { taskId, action: "created" }
    );
  }

  public notifyTaskUpdated(userId: string, taskTitle: string, taskId: number) {
    return this.createNotification(
      userId,
      "task",
      "Task Updated",
      `Your task "${taskTitle}" has been updated.`,
      { taskId, action: "updated" }
    );
  }

  public notifyTaskCompleted(userId: string, taskTitle: string, taskId: number) {
    return this.createNotification(
      userId,
      "task",
      "Task Completed",
      `You completed the task "${taskTitle}". Great job! 🎉`,
      { taskId, action: "completed" }
    );
  }

  public notifyTaskDeleted(userId: string, taskTitle: string, taskId: number) {
    return this.createNotification(
      userId,
      "task",
      "Task Deleted",
      `Your task "${taskTitle}" has been deleted.`,
      { taskId, action: "deleted" }
    );
  }

  public notifySystemMessage(userId: string, title: string, message: string) {
    return this.createNotification(userId, "system", title, message);
  }

  public getUserNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || [];
  }

  public markAsRead(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find((n) => n.id === notificationId);
      if (notification) {
        notification.read = true;
        return true;
      }
    }
    return false;
  }

  public clearNotifications(userId: string): void {
    this.notifications.delete(userId);
  }

  public getUnreadCount(userId: string): number {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((n) => !n.read).length;
  }
}
