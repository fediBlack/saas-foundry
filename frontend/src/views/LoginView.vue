<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { Button, Input, Card, Alert } from 'vue3-ui-kit';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { useLoginValidation } from '@/composables/useFormValidation';
import type { LoginPayload } from '@/types';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const { validate, errors, markTouched, clearErrors } = useLoginValidation();

const handleSubmit = async () => {
  // Validate form
  const isValid = validate({ email: email.value, password: password.value });
  if (!isValid) return;

  const payload: LoginPayload = {
    email: email.value,
    password: password.value,
  };

  const success = await auth.login(payload);
  if (success) {
    router.push({ name: 'dashboard' });
  }
};

const handleFieldBlur = (field: string) => {
  markTouched(field);
};

onMounted(() => {
  if (auth.isAuthenticated) {
    router.push({ name: 'dashboard' });
  }
  clearErrors();
});
</script>

<template>
  <AuthLayout>
    <Card shadow="lg">
        <template #header>Login</template>

        <form class="space-y-4" @submit.prevent="handleSubmit">
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
          </div>

          <Alert
            v-if="auth.error"
            variant="error"
            title="Login Failed"
            :dismissible="true"
            @dismiss="auth.clearError"
          >
            {{ auth.error }}
          </Alert>

          <Button :loading="auth.loading" class="w-full" type="submit">
            Login
          </Button>
        </form>

        <template #footer>
          <p class="text-sm text-slate-500">
            No account yet?
            <RouterLink to="/register" class="text-blue-600 underline">
              Register
            </RouterLink>
          </p>
        </template>
      </Card>
  </AuthLayout>
</template>
