import { ref, computed } from 'vue';
import { z, type ZodError, type ZodSchema } from 'zod';
import { loginSchema, registerSchema } from '@/schemas/auth';
import { taskSchema } from '@/schemas/task';

/**
 * Composable for form validation with Zod
 */
export function useFormValidation(schema: ZodSchema) {
  const errors = ref<Record<string, string>>({});
  const touched = ref<Set<string>>(new Set());

  const hasErrors = computed(() => Object.keys(errors.value).length > 0);
  const isValid = computed(() => !hasErrors.value && touched.value.size > 0);

  const validate = (data: unknown) => {
    try {
      schema.parse(data);
      errors.value = {};
      return true;
    } catch (error) {
      const fieldErrors: Record<string, string> = {};
      if (error instanceof z.ZodError) {
        (error as ZodError).issues.forEach((err: z.ZodIssue) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
      }
      errors.value = fieldErrors;
      return false;
    }
  };

  const validateField = (field: string, value: unknown, fieldSchema: ZodSchema) => {
    try {
      fieldSchema.parse(value);
      delete errors.value[field];
      touched.value.add(field);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const err = error as ZodError;
        if (err.issues && err.issues[0]) {
          errors.value[field] = err.issues[0].message;
        }
      }
      touched.value.add(field);
      return false;
    }
  };

  const markTouched = (field: string) => {
    touched.value.add(field);
  };

  const clearErrors = () => {
    errors.value = {};
    touched.value.clear();
  };

  const getFieldError = (field: string): string | null => {
    return errors.value[field] || null;
  };

  return {
    errors,
    touched,
    hasErrors,
    isValid,
    validate,
    validateField,
    markTouched,
    clearErrors,
    getFieldError,
  };
}

/**
 * Pre-configured validation for login form
 */
export function useLoginValidation() {
  return useFormValidation(loginSchema);
}

/**
 * Pre-configured validation for register form
 */
export function useRegisterValidation() {
  return useFormValidation(registerSchema);
}

/**
 * Pre-configured validation for task form
 */
export function useTaskValidation() {
  return useFormValidation(taskSchema);
}
