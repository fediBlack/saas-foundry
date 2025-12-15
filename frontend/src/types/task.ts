// Task types
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  completed: boolean;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  completed?: boolean;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTaskId?: number;
}

export interface TaskError {
  message: string;
  details?: Array<{ field: string; message: string }>;
}
