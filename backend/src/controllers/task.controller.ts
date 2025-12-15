import { Response } from "express";
import prisma from "../utils/prisma";
import { AuthRequest } from "../types/auth.types";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";
import { NotFoundError, sendErrorResponse } from "../utils/errors";
import { WebSocketServer } from "../websocket/socket";

// Get all tasks for authenticated user
export const getTasks = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ tasks, count: tasks.length });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Get single task by ID
export const getTaskById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId,
      },
    });

    if (!task) {
      throw new NotFoundError("Task");
    }

    res.json({ task });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Create new task
export const createTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, priority, dueDate }: CreateTaskInput =
      req.body;

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        userId: req.userId!,
      },
    });

    // Emit WebSocket event
    const wsServer = req.app.locals.wsServer as WebSocketServer;
    if (wsServer) {
      wsServer.emitToUser(req.userId!, "task:created", {
        task,
        userId: req.userId,
      });
    }

    res.status(201).json({ task });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Update task
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);
    const { title, description, completed }: UpdateTaskInput = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId,
      },
    });

    if (!existingTask) {
      throw new NotFoundError("Task");
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && {
          description: description?.trim() || null,
        }),
        ...(completed !== undefined && { completed }),
      },
    });

    // Emit WebSocket event
    const wsServer = req.app.locals.wsServer as WebSocketServer;
    if (wsServer) {
      wsServer.emitToUser(req.userId!, "task:updated", {
        task,
        userId: req.userId,
      });
    }

    res.json({ task });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Delete task
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId,
      },
    });

    if (!existingTask) {
      throw new NotFoundError("Task");
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    // Emit WebSocket event
    const wsServer = req.app.locals.wsServer as WebSocketServer;
    if (wsServer) {
      wsServer.emitToUser(req.userId!, "task:deleted", {
        taskId,
        userId: req.userId,
      });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

// Toggle task completion
export const toggleTask = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.userId,
      },
    });

    if (!existingTask) {
      throw new NotFoundError("Task");
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { completed: !existingTask.completed },
    });

    // Emit WebSocket event
    const wsServer = req.app.locals.wsServer as WebSocketServer;
    if (wsServer) {
      wsServer.emitToUser(req.userId!, "task:toggled", {
        task,
        userId: req.userId,
      });
    }

    res.json({ task });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
