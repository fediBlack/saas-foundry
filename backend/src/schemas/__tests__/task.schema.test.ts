import { createTaskSchema, updateTaskSchema, taskIdSchema } from "../task.schema";

describe("Task Schemas", () => {
  describe("createTaskSchema", () => {
    it("should validate a correct task creation payload", async () => {
      const validPayload = {
        title: "My Task",
        description: "Task description",
        priority: "HIGH",
      };

      const result = await createTaskSchema.parseAsync(validPayload);
      expect(result.title).toBe("My Task");
      expect(result.description).toBe("Task description");
      expect(result.priority).toBe("HIGH");
    });

    it("should use default priority MEDIUM if not provided", async () => {
      const payload = {
        title: "My Task",
      };

      const result = await createTaskSchema.parseAsync(payload);
      expect(result.priority).toBe("MEDIUM");
    });

    it("should reject empty title", async () => {
      const payload = {
        title: "",
      };

      await expect(createTaskSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject title longer than 255 characters", async () => {
      const payload = {
        title: "a".repeat(256),
      };

      await expect(createTaskSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should accept title with 255 characters", async () => {
      const payload = {
        title: "a".repeat(255),
      };

      const result = await createTaskSchema.parseAsync(payload);
      expect(result.title.length).toBe(255);
    });

    it("should reject description longer than 2000 characters", async () => {
      const payload = {
        title: "My Task",
        description: "a".repeat(2001),
      };

      await expect(createTaskSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should accept description with 2000 characters", async () => {
      const payload = {
        title: "My Task",
        description: "a".repeat(2000),
      };

      const result = await createTaskSchema.parseAsync(payload);
      expect(result.description!.length).toBe(2000);
    });

    it("should accept null description", async () => {
      const payload = {
        title: "My Task",
        description: null,
      };

      const result = await createTaskSchema.parseAsync(payload);
      expect(result.description).toBeNull();
    });

    it("should reject invalid priority", async () => {
      const payload = {
        title: "My Task",
        priority: "URGENT",
      };

      await expect(createTaskSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should accept all valid priorities", async () => {
      for (const priority of ["LOW", "MEDIUM", "HIGH"]) {
        const payload = {
          title: "My Task",
          priority,
        };

        const result = await createTaskSchema.parseAsync(payload);
        expect(result.priority).toBe(priority);
      }
    });
  });

  describe("updateTaskSchema", () => {
    it("should validate a correct task update payload", async () => {
      const validPayload = {
        title: "Updated Task",
        completed: true,
      };

      const result = await updateTaskSchema.parseAsync(validPayload);
      expect(result.title).toBe("Updated Task");
      expect(result.completed).toBe(true);
    });

    it("should allow partial updates", async () => {
      const payload = {
        completed: true,
      };

      const result = await updateTaskSchema.parseAsync(payload);
      expect(result.completed).toBe(true);
      expect(result.title).toBeUndefined();
    });

    it("should reject empty title", async () => {
      const payload = {
        title: "",
      };

      await expect(updateTaskSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should reject completed as non-boolean", async () => {
      const payload = {
        completed: "true",
      };

      await expect(updateTaskSchema.parseAsync(payload)).rejects.toThrow();
    });
  });

  describe("taskIdSchema", () => {
    it("should parse valid numeric id from string", async () => {
      const payload = {
        id: "123",
      };

      const result = await taskIdSchema.parseAsync(payload);
      expect(result.id).toBe(123);
      expect(typeof result.id).toBe("number");
    });

    it("should reject non-numeric id", async () => {
      const payload = {
        id: "abc",
      };

      await expect(taskIdSchema.parseAsync(payload)).rejects.toThrow();
    });

    it("should handle large ids", async () => {
      const payload = {
        id: "999999999",
      };

      const result = await taskIdSchema.parseAsync(payload);
      expect(result.id).toBe(999999999);
    });
  });
});
