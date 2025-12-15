import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import * as authController from "../../controllers/auth.controller";
import prisma from "../../utils/prisma";
import * as jwt from "../../utils/jwt";

// Mock dependencies
jest.mock("../../utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs");
jest.mock("../../utils/jwt");

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        name: "John Doe",
        createdAt: new Date(),
      };

      const mockToken = "jwt-token-123";

      mockRequest.body = {
        email: "user@example.com",
        password: "SecurePass123!",
        name: "John Doe",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.generateToken as jest.Mock).mockReturnValue(mockToken);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: mockToken,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        "token",
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
        })
      );
    });

    it("should return 409 if user already exists", async () => {
      mockRequest.body = {
        email: "user@example.com",
        password: "SecurePass123!",
        name: "John Doe",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "user@example.com",
      });

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining("already exists"),
        })
      );
    });

    it("should hash the password", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        name: "John Doe",
        createdAt: new Date(),
      };

      mockRequest.body = {
        email: "user@example.com",
        password: "SecurePass123!",
        name: "John Doe",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.generateToken as jest.Mock).mockReturnValue("token");

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("SecurePass123!", 10);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            password: "hashed-password",
          }),
        })
      );
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        password: "hashed-password",
        name: "John Doe",
        createdAt: new Date(),
      };

      const mockToken = "jwt-token-123";

      mockRequest.body = {
        email: "user@example.com",
        password: "SecurePass123!",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.generateToken as jest.Mock).mockReturnValue(mockToken);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id: 1,
          email: "user@example.com",
          name: "John Doe",
          createdAt: mockUser.createdAt,
        },
        token: mockToken,
      });
    });

    it("should return 401 if user not found", async () => {
      mockRequest.body = {
        email: "user@example.com",
        password: "SecurePass123!",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Invalid credentials",
        })
      );
    });

    it("should return 401 if password is invalid", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        password: "hashed-password",
        name: "John Doe",
        createdAt: new Date(),
      };

      mockRequest.body = {
        email: "user@example.com",
        password: "WrongPassword123!",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Invalid credentials",
        })
      );
    });
  });

  describe("logout", () => {
    it("should clear cookie and return success message", () => {
      authController.logout(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.clearCookie).toHaveBeenCalledWith("token");
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      });
    });
  });

  describe("me", () => {
    it("should return current user", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        name: "John Doe",
        createdAt: new Date(),
      };

      const authRequest = mockRequest as any;
      authRequest.userId = 1;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await authController.me(
        authRequest,
        mockResponse as Response
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      expect(mockResponse.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should return 404 if user not found", async () => {
      const authRequest = mockRequest as any;
      authRequest.userId = 999;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await authController.me(
        authRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });
});
