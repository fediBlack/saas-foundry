import { Request, Response } from "express";
import * as taskController from "../../controllers/task.controller";
import prisma from "../../utils/prisma";
import { AuthRequest } from "../../types/auth.types";

jest.mock("../../utils/prisma", () => ({
  task: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("Task Controller", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      userId: 1,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should return all tasks for user", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Description 1",
          completed: false,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: "Task 2",
          description: "Description 2",
          completed: true,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      await taskController.getTasks(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: "desc" },
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        tasks: mockTasks,
        count: 2,
      });
    });

    it("should return empty array if user has no tasks", async () => {
      (prisma.task.findMany as jest.Mock).mockResolvedValue([]);

      await taskController.getTasks(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        tasks: [],
        count: 0,
      });
    });
  });

  describe("getTaskById", () => {
    it("should return task if found", async () => {
      const mockTask = {
        id: 1,
        title: "Task 1",
        description: "Description 1",
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: "1" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);

      await taskController.getTaskById(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 1,
        },
      });

      expect(mockResponse.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it("should return 404 if task not found", async () => {
      mockRequest.params = { id: "999" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await taskController.getTaskById(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should not return task from another user", async () => {
      mockRequest.userId = 1;
      mockRequest.params = { id: "1" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await taskController.getTaskById(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 1,
        },
      });
    });
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const mockTask = {
        id: 1,
        title: "New Task",
        description: "Task description",
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        title: "New Task",
        description: "Task description",
      };

      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      await taskController.createTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: "New Task",
          description: "Task description",
          userId: 1,
        },
      });

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it("should trim whitespace from title and description", async () => {
      const mockTask = {
        id: 1,
        title: "Task",
        description: "Description",
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        title: "  Task  ",
        description: "  Description  ",
      };

      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      await taskController.createTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: "Task",
          description: "Description",
          userId: 1,
        },
      });
    });
  });

  describe("updateTask", () => {
    it("should update task", async () => {
      const mockTask = {
        id: 1,
        title: "Updated Task",
        description: "Updated description",
        completed: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = {
        title: "Updated Task",
        description: "Updated description",
        completed: true,
      };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });
      (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

      await taskController.updateTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it("should return 404 if task not found", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = {
        title: "Updated Task",
      };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await taskController.updateTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should not update task from another user", async () => {
      mockRequest.userId = 1;
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        title: "Updated Task",
      };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await taskController.updateTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: 1,
        },
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete task", async () => {
      mockRequest.params = { id: "1" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });
      (prisma.task.delete as jest.Mock).mockResolvedValue({});

      await taskController.deleteTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 404 if task not found", async () => {
      mockRequest.params = { id: "999" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await taskController.deleteTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("toggleTask", () => {
    it("should toggle task completion", async () => {
      const mockTask = {
        id: 1,
        title: "Task",
        description: "Description",
        completed: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.params = { id: "1" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
        completed: false,
      });
      (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

      await taskController.toggleTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { completed: true },
      });

      expect(mockResponse.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it("should return 404 if task not found", async () => {
      mockRequest.params = { id: "999" };

      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      await taskController.toggleTask(
        mockRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
