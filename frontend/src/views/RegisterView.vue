<script setup lang="ts">
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { Button, Input, Card, Alert } from "vue3-ui-kit";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const localError = ref<string | null>(null);

const auth = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  localError.value = null;

  if (password.value !== confirmPassword.value) {
    localError.value = "Passwords do not match";
    return;
  }

  await auth.register(email.value, password.value, name.value);

  if (!auth.error && auth.isAuthenticated) {
    router.push({ name: "dashboard" });
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md">
      <Card shadow="lg">
        <template #header>Register</template>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <Input v-model="name" label="Name" type="text" required />
          <Input v-model="email" label="Email" type="email" required />
          <Input v-model="password" label="Password" type="password" required />
          <Input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            required
          />

          <Alert
            v-if="localError || auth.error"
            variant="error"
            title="Registration failed"
            :dismissible="false"
          >
            {{ localError || auth.error }}
          </Alert>

          <Button :loading="auth.loading" class="w-full" type="submit">
            Create account
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
