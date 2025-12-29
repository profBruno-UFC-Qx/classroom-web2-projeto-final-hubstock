<template>
    <div class="usuarios-container">
        <a-page-header title="Gerenciamento de Usuários" />

        <a-button type="dashed" style="margin-bottom: 20px;" @click="openCreateModal">
            <template #icon><plus-outlined /></template>
            Criar novo usuário
        </a-button>

        <a-alert v-if="userStore.error" message="Erro de Carga" :description="userStore.error" type="error" show-icon
            style="margin-bottom: 15px;" />

        <a-card title="Lista de Usuários" :loading="userStore.isLoading">
            <a-table :columns="columns" :data-source="userStore.users" row-key="id" :pagination="{ pageSize: 10 }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'role'">
                        <a-tag :color="record.role === 'ADMINISTRADOR' ? 'magenta' : 'blue'">
                            {{ record.role }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'action'">
                        <a-select :value="record.role" style="width: 150px; margin-right: 10px;"
                            @change="(newRole: UserRole) => handleChangeRole(record.id, newRole, record.name)"
                            :disabled="record.role === authStore.userRole">
                            <a-select-option value="ADMINISTRADOR">ADMINISTRADOR</a-select-option>
                            <a-select-option value="GARCOM">GARCOM</a-select-option>
                        </a-select>

                        <a-divider type="vertical" />

                        <a-popconfirm title="Tem certeza que deseja excluir este usuário?" ok-text="Sim"
                            cancel-text="Não" @confirm="handleDeleteUser(record.id, record.name)"
                            :disabled="record.role === authStore.userRole">
                            <a-button type="link" danger :disabled="record.role === authStore.userRole">
                                <template #icon><delete-outlined /></template>
                            </a-button>
                        </a-popconfirm>
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
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'E-mail', dataIndex: 'email', key: 'email' },
    { title: 'Papel', dataIndex: 'role', key: 'role', width: 150 },
    { title: 'Ações', key: 'action', width: 300 },
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
}

.usuarios-container :deep(.ant-page-header-heading-title) {
    flex-direction: column;
    align-items: flex-start;
}
</style>