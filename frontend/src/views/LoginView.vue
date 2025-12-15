<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { Button, Input, Card, Alert } from "vue3-ui-kit";

const email = ref("");
const password = ref("");
const auth = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  await auth.login(email.value, password.value);
  if (auth.isAuthenticated) {
    router.push({ name: "dashboard" });
  }
};

onMounted(() => {
  if (auth.isAuthenticated) {
    router.push({ name: "dashboard" });
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="w-full max-w-md">
      <Card shadow="lg">
        <template #header>Login</template>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <Input v-model="email" label="Email" type="email" required />
          <Input v-model="password" label="Password" type="password" required />

          <Alert
            v-if="auth.error"
            variant="error"
            title="Login failed"
            :dismissible="false"
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
    </div>
  </div>
</template>
