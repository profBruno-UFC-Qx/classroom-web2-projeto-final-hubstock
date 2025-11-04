<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-sider collapsible v-model:collapsed="collapsed" :trigger="null" breakpoint="lg" collapsed-width="80"
      class="app-sider">
      <div class="logo-container">
        <div v-if="!collapsed" class="logo-text"><span class="hub">Hub</span><span class="stock">Stock</span></div>
        <div class="logo-icon" v-else><span class="hub">H</span><span class="stock">S</span></div>
      </div>

      <a-menu v-model:selectedKeys="selectedKeys" :theme="siderTheme" mode="inline" :open-keys="openKeys"
        @openChange="onOpenChange">
        <a-menu-item key="vendas" @click="goTo('VendaGarcom')" v-if="authStore.isGarcom">
          <template #icon><shop-outlined /></template>
          <span>Venda Rápida</span>
        </a-menu-item>

        <a-menu-item key="dashboard" @click="goTo('Dashboard')" v-if="authStore.isAdmin">
          <template #icon><dashboard-outlined /></template>
          <span>Dashboard</span>
        </a-menu-item>

        <a-menu-item key="produtos" @click="goTo('AdminPanel')" v-if="authStore.isAdmin">
          <template #icon><box-plot-outlined /></template>
          <span>Produtos</span>
        </a-menu-item>

        <a-menu-item key="estoque" @click="goTo('Estoque')" v-if="authStore.isAdmin">
          <template #icon><stock-outlined /></template>
          <span>Estoque</span>
        </a-menu-item>

        <a-menu-item key="fornecedores" @click="goTo('Fornecedores')" v-if="authStore.isAdmin">
          <template #icon><user-switch-outlined /></template>
          <span>Fornecedores</span>
        </a-menu-item>

        <a-menu-item key="movimentacoes" @click="goTo('Movimentacoes')" v-if="authStore.isAdmin">
          <template #icon><swap-outlined /></template>
          <span>Movimentações</span>
        </a-menu-item>

        <a-menu-item key="garcons" @click="goTo('garcons')" v-if="authStore.isAdmin">
          <template #icon><user-group-outlined /></template>
          <span>Garçons</span>
        </a-menu-item>
      </a-menu>

    </a-layout-sider>

    <a-layout :style="{ marginLeft: layoutMargin, transition: 'margin-left 0.2s' }">

      <a-layout-header class="app-header">
        <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" class="trigger"
          @click="() => (collapsed = !collapsed)" />

        <div class="header-right">

          <div class="user-info-header">
            <a-avatar :size="30" style="background-color: #f56a00">{{ authStore.userName?.charAt(0) }}</a-avatar>
            <div class="user-details-header">
              <span class="user-name-header">{{ authStore.userName }}</span>
              <span class="user-role-header">{{ authStore.userRole }}</span>
            </div>
          </div>

          <a-button type="primary" danger @click="handleLogout">
            <template #icon><logout-outlined /></template>
            Sair
          </a-button>
        </div>
      </a-layout-header>

      <a-layout-content class="app-content">
        <router-view />
      </a-layout-content>

      <a-layout-footer style="text-align: center; padding: 10px 0;">
        HubStock ©{{ new Date().getFullYear() }} Criado com Ant Design Vue
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  DashboardOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  BoxPlotOutlined, StockOutlined, UserSwitchOutlined,
  SwapOutlined, UserOutlined as UserGroupOutlined, ShopOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const siderTheme = ref<'light' | 'dark'>('light');

const collapsed = ref(false);
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

const layoutMargin = computed(() => {
  // A margem só é aplicada se o Sider NÃO for responsivo (tela > 'lg')
  if (window.innerWidth >= 992) {
    return collapsed.value ? '80px' : '200px';
  }
  return '0px'; // Em mobile/tablet, o Sider fica flutuante, não precisamos de margem
});

const goTo = (name: string) => {
  router.push({ name });
  // Se estiver em mobile, fecha o menu após a navegação
  if (window.innerWidth < 992) {
    collapsed.value = true;
  }
};

// Lógica para manter o item de menu selecionado
const updateMenuSelection = (currentRoute: typeof route) => {
  // Lógica simplificada para mapear o nome da rota para a chave do menu
  const routeName = currentRoute.name as string;

  if (routeName === 'AdminPanel') selectedKeys.value = ['produtos'];
  else if (routeName === 'VendaGarcom') selectedKeys.value = ['vendas'];
  else if (routeName === 'Dashboard') selectedKeys.value = ['dashboard'];
  else selectedKeys.value = [];

  // Abrir o submenu correto
  if (routeName === 'Produtos' || routeName === 'Estoque' || routeName === 'Fornecedores' || routeName === 'Movimentacoes') {
    openKeys.value = ['gerenciamento'];
  } else if (routeName === 'Sistema' || routeName === 'Usuarios') {
    openKeys.value = ['config'];
  } else {
    openKeys.value = [];
  }
};

watch(route, (newRoute) => {
  updateMenuSelection(newRoute);
});

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 992px)');
  collapsed.value = !mediaQuery.matches;
  updateMenuSelection(route);
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Home' });
};

// Controle para fechar submenus quando outro é aberto
const onOpenChange = (currentOpenKeys: string[]) => {
  const latestOpenKey = currentOpenKeys.find(key => !openKeys.value.includes(key));

  // Fechar outros submenus, mantendo apenas o último aberto
  if (latestOpenKey) {
    openKeys.value = [latestOpenKey];
  } else {
    openKeys.value = [];
  }
};

</script>

<style scoped>
.app-sider {
  position: fixed;
  height: 100vh;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

/* 2. LIGHT THEME NO MENU */
/* O Ant Design tem um bug visual quando o Sider é dark, mas o Menu é light.
   Usaremos a cor Dark que você usou na imagem original para o Sider, e o Menu interno será Light.
   No entanto, a cor original do seu mock é um azul escuro que faremos manualmente. */
.app-sider :deep(.ant-layout-sider-children) {
  background-color: #001f3f;
  /* Azul Escuro do seu mock */
}

.app-sider :deep(.ant-menu-light) {
  background-color: #001f3f !important;
  /* Fundo do menu Light no Sider Dark */
  color: white !important;
}

.app-sider :deep(.ant-menu-light .ant-menu-item-selected) {
  background-color: #42b983 !important;
  /* Cor de seleção verde/azul */
  color: white !important;
}

.app-sider :deep(.ant-menu-light .ant-menu-item:hover),
.app-sider :deep(.ant-menu-light .ant-menu-submenu-title:hover) {
  background-color: #003366 !important;
  /* Cor de hover */
  color: #fff !important;
}

.app-sider :deep(.ant-menu-submenu-title) {
  color: white !important;
}


/* 3. LOGO */
.logo-container {
  height: 64px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 0 16px;
}

.logo-text {
  white-space: nowrap;
}

.hub {
  font-size: 1.5em;
  /* Reduzido para caber melhor */
  font-weight: bold;
  color: #42b983;
  /* Verde/Azul para "Hub" */
}

.stock {
  font-size: 1.5em;
  font-weight: bold;
  color: white;
}

.logo-icon {
  color: white;
}

.app-header {
  background: #fff;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: sticky;
  top: 0;
  z-index: 9;
}

.trigger {
  font-size: 18px;
  padding-right: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.user-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 15px;
  /* Separa do botão Sair */
}

.user-details-header {
  display: flex;
  flex-direction: column;
  /* NOVO: Garante que o texto não quebre horizontalmente */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

@media (max-width: 991px) {
  .app-sider {
    position: fixed;
    height: 100vh;
    z-index: 1000;
    justify-content: flex-start;
  }
}
</style>