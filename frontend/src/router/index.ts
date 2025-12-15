import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Global navigation guard for authentication
 */
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore();

  // Initialize auth on first load
  if (!auth.initialized) {
    await auth.initialize();
  }

  // Redirect to login if route requires auth and user not authenticated
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' });
  }

  // Redirect to dashboard if user is authenticated and trying to access auth pages
  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  next();
});

/**
 * Handle unauthorized errors globally (401 responses)
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unauthorized', () => {
    const auth = useAuthStore();
    auth.logout();
    router.push({ name: 'login' });
  });
}

export default router;
