import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types/entity-types';
import DashboardView from '../views/DashboardView.vue';
import AdminPanelView from '../views/AdminPanelView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import VendaGarcomView from '../views/VendaGarcomView.vue';

type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    requiresAuth?: boolean;
    requiredRole?: UserRole;
  };
};

const routes: Array<AppRouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/venda',
    name: 'VendaGarcom',
    component: VendaGarcomView,
    meta: {
      requiresAuth: true,
      requiredRole: 'GARCOM',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true,
      requiredRole: 'ADMINISTRADOR',
    },
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanelView,
    meta: {
      requiresAuth: true,
      requiredRole: 'ADMINISTRADOR',
    },
  },
  {
    path: '/:catchAll(.*)', // Rota 404
    name: 'NotFound',
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiredRole;
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (isAuthenticated && requiredRole && !authStore.hasRequiredRole(requiredRole as UserRole)) {
    console.log('Acesso Negado. Redirecionando...');
    if (authStore.isAdmin) {
      next({ name: 'Dashboard' });
    } else if (authStore.isGarcom) {
      next({ name: 'VendaGarcom' });
    } else {
      next({ name: 'Home' });
    }
  } else if (isAuthenticated && to.name === 'Login') {
    if (authStore.isAdmin) {
      next({ name: 'Dashboard' });
    } else if (authStore.isGarcom) {
      next({ name: 'VendaGarcom' });
    } else {
      next({ name: 'Home' });
    }
  } else if (isAuthenticated && to.name === 'Home') {
    if (authStore.isAdmin) {
      next({ name: 'Dashboard' });
    } else if (authStore.isGarcom) {
      next({ name: 'VendaGarcom' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
