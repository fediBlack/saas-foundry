import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { WebSocketServer } from "./websocket/socket";

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize WebSocket
const wsServer = new WebSocketServer(httpServer);

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Make WebSocket server available to routes
app.locals.wsServer = wsServer;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    websocket: "connected",
    onlineUsers: wsServer.getOnlineCount(),
  });
});

// WebSocket status
app.get("/api/websocket/status", (req, res) => {
  res.json({
    status: "connected",
    onlineUsers: wsServer.getOnlineCount(),
    users: wsServer.getOnlineUsers(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket enabled on ws://localhost:${PORT}`);
});

export default app;
export { wsServer };
