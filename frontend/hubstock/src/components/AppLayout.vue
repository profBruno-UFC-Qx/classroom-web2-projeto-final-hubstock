<template>
  <a-layout style="min-height: 100vh; background: #f0f2f5;">
    <a-layout-sider collapsible v-model:collapsed="collapsed" :trigger="null" breakpoint="lg" collapsed-width="0"
      @collapse="onSiderCollapse" @breakpoint="onBreakpointChange" class="app-sider"
      :style="{ position: isMobile ? 'fixed' : 'relative' }">
      <div class="logo-container">
        <div v-if="!collapsed" class="logo-text"><span class="hub">Hub</span><span class="stock">Stock</span></div>
        <div class="logo-icon" v-else><span class="hub">H</span><span class="stock">S</span></div>
      </div>

      <a-menu v-model:selectedKeys="selectedKeys" :theme="siderTheme" mode="inline" :open-keys="openKeys"
        @openChange="onOpenChange">
        <a-menu-item key="vendas" @click="goTo('MesaSelection')" v-if="!authStore.isSuperAdmin">
          <template #icon>
            <ShopOutlined />
          </template>
          <span>Venda</span>
        </a-menu-item>

        <a-menu-item key="dashboard" @click="goTo('Dashboard')" v-if="authStore.isAdmin">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>Dashboard</span>
        </a-menu-item>

        <a-menu-item key="produtos" @click="goTo('ProdutosAdmin')" v-if="authStore.isAdmin">
          <template #icon>
            <BoxPlotOutlined />
          </template>
          <span>Produtos</span>
        </a-menu-item>

        <a-menu-item key="estoque" @click="goTo('EstoqueAdmin')" v-if="authStore.isAdmin">
          <template #icon>
            <StockOutlined />
          </template>
          <span>Estoque</span>
        </a-menu-item>

        <a-menu-item key="users" @click="goTo('Users')" v-if="authStore.isAdmin">
          <template #icon>
            <UsergroupAddOutlined />
          </template>
          <span>Usuários</span>
        </a-menu-item>
        <a-menu-item key="dashboard_super_admin" @click="goTo('DashboardSuperAdmin')" v-if="authStore.isSuperAdmin">
          <template #icon>
            <DashboardOutlined />
          </template>
          <span>Dashboard</span>
        </a-menu-item>
        <!-- <a-divider /> -->
        <a-menu-item key="perfil" @click="goTo('UserProfile')">
          <template #icon><user-outlined /></template>
          <span>Meu Perfil</span>
        </a-menu-item>

      </a-menu>

    </a-layout-sider>

    <a-layout :style="{ transition: 'margin-left 0.2s' }">

      <a-layout-header class="app-header">
        <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" class="trigger" @click="toggleSider" />

        <div class="header-right">

          <div class="user-info-header">
            <a-avatar :size="30" :src="authStore.user.profileImage" />
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
        &copy; {{ new Date().getFullYear() }} HubStock
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  DashboardOutlined, MenuUnfoldOutlined, MenuFoldOutlined,
  BoxPlotOutlined, StockOutlined, ShopOutlined,
  LogoutOutlined, UserOutlined, UsergroupAddOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const siderTheme = ref<'light' | 'dark'>('light');

const collapsed = ref(false);
const isMobile = ref(false);
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

const onSiderCollapse = (collapsedState: boolean, type: 'clickTrigger' | 'responsive') => {
  if (type === 'responsive') {
    collapsed.value = collapsedState;
    isMobile.value = collapsedState;
  } else {
    collapsed.value = collapsedState;
  }
};

const onBreakpointChange = (broken: boolean) => {
  isMobile.value = broken;
  if (broken) {
    collapsed.value = true;
  } else {
    collapsed.value = false;
  }
};

const toggleSider = () => {
  collapsed.value = !collapsed.value;
};

const goTo = (name: string) => {
  router.push({ name });
  if (window.innerWidth < 992) {
    collapsed.value = true;
  }
};

const updateMenuSelection = (currentRoute: typeof route) => {
  const routeName = currentRoute.name as string;

  if (routeName === 'ProdutosAdmin') selectedKeys.value = ['produtos'];
  else if (routeName === 'MesaSelection') selectedKeys.value = ['vendas'];
  else if (routeName === 'Dashboard') selectedKeys.value = ['dashboard'];
  else if (routeName === 'EstoqueAdmin') selectedKeys.value = ['estoque'];
  else if (routeName === 'Users') selectedKeys.value = ['users'];
  else if (routeName === 'DashboardSuperAdmin') selectedKeys.value = ['dashboard_super_admin'];
  else if (routeName === 'UserProfile') selectedKeys.value = ['perfil'];
  else selectedKeys.value = [];
};

watch(route, (newRoute) => {
  updateMenuSelection(newRoute);
});

onMounted(() => {
  collapsed.value = false;
  updateMenuSelection(route);
});

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'Home' });
};

const onOpenChange = (currentOpenKeys: string[]) => {
  const latestOpenKey = currentOpenKeys.find(key => !openKeys.value.includes(key));

  if (latestOpenKey) {
    openKeys.value = [latestOpenKey];
  } else {
    openKeys.value = [];
  }
};

</script>

<style scoped>
.app-sider {
  height: 100vh;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.app-sider :deep(.ant-layout-sider-children) {
  background-color: #001f3f;
}

.app-sider :deep(.ant-menu-light) {
  background-color: #001f3f !important;
  color: white !important;
}

.app-sider :deep(.ant-menu-light .ant-menu-item-selected) {
  background-color: #42b983 !important;
  color: white !important;
}

.app-sider :deep(.ant-menu-light .ant-menu-item:hover),
.app-sider :deep(.ant-menu-light .ant-menu-submenu-title:hover) {
  background-color: #003366 !important;
  color: #fff !important;
}

.app-sider :deep(.ant-menu-submenu-title) {
  color: white !important;
}


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
  font-weight: bold;
  color: #42b983;
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

.app-header :deep(.anticon-menu-unfold) {
  padding-left: 0;
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
}

.user-details-header {
  display: flex;
  flex-direction: column;
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
</style>