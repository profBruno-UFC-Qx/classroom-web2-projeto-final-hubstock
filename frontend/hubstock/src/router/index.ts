import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types/entity-types';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import AdminPanelView from '../views/AdminPanelView.vue';
import NotFoundView from '../views/NotFoundView.vue';

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
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false, // O login não exige autenticação
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true, // Requisito #2: Protegida (todos logados)
      requiredRole: 'GARCOM', // Garçom ou Admin podem acessar
    },
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanelView,
    meta: {
      requiresAuth: true, // Requisito #2: Protegida
      requiredRole: 'ADMINISTRADOR', // Requisito #3: Apenas Admin pode acessar
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
  const authStore = useAuthStore(); // Obtém o store de autenticação

  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiredRole;

  if (requiresAuth && !authStore.isAuthenticated) {
    // 1. Se a rota exige autenticação E o usuário NÃO está logado
    console.log('Redirecionando para Login: Requer autenticação.');
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (requiresAuth && requiredRole && !authStore.hasRequiredRole(requiredRole as UserRole)) {
    // 2. Se a rota exige autenticação E o usuário logado NÃO tem o papel necessário
    console.log(`Redirecionando para Dashboard: Papel necessário: ${requiredRole as UserRole}. Papel atual: ${authStore.userRole}`);
    // Redireciona para o dashboard ou uma página de acesso negado
    next({ name: 'Dashboard' });
  } else if (authStore.isAuthenticated && to.name === 'Login') {
    // 3. Se o usuário JÁ está logado e tenta acessar a página de Login
    console.log('Redirecionando para Dashboard: Já autenticado.');
    next({ name: 'Dashboard' });
  } else {
    // 4. Permite o acesso à rota
    next();
  }
});

export default router
