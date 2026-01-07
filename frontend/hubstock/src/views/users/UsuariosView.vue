<template>
    <div class="usuarios-container">
        <a-page-header title="Gerenciamento de Usuários" />

        <a-button type="primary" style="margin-bottom: 20px;" @click="openCreateModal">
            <template #icon><plus-outlined /></template>
            Criar novo usuário
        </a-button>

        <a-alert v-if="userStore.error" message="Erro de Carga" :description="userStore.error" type="error" show-icon
            style="margin-bottom: 15px;" />

        <a-card title="Lista de Usuários" :loading="userStore.isLoading">
            <a-table :columns="columns" :data-source="userStore.users" row-key="id" :pagination="{ pageSize: 10 }"
                :scroll="{ x: 800 }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'role'">
                        <a-tag :color="record.role === 'ADMINISTRADOR' ? 'magenta' : 'blue'">
                            {{ record.role }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'action'">
                        <a-space :size="8">
                            <a-select :value="record.role" style="width: 140px;"
                                @change="(newRole: UserRole) => handleChangeRole(record.id, newRole, record.name)"
                                :disabled="record.id === authStore.userId">
                                <a-select-option value="ADMINISTRADOR">ADMIN</a-select-option>
                                <a-select-option value="GARCOM">GARCOM</a-select-option>
                            </a-select>

                            <a-divider type="vertical" />

                            <a-popconfirm title="Excluir este usuário?" ok-text="Sim" cancel-text="Não"
                                @confirm="handleDeleteUser(record.id, record.name)"
                                :disabled="record.id === authStore.userId">
                                <a-tooltip title="Excluir Usuário">
                                    <a-button type="link" danger :disabled="record.id === authStore.userId"
                                        style="padding: 0">
                                        <template #icon><delete-outlined style="font-size: 18px;" /></template>
                                    </a-button>
                                </a-tooltip>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>

        <UserForm :open="isModalVisible" @close="closeModal" @saved="userStore.loadUsers(true)" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types/entity-types';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import UserForm from '@/components/UserForm.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

const isModalVisible = ref(false);

const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'E-mail', dataIndex: 'email', key: 'email', width: 250 },
    {
        title: 'Papel',
        dataIndex: 'role',
        key: 'role',
        width: 150
    },
    {
        title: 'Ações',
        key: 'action',
        width: 220,
    },
];

// Mudança de papel do usuário.
const handleChangeRole = async (userId: string, newRole: UserRole, userName: string) => {
    // verifica se é o próprio usuário logado
    if (userId === authStore.userId) {
        message.warning('Você não pode alterar seu próprio papel a partir desta interface.');
        return;
    }

    await userStore.changeUserRole(userId, newRole, userName);
};

// Exclusão de um usuário.
const handleDeleteUser = async (userId: string, userName: string) => {
    // proibe a auto-exclusão
    if (userId === authStore.userId) {
        message.warning('Você não pode se auto-excluir.');
        return;
    }

    await userStore.deleteUser(userId, userName);
};

const openCreateModal = () => {
    isModalVisible.value = true;
};

const closeModal = () => {
    isModalVisible.value = false;
};

onMounted(() => {
    userStore.loadUsers();
});
</script>

<style scoped>
.usuarios-container :deep(.ant-page-header) {
    padding-left: 0;
}

.usuarios-container {
    padding: 20px;
    max-width: 100vw;
    overflow-x: hidden;
}

.usuarios-container :deep(.ant-page-header-heading-title) {
    flex-direction: column;
    align-items: flex-start;
}

:deep(.ant-table-cell) {
    white-space: nowrap;
}

.actions-cell {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>