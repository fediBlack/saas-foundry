import { describe, it, expect } from 'vitest';
import { useFormValidation } from '@/composables/useFormValidation';
import { loginSchema } from '@/schemas/auth';
import { z } from 'zod';

describe('useFormValidation composable', () => {
  it('should initialize with empty errors', () => {
    const validation = useFormValidation(loginSchema);
    expect(validation.errors.value).toEqual({});
  });

  it('should initialize with empty touched set', () => {
    const validation = useFormValidation(loginSchema);
    expect(validation.touched.value.size).toBe(0);
  });

  it('should validate correct data', () => {
    const validation = useFormValidation(loginSchema);
    const result = validation.validate({
      email: 'user@example.com',
      password: 'Password123!',
    });
    expect(result).toBe(true);
    expect(validation.errors.value).toEqual({});
  });

  it('should capture validation errors', () => {
    const validation = useFormValidation(loginSchema);
    const result = validation.validate({
      email: 'invalid-email',
      password: 'weak',
    });
    expect(result).toBe(false);
    expect(Object.keys(validation.errors.value).length).toBeGreaterThan(0);
    expect(validation.errors.value.email).toBeDefined();
  });

  it('should mark field as touched', () => {
    const validation = useFormValidation(loginSchema);
    validation.markTouched('email');
    expect(validation.touched.value.has('email')).toBe(true);
  });

  it('should return hasErrors computed property', () => {
    const validation = useFormValidation(loginSchema);
    expect(validation.hasErrors.value).toBe(false);

    validation.validate({
      email: 'invalid',
      password: 'weak',
    });
    expect(validation.hasErrors.value).toBe(true);
  });

  it('should clear errors and touched on reset', () => {
    const validation = useFormValidation(loginSchema);
    validation.validate({
      email: 'invalid',
      password: 'weak',
    });
    validation.markTouched('email');

    validation.clearErrors();
    expect(validation.errors.value).toEqual({});
    expect(validation.touched.value.size).toBe(0);
  });

  it('should get field error or null', () => {
    const validation = useFormValidation(loginSchema);
    validation.validate({
      email: 'invalid',
      password: 'weak',
    });

    expect(validation.getFieldError('email')).not.toBeNull();
    expect(validation.getFieldError('nonexistent')).toBeNull();
  });

  it('should validate individual fields', () => {
    const validation = useFormValidation(loginSchema);
    const emailSchema = z.string().email();

    const result = validation.validateField('email', 'user@example.com', emailSchema);
    expect(result).toBe(true);
    expect(validation.errors.value.email).toBeUndefined();
  });

  it('should capture field-level validation errors', () => {
    const validation = useFormValidation(loginSchema);
    const emailSchema = z.string().email();

    const result = validation.validateField('email', 'invalid-email', emailSchema);
    expect(result).toBe(false);
    expect(validation.errors.value.email).toBeDefined();
  });

  it('should mark field as touched on validation', () => {
    const validation = useFormValidation(loginSchema);
    const emailSchema = z.string().email();

    validation.validateField('email', 'user@example.com', emailSchema);
    expect(validation.touched.value.has('email')).toBe(true);
  });

  it('should return isValid computed property', () => {
    const validation = useFormValidation(loginSchema);
    expect(validation.isValid.value).toBe(false);

    validation.validate({
      email: 'user@example.com',
      password: 'Password123!',
    });
    validation.markTouched('email');
    expect(validation.isValid.value).toBe(true);
  });
});
