import { describe, it, expect } from 'vitest';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let token: string;
let taskId: number;

const testUser = {
  email: `test${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User',
};

const testTask = {
  title: 'Integration Test Task',
  description: 'Testing end-to-end integration',
  priority: 'HIGH',
};

describe('Full Stack Integration Tests', () => {
  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(testUser.email);
    });

    it('should login user and receive token', async () => {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      token = response.data.user.id || response.data.token;
    });

    it('should get current user profile', async () => {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(testUser.email);
    });
  });

  describe('Task CRUD Operations', () => {
    it('should create a new task', async () => {
      const response = await axios.post(`${API_URL}/tasks`, testTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('task');
      expect(response.data.task.title).toBe(testTask.title);
      taskId = response.data.task.id;
    });

    it('should fetch all tasks', async () => {
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('tasks');
      expect(Array.isArray(response.data.tasks)).toBe(true);
    });

    it('should fetch single task', async () => {
      const response = await axios.get(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('task');
      expect(response.data.task.id).toBe(taskId);
    });

    it('should update task', async () => {
      const response = await axios.put(
        `${API_URL}/tasks/${taskId}`,
        {
          title: 'Updated Task',
          description: 'Updated description',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      expect(response.status).toBe(200);
      expect(response.data.task.title).toBe('Updated Task');
    });

    it('should toggle task completion', async () => {
      const response = await axios.patch(`${API_URL}/tasks/${taskId}/toggle`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('task');
    });

    it('should delete task', async () => {
      const response = await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent task', async () => {
      try {
        await axios.get(`${API_URL}/tasks/99999`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        expect.fail('Should have thrown 404 error');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });

    it('should reject invalid email on registration', async () => {
      try {
        await axios.post(`${API_URL}/auth/register`, {
          email: 'invalid-email',
          password: 'TestPass123!',
        });
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should reject weak password on registration', async () => {
      try {
        await axios.post(`${API_URL}/auth/register`, {
          email: 'test@example.com',
          password: 'weak',
        });
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });

    it('should reject requests without auth token', async () => {
      try {
        await axios.get(`${API_URL}/tasks`);
        expect.fail('Should have thrown auth error');
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe('Health Check', () => {
    it('should return server health status', async () => {
      const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('ok');
    });
  });
});
