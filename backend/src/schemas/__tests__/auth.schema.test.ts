import { registerSchema, loginSchema } from "../auth.schema";

describe("Auth Schemas", () => {
  describe("registerSchema", () => {
    it("should validate a correct registration payload", async () => {
      const validPayload = {
        email: "user@example.com",
        password: "SecurePass123!",
        name: "John Doe",
      };

      const result = await registerSchema.parseAsync(validPayload);
      expect(result.email).toBe("user@example.com");
      expect(result.password).toBe("SecurePass123!");
      expect(result.name).toBe("John Doe");
    });

    it("should convert email to lowercase", async () => {
      const payload = {
        email: "USER@EXAMPLE.COM",
        password: "SecurePass123!",
        name: "John Doe",
      };

      const result = await registerSchema.parseAsync(payload);
      expect(result.email).toBe("user@example.com");
    });

    it("should reject invalid email", async () => {
      const payload = {
        email: "invalid-email",
        password: "SecurePass123!",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject password without uppercase", async () => {
      const payload = {
        email: "user@example.com",
        password: "securepass123!",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject password without lowercase", async () => {
      const payload = {
        email: "user@example.com",
        password: "SECUREPASS123!",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject password without number", async () => {
      const payload = {
        email: "user@example.com",
        password: "SecurePass!",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject password without special character", async () => {
      const payload = {
        email: "user@example.com",
        password: "SecurePass123",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject password shorter than 8 characters", async () => {
      const payload = {
        email: "user@example.com",
        password: "Pass1!",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should accept optional name", async () => {
      const payload = {
        email: "user@example.com",
        password: "SecurePass123!",
      };

      const result = await registerSchema.parseAsync(payload);
      expect(result.name).toBeUndefined();
    });

    it("should reject short name", async () => {
      const payload = {
        email: "user@example.com",
        password: "SecurePass123!",
        name: "J",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject missing email", async () => {
      const payload = {
        password: "SecurePass123!",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject missing password", async () => {
      const payload = {
        email: "user@example.com",
        name: "John Doe",
      };

      await expect(registerSchema.parseAsync(payload)).rejects.toThrow();
    });
  });

  describe("loginSchema", () => {
    it("should validate correct login payload", async () => {
      const validPayload = {
        email: "user@example.com",
        password: "AnyPassword123!",
      };

      const result = await loginSchema.parseAsync(validPayload);
      expect(result.email).toBe("user@example.com");
      expect(result.password).toBe("AnyPassword123!");
    });

    it("should convert email to lowercase", async () => {
      const payload = {
        email: "USER@EXAMPLE.COM",
        password: "AnyPassword123!",
      };

      const result = await loginSchema.parseAsync(payload);
      expect(result.email).toBe("user@example.com");
    });

    it("should reject invalid email", async () => {
      const payload = {
        email: "invalid-email",
        password: "AnyPassword123!",
      };

      await expect(loginSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should not require strong password for login", async () => {
      const payload = {
        email: "user@example.com",
        password: "simple",
      };

      const result = await loginSchema.parseAsync(payload);
      expect(result.password).toBe("simple");
    });

    it("should reject missing email", async () => {
      const payload = {
        password: "AnyPassword123!",
      };

      await expect(loginSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject missing password", async () => {
      const payload = {
        email: "user@example.com",
      };

      await expect(loginSchema.parseAsync(payload)).rejects.toThrow();
    });
  });
});
