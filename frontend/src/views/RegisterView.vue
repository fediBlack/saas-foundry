<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Button, Input, Card, Alert } from 'vue3-ui-kit';
import type { RegisterPayload } from '@/types';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const localError = ref<string | null>(null);

const auth = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  localError.value = null;

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
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md">
      <Card shadow="lg">
        <template #header>Register</template>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <Input
            v-model="name"
            label="Name (optional)"
            type="text"
            placeholder="John Doe"
          />
          <Input
            v-model="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            required
          />
          <Input
            v-model="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
          <Input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
          />

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
    </div>
  </div>
</template>
