<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button, Input, Card, Alert } from 'vue3-ui-kit';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useRegisterValidation } from '@/composables/useFormValidation';
import type { RegisterPayload } from '@/types';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const localError = ref<string | null>(null);

const auth = useAuthStore();
const router = useRouter();
const { validate, errors, markTouched, clearErrors } = useRegisterValidation();

const handleSubmit = async () => {
  localError.value = null;

  // Validate form
  const isValid = validate({
    email: email.value,
    password: password.value,
    name: name.value || undefined,
  });
  if (!isValid) return;

  // Check password match
  if (password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match';
    return;
  }

  const payload: RegisterPayload = {
    email: email.value,
    password: password.value,
    name: name.value || undefined,
  };

  const success = await auth.register(payload);

  if (success) {
    router.push({ name: 'dashboard' });
  }
};

const handleFieldBlur = (field: string) => {
  markTouched(field);
};

onMounted(() => {
  clearErrors();
});
</script>

<template>
  <AuthLayout>
    <Card shadow="lg">
        <template #header>Register</template>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <Input
              v-model="name"
              label="Name (optional)"
              type="text"
              placeholder="John Doe"
              @blur="handleFieldBlur('name')"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <div>
            <Input
              v-model="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
              @blur="handleFieldBlur('email')"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <Input
              v-model="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              @blur="handleFieldBlur('password')"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
            <p class="mt-2 text-xs text-slate-600">
              Password must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div>
            <Input
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
              @blur="handleFieldBlur('confirmPassword')"
            />
          </div>

          <Alert
            v-if="localError || auth.error"
            variant="error"
            title="Registration Failed"
            :dismissible="true"
            @dismiss="auth.clearError"
          >
            {{ localError || auth.error }}
          </Alert>

          <Button :loading="auth.loading" class="w-full" type="submit">
            Create Account
          </Button>
        </form>

        <template #footer>
          <p class="text-sm text-slate-500">
            Already have an account?
            <RouterLink to="/login" class="text-blue-600 underline">
              Login
            </RouterLink>
          </p>
        </template>
      </Card>
  </AuthLayout>
</template>
