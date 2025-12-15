import { z, type ZodError } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must not exceed 255 characters'),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export type TaskInput = z.infer<typeof taskSchema>;

/**
 * Validate task input and return errors
 */
export const validateTask = (data: unknown) => {
  try {
    const validated = taskSchema.parse(data);
    return { success: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      (error as ZodError).issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      return { success: false, data: null, errors: fieldErrors };
    }
    return { success: false, data: null, errors: { _root: 'Validation failed' } };
  }
};
