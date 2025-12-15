import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import { useAuthStore } from "../stores/auth";

const routes: RouteRecordRaw[] = [
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  {
    path: "/",
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (!authInitialized) {
    await auth.fetchMe(); // attend la réponse backend
    authInitialized = true;
  }
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "login" });
  }
  if ((to.name === "login" || to.name === "register") && auth.isAuthenticated) {
    return next({ name: "dashboard" });
  }
  next();
});

export default router;
