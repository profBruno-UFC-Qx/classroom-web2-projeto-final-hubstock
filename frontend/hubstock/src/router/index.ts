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
    path: '/venda', // Rota dedicada ao Garçom
    name: 'VendaGarcom',
    component: VendaGarcomView,
    meta: {
      requiresAuth: true,
      requiredRole: 'GARCOM', // Apenas Garçom e Admin podem vender, mas Garçom é o foco
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true, // Requisito #2: Protegida (todos logados)
      requiredRole: 'ADMINISTRADOR', // Garçom ou Admin podem acessar
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
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;
  const requiredRole = to.meta.requiredRole;
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    // 1. Se a rota exige autenticação E o usuário NÃO está logado
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (isAuthenticated && requiredRole && !authStore.hasRequiredRole(requiredRole as UserRole)) {
    // 2. Se a rota exige autenticação E o usuário logado NÃO tem o papel necessário
    // Redireciona para o fluxo padrão do usuário (Admin -> Dashboard, Garçom -> Venda)
    console.log('Acesso Negado. Redirecionando...');
    if (authStore.isAdmin) {
      next({ name: 'Dashboard' });
    } else if (authStore.isGarcom) {
      next({ name: 'VendaGarcom' });
    } else {
      next({ name: 'Home' }); // Logout ou página neutra
    }
  } else if (isAuthenticated && to.name === 'Login') {
    // 3. Se o usuário JÁ está logado e tenta acessar a página de Login
    if (authStore.isAdmin) {
      next({ name: 'Dashboard' });
    } else if (authStore.isGarcom) {
      next({ name: 'VendaGarcom' }); // Garçom vai para a Venda
    } else {
      next({ name: 'Home' });
    }
  } else if (isAuthenticated && to.name === 'Home') {
    // 4. Se o usuário JÁ está logado e tenta acessar a Home (/)
    if (authStore.isAdmin) {
      next({ name: 'Dashboard' });
    } else if (authStore.isGarcom) {
      next({ name: 'VendaGarcom' });
    } else {
      next();
    }
  } else {
    // 5. Permite o acesso à rota
    next();
  }
});

export default router
