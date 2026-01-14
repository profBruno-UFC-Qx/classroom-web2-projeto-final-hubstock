import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore';
import HomeView from '../views/HomeView.vue'
import ProdutosAdminView from '../views/admin/produtos/ProdutosAdminView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import PedidoDetailView from '@/views/venda/PedidoDetailView.vue';
import MesaSelectionView from '@/views/venda/MesaSelectionView.vue';
import UsuariosView from '@/views/admin/usuarios/UsuariosView.vue';
import DashboardSuperAdmin from '@/views/super-admin/DashboardSuperAdminView.vue';
import DashboardAdmin from '@/views/admin/dashboard/DashboardAdminView.vue';
import RestaurantBIView from '@/views/super-admin/RestaurantBIView.vue';
import CadastroRestauranteView from '@/views/CadastroRestauranteView.vue';
import UserProfileView from '@/views/profile/UserProfileView.vue';
import type { UsuarioPapel } from '@/types/entity-types';

type AppRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    requiresAuth?: boolean;
    requiredRole?: UsuarioPapel;
  };
};

const routes: Array<AppRouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/cadastro', name: 'RestauranteCadastro', component: CadastroRestauranteView },

  {
    path: '/venda',
    name: 'MesaSelection',
    component: MesaSelectionView,
    meta: { requiresAuth: true, requiredRole: 'GARCOM' }
  },
  {
    path: '/venda/:mesaId',
    name: 'PedidoDetail',
    component: PedidoDetailView,
    meta: { requiresAuth: true, requiredRole: 'GARCOM' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardAdmin,
    meta: { requiresAuth: true, requiredRole: 'ADMINISTRADOR' }
  },
  {
    path: '/produtos',
    name: 'ProdutosAdmin',
    component: ProdutosAdminView,
    meta: { requiresAuth: true, requiredRole: 'ADMINISTRADOR' }
  },
  {
    path: '/users',
    name: 'Users',
    component: UsuariosView,
    meta: { requiresAuth: true, requiredRole: 'ADMINISTRADOR' }
  },
  {
    path: '/superadmin/dashboard',
    name: 'DashboardSuperAdmin',
    component: DashboardSuperAdmin,
    meta: { requiresAuth: true, requiredRole: 'SUPERADMINISTRADOR' }
  },
  {
    path: '/superadmin/restaurante/:restId',
    name: 'RestaurantBI',
    component: RestaurantBIView,
    meta: { requiresAuth: true, requiredRole: 'SUPERADMINISTRADOR' }
  },
  {
    path: '/perfil',
    name: 'UserProfile',
    component: UserProfileView,
    meta: { requiresAuth: true, requiredRole: 'GARCOM' }
  },

  // se o user digitar qualquer coisa errada, cai aqui
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Trava de segurança para cada troca de página
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // vê se a página precisa de login e se o user está logado
  if (to.meta.requiresAuth && !auth.estaAutenticado) {
    return next({ name: 'Home' });
  }

  // se estiver logado e tentar ir pra Home (login), manda pro lugar certo dele
  if (auth.estaAutenticado && to.name === 'Home') {
    if (auth.isSuperAdmin) return next({ name: 'DashboardSuperAdmin' });
    if (auth.isAdmin) return next({ name: 'Dashboard' });
    return next({ name: 'MesaSelection' });
  }

  // checa se o usuário tem o cargo certo pra entrar na tela
  if (to.meta.requiredRole) {
    const temPermissao = auth.hasRequiredRole(to.meta.requiredRole as string);
    if (!temPermissao) {
      console.log("Acesso negado, você não tem o cargo necessário!");
      return next(false);
    }
  }

  next();
});

export default router;