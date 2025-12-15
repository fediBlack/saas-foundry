import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '@/schemas/auth';
import { taskSchema } from '@/schemas/task';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'Password123!',
      };
      expect(() => loginSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: '',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'password123!',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject password without lowercase', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'PASSWORD123!',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'Password!',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject password without special character', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'Password123',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'Pass1!',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('registerSchema', () => {
    it('should validate correct register data', () => {
      const validData = {
        email: 'user@example.com',
        password: 'Password123!',
        name: 'John Doe',
      };
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should validate register data without name', () => {
      const validData = {
        email: 'user@example.com',
        password: 'Password123!',
      };
      expect(() => registerSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123!',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });

    it('should apply same password validation as loginSchema', () => {
      const invalidData = {
        email: 'user@example.com',
        password: 'weak',
        name: 'John',
      };
      expect(() => registerSchema.parse(invalidData)).toThrow();
    });
  });
});

describe('Task Validation Schema', () => {
  describe('taskSchema', () => {
    it('should validate correct task data', () => {
      const validData = {
        title: 'My Task',
        description: 'Task description',
        priority: 'HIGH' as const,
      };
      expect(() => taskSchema.parse(validData)).not.toThrow();
    });

    it('should validate task without description', () => {
      const validData = {
        title: 'My Task',
        priority: 'MEDIUM' as const,
      };
      expect(() => taskSchema.parse(validData)).not.toThrow();
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        priority: 'LOW' as const,
      };
      expect(() => taskSchema.parse(invalidData)).toThrow();
    });

    it('should reject title shorter than 3 characters', () => {
      const invalidData = {
        title: 'ab',
        priority: 'MEDIUM' as const,
      };
      expect(() => taskSchema.parse(invalidData)).toThrow();
    });

    it('should reject title longer than 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      const invalidData = {
        title: longTitle,
        priority: 'HIGH' as const,
      };
      expect(() => taskSchema.parse(invalidData)).toThrow();
    });

    it('should reject invalid priority', () => {
      const invalidData = {
        title: 'My Task',
        priority: 'INVALID' as any,
      };
      expect(() => taskSchema.parse(invalidData)).toThrow();
    });

    it('should reject description longer than 2000 characters', () => {
      const longDescription = 'a'.repeat(2001);
      const invalidData = {
        title: 'My Task',
        description: longDescription,
        priority: 'MEDIUM' as const,
      };
      expect(() => taskSchema.parse(invalidData)).toThrow();
    });

    it('should accept all priority levels', () => {
      const priorities: Array<'LOW' | 'MEDIUM' | 'HIGH'> = ['LOW', 'MEDIUM', 'HIGH'];
      priorities.forEach((priority) => {
        const validData = {
          title: 'My Task',
          priority,
        };
        expect(() => taskSchema.parse(validData)).not.toThrow();
      });
    });
  });
});
