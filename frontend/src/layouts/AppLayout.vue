<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { Button } from 'vue3-ui-kit';

const auth = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await auth.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <!-- Header/Navbar -->
    <header class="bg-white shadow-md">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <h1 class="text-2xl font-bold text-slate-900">Tasks App</h1>
          <nav class="hidden md:flex gap-6">
            <RouterLink
              to="/"
              class="text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Dashboard
            </RouterLink>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm text-slate-600">{{ auth.user?.email }}</span>
          <Button size="sm" @click="handleLogout">Logout</Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-10">
      <div class="max-w-6xl mx-auto px-4">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-6 mt-10">
      <div class="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
        <p>&copy; 2025 Tasks App. Built with Vue 3 + TypeScript.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:deep(.router-link-active) {
  color: rgb(59, 130, 246);
  font-weight: 600;
}
</style>
