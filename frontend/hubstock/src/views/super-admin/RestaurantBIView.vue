<template>
    <div class="bi-container">
        <a-page-header :title="restaurantName" @back="() => $router.back()" />

        <a-alert v-if="biStore.error" :message="biStore.error" type="error" show-icon style="margin-bottom: 25px;" />

        <a-spin :spinning="biStore.isLoading">

            <a-card title="Faturamento e Lucro Histórico" style="margin-bottom: 30px;">
                <a-table :columns="revenueColumns" :data-source="biStore.revenueHistory" row-key="month" size="small"
                    :pagination="false" :scroll="{ x: 600 }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'value'">
                            <span :style="{ color: record.profit > 0 ? '#52c41a' : '#f5222d' }">
                                R$ {{ record.revenue.toFixed(2) }}
                            </span>
                        </template>
                        <template v-if="column.key === 'profit'">
                            <a-tag :color="record.profit > 0 ? 'success' : 'error'">
                                R$ {{ record.profit.toFixed(2) }}
                            </a-tag>
                        </template>
                    </template>
                </a-table>
            </a-card>

            <a-card title="Top 10 Produtos Mais Vendidos" style="margin-bottom: 30px;">
                <a-table :columns="topSellersColumns" :data-source="biStore.topSellers" row-key="productId" size="small"
                    :pagination="false" :scroll="{ x: 600 }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'totalRevenue'">
                            R$ {{ record.totalRevenue.toFixed(2) }}
                        </template>
                    </template>
                </a-table>
            </a-card>

            <a-card title="Usuários do Restaurante" style="margin-bottom: 30px;">
                <template #extra>
                    <a-button type="primary" @click="showAddUserModal">
                        <template #icon>
                            <UserAddOutlined />
                        </template>
                        Novo Usuário
                    </a-button>
                </template>

                <a-table :columns="userColumns" :data-source="filteredUsers" row-key="id" size="small"
                    :loading="userStore.isLoading" :scroll="{ x: 700 }">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'role'">
                            <a-tag color="blue">{{ record.role }}</a-tag>
                        </template>
                        <template v-if="column.key === 'actions'">
                            <div class="actions-cell">
                                <a-button type="link" size="small" @click="handleEditUser(record)">Editar</a-button>
                                <a-popconfirm title="Remover acesso deste usuário?" @confirm="handleDeleteUser(record)">
                                    <a-button type="link" danger size="small">Remover</a-button>
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </a-card>

            <a-modal v-model:open="isUserModalVisible"
                :title="isEditing ? 'Editar Usuário' : 'Adicionar Usuário ao Restaurante'" @ok="handleSaveUser"
                :confirmLoading="userStore.isLoading">
                <a-form layout="vertical">
                    <a-form-item label="Nome Completo" required>
                        <a-input v-model:value="userForm.name" placeholder="Ex: João Silva" />
                    </a-form-item>

                    <a-form-item label="E-mail (Login)" required>
                        <a-input v-model:value="userForm.email" placeholder="joao.silva@email.com" />
                    </a-form-item>

                    <a-form-item label="Papel no Sistema" required>
                        <a-select v-model:value="userForm.role" placeholder="Selecione um cargo">
                            <a-select-option value="ADMINISTRADOR">ADMINISTRADOR</a-select-option>
                            <a-select-option value="GARCOM">GARÇOM</a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item :label="isEditing ? 'Nova Senha (deixe vazio para manter)' : 'Senha Inicial'"
                        :required="!isEditing">
                        <a-input-password v-model:value="userForm.password" placeholder="Mínimo 4 caracteres" />
                    </a-form-item>
                </a-form>
            </a-modal>

        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useBistore } from '@/stores/bi';
import { useRestaurantStore } from '@/stores/restaurant';
import { UserAddOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/stores/user';
import type { UserRole } from '@/types/entity-types';
import { App } from 'ant-design-vue';

const { message } = App.useApp();
const route = useRoute();
const biStore = useBistore();
const restaurantStore = useRestaurantStore();
const restId = route.params.restId as string;
const userStore = useUserStore();
const isUserModalVisible = ref(false);
const isEditing = ref(false);
const editingUserId = ref<string | null>(null);

const restaurantName = ref(`Carregando nome... (${restId})`);

const userForm = reactive({
    name: '',
    email: '',
    role: 'GARCOM' as UserRole,
    password: ''
});

type TopSeller = { productId: string; productName: string; totalQuantity: number; totalRevenue: number };

const filteredUsers = computed(() => {
    return userStore.users.filter(u => u.restaurantId === restId);
});

// Colunas para Faturamento
const revenueColumns = [
    { title: 'Período', dataIndex: 'month', key: 'month', width: 80 },
    { title: 'Receita Bruta', dataIndex: 'revenue', key: 'value', width: 150 },
    { title: 'Lucro Líquido', dataIndex: 'profit', key: 'profit', width: 150 },
];

// Colunas para Produtos Mais Vendidos
const topSellersColumns = [
    { title: 'Produto', dataIndex: 'productName', key: 'productName', minWidth: 200 },
    { title: 'Qtd. Total Vendida', dataIndex: 'totalQuantity', key: 'totalQuantity', width: 180, sorter: (a: TopSeller, b: TopSeller) => b.totalQuantity - a.totalQuantity },
    { title: 'Faturamento Total', dataIndex: 'totalRevenue', key: 'totalRevenue', width: 150 },
];

// Colunas para Usuários
const userColumns = [
    { title: 'Nome', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'E-mail', dataIndex: 'email', key: 'email', width: 220 },
    { title: 'Cargo', dataIndex: 'role', key: 'role', width: 140 },
    { title: 'Ações', key: 'actions', width: 120, fixed: 'right' },
];

const fetchRestaurantName = async () => {
    // Garante que a lista de restaurantes esteja carregada
    await restaurantStore.loadRestaurants();

    const restaurant = restaurantStore.restaurants.find(r => r.id === restId);

    if (restaurant) {
        restaurantName.value = restaurant.name;
    } else {
        restaurantName.value = `Restaurante (ID: ${restId}) não encontrado`;
    }
};

const showAddUserModal = () => {
    isEditing.value = false;
    editingUserId.value = null;
    Object.assign(userForm, { name: '', email: '', role: 'GARCOM', password: '' });
    isUserModalVisible.value = true;
};

const handleEditUser = (user: any) => {
    isEditing.value = true;
    editingUserId.value = user.id;
    Object.assign(userForm, {
        name: user.name,
        email: user.email,
        role: user.role,
        password: '' // Senha começa vazia na edição
    });
    isUserModalVisible.value = true;
};

const handleSaveUser = async () => {
    // Validação simples
    if (!userForm.name || !userForm.email) {
        return message.warning('Preencha os campos obrigatórios');
    }

    try {
        if (isEditing.value && editingUserId.value) {
            // Lógica de Update (usando a action que criamos no userStore)
            await userStore.updateUserProfile(editingUserId.value, {
                name: userForm.name,
                email: userForm.email,
                newPassword: userForm.password || undefined
            });
            message.success('Usuário atualizado com sucesso');
        } else {
            // Lógica de Create
            await userStore.createUserMock({
                name: userForm.name,
                email: userForm.email,
                role: userForm.role,
                password: userForm.password,
                restaurantId: restId
            });
            message.success('Usuário criado com sucesso');
        }
        isUserModalVisible.value = false;
    } catch (e) {
        console.error(e);
        message.error('Erro ao salvar usuário');
    }
};

const handleDeleteUser = async (user: any) => {
    await userStore.deleteUser(user.id, user.name);
};

onMounted(() => {
    biStore.loadRestaurantBI(restId);
    fetchRestaurantName();
    userStore.loadUsers();
});

</script>

<style scoped>
.bi-container :deep(.ant-page-header) {
    padding-left: 0;
}

.bi-container {
    padding: 20px;
    max-width: 100vw;
    overflow-x: hidden;
}

.bi-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.actions-cell {
    display: flex;
    gap: 8px;
    align-items: center;
}

.actions-cell :deep(.ant-btn-link) {
    padding: 0;
    height: auto;
}

:deep(.ant-table-body), 
:deep(.ant-table-content) {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
}
</style>