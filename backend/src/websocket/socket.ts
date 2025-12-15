import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export interface SocketUser {
  id: string;
  socketId: string;
  username: string;
  connectedAt: Date;
}

export class WebSocketServer {
  private io: SocketIOServer;
  private users: Map<string, SocketUser> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> socketIds

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);

      // User connected
      socket.on('user:join', (data: { userId: string; username: string }) => {
        this.handleUserJoin(socket, data);
      });

      // Task events
      socket.on('task:created', (data) => {
        this.broadcastTaskEvent('task:created', data, socket.id);
      });

      socket.on('task:updated', (data) => {
        this.broadcastTaskEvent('task:updated', data, socket.id);
      });

      socket.on('task:deleted', (data) => {
        this.broadcastTaskEvent('task:deleted', data, socket.id);
      });

      // Notification events
      socket.on('notification:send', (data) => {
        this.broadcastNotification(data, socket.id);
      });

      // Presence events
      socket.on('user:typing', (data) => {
        this.broadcastToOthers(socket.id, 'user:typing', data);
      });

      socket.on('user:stopped-typing', (data) => {
        this.broadcastToOthers(socket.id, 'user:stopped-typing', data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket);
      });

      // Error handling
      socket.on('error', (error) => {
        console.error(`[WebSocket] Socket error (${socket.id}):`, error);
      });
    });
  }

  private handleUserJoin(socket: Socket, data: { userId: string; username: string }) {
    const user: SocketUser = {
      id: data.userId,
      socketId: socket.id,
      username: data.username,
      connectedAt: new Date(),
    };

    this.users.set(socket.id, user);

    // Track socket IDs per user (for multiple connections)
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, new Set());
    }
    this.userSockets.get(data.userId)?.add(socket.id);

    // Notify others
    this.broadcastToOthers(socket.id, 'user:online', {
      userId: data.userId,
      username: data.username,
      onlineCount: this.users.size,
    });

    // Send current online users to new user
    socket.emit('users:online', {
      users: Array.from(this.users.values()),
      count: this.users.size,
    });

    console.log(`[WebSocket] User joined: ${data.username} (${data.userId})`);
  }

  private handleUserDisconnect(socket: Socket) {
    const user = this.users.get(socket.id);

    if (user) {
      // Remove socket from user's socket set
      const userSockets = this.userSockets.get(user.id);
      userSockets?.delete(socket.id);

      // Only broadcast offline if user has no more connections
      if (userSockets?.size === 0) {
        this.userSockets.delete(user.id);
        this.broadcastToAll('user:offline', {
          userId: user.id,
          username: user.username,
          onlineCount: this.users.size - 1,
        });
      }

      this.users.delete(socket.id);
      console.log(`[WebSocket] User disconnected: ${user.username}`);
    }
  }

  private broadcastTaskEvent(event: string, data: any, socketId: string) {
    // Broadcast to all except sender
    this.io.emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  private broadcastNotification(data: any, socketId: string) {
    // Send notification to specific user or all users
    if (data.userId) {
      const userSockets = this.userSockets.get(data.userId);
      if (userSockets) {
        userSockets.forEach((sid) => {
          this.io.to(sid).emit('notification:received', {
            ...data,
            timestamp: new Date(),
          });
        });
      }
    } else {
      // Broadcast to all
      this.io.emit('notification:received', {
        ...data,
        timestamp: new Date(),
      });
    }
  }

  private broadcastToOthers(socketId: string, event: string, data: any) {
    this.io.emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  private broadcastToAll(event: string, data: any) {
    this.io.emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  // Public methods
  public emitToUser(userId: string, event: string, data: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.io.to(socketId).emit(event, {
          ...data,
          timestamp: new Date(),
        });
      });
    }
  }

  public emitToAll(event: string, data: any) {
    this.io.emit(event, {
      ...data,
      timestamp: new Date(),
    });
  }

  public getOnlineUsers(): SocketUser[] {
    return Array.from(this.users.values());
  }

  public getOnlineCount(): number {
    return this.users.size;
  }

  public getIOServer(): SocketIOServer {
    return this.io;
  }
}
