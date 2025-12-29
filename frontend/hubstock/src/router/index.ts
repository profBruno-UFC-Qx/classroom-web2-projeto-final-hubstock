import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types/entity-types';
import ProdutosAdminView from '../views/produto/ProdutosAdminView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import PedidoDetailView from '@/views/venda/PedidoDetailView.vue';
import MesaSelectionView from '@/views/venda/MesaSelectionView.vue';
import EstoqueView from '@/views/estoque/EstoqueView.vue';
import UsuariosView from '@/views/users/UsuariosView.vue';
import DashboardSuperAdmin from '@/views/super-admin/DashboardSuperAdminView.vue';
import DashboardAdmin from '@/views/admin/dashboard/DashboardAdminView.vue';
import RestaurantBIView from '@/views/super-admin/RestaurantBIView.vue';
import CadastroRestauranteView from '@/views/CadastroRestauranteView.vue';
import UserProfileView from '@/views/users/UserProfileView.vue';

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
    path: '/cadastro',
    name: 'RestauranteCadastro',
    component: CadastroRestauranteView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/venda',
    name: 'MesaSelection',
    component: MesaSelectionView,
    meta: {
      requiresAuth: true,
      requiredRole: 'GARCOM',
    },
  },
  {
    path: '/venda/:mesaId',
    name: 'PedidoDetail',
    component: PedidoDetailView,
    meta: {
      requiresAuth: true,
      requiredRole: 'GARCOM',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardAdmin,
    meta: {
      requiresAuth: true,
      requiredRole: 'ADMINISTRADOR',
    },
  },
  {
    path: '/produtos',
    name: 'ProdutosAdmin',
    component: ProdutosAdminView,
    meta: {
      requiresAuth: true,
      requiredRole: 'ADMINISTRADOR',
    },
  },
  {
    path: '/estoque',
    name: 'EstoqueAdmin',
    component: EstoqueView,
    meta: {
      requiresAuth: true,
      requiredRole: 'ADMINISTRADOR',
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: UsuariosView,
    meta: {
      requiresAuth: true,
      requiredRole: 'ADMINISTRADOR',
    },
  },
  {
    path: '/superadmin/dashboard',
    name: 'DashboardSuperAdmin',
    component: DashboardSuperAdmin,
    meta: {
      requiresAuth: true,
      requiredRole: 'SUPERADMINISTRADOR',
    },
  },
  {
    path: '/superadmin/restaurante/:restId',
    name: 'RestaurantBI',
    component: RestaurantBIView,
    meta: {
      requiresAuth: true,
      requiredRole: 'SUPERADMINISTRADOR',
    },
  },
  {
    path: '/perfil',
    name: 'UserProfile',
    component: UserProfileView,
    meta: {
      requiresAuth: true,
      requiredRole: 'GARCOM',
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
  const requiredRole = to.meta.requiredRole as UserRole;
  const isAuthenticated = authStore.isAuthenticated;

  const redirectToUserDefaultRoute = () => {
    if (authStore.isSuperAdmin) {
      return next({ name: 'DashboardSuperAdmin' });
    }
    if (authStore.isAdmin) {
      return next({ name: 'Dashboard' });
    }
    if (authStore.isGarcom) {
      return next({ name: 'MesaSelection' });
    }
    return next({ name: 'Home' });
  };

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Home', query: { redirect: to.fullPath } });
  }

  if (isAuthenticated && !requiredRole && authStore.hasRequiredRole(requiredRole)) {
    console.log(`Acesso Negado. Papel necessário: ${requiredRole}. Papel atual: ${authStore.userRole}`);
    return redirectToUserDefaultRoute();
  }

  if (isAuthenticated && (to.name === 'Login' || to.name === 'Home')) {
    return redirectToUserDefaultRoute();
  }

  next();
});

export default router
