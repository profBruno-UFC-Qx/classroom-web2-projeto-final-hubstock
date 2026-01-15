<template>
    <div class="usuarios-container">
        <a-page-header title="Gerenciamento de Usuários" />

        <a-button type="primary" style="margin-bottom: 20px;" @click="abrirModalCriar">
            <template #icon><plus-outlined /></template>
            Criar novo usuário
        </a-button>

        <a-alert v-if="userStore.error" message="Erro ao carregar" :description="userStore.error" type="error" show-icon
            style="margin-bottom: 15px;" />

        <a-card title="Lista de Usuários" :loading="userStore.isLoading">
            <a-table :columns="colunas" :data-source="userStore.users" row-key="id" :pagination="{ pageSize: 10 }"
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
                                @change="(novoCargo: any) => mudarCargo(record.id, novoCargo, record.nome)"
                                :disabled="record.id === authStore.usuario.id">
                                <a-select-option value="ADMINISTRADOR">ADMIN</a-select-option>
                                <a-select-option value="GARCOM">GARCOM</a-select-option>
                            </a-select>

                            <a-divider type="vertical" />

                            <a-button type="link" @click="abrirModalEditar(record)" title="Editar Usuário">
                                <template #icon><edit-outlined /></template>
                            </a-button>

                            <a-popconfirm title="Apagar este usuário?" @confirm="deletarUsuario(record.id, record.nome)"
                                :disabled="record.id === authStore.usuario.id">
                                <a-button type="link" danger :disabled="record.id === authStore.usuario.id">
                                    <template #icon><delete-outlined /></template>
                                </a-button>
                            </a-popconfirm>
                        </a-space>
                    </template>
                </template>
            </a-table>
        </a-card>

        <UserForm :open="modalAberto" :user="usuarioParaEditar" @close="fecharModal"
            @saved="userStore.carregarUsuarios()" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import UserForm from '@/components/UserForm.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

const modalAberto = ref(false);
const usuarioParaEditar = ref(null);

const colunas = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome', width: 200 },
    { title: 'E-mail', dataIndex: 'email', key: 'email', width: 250 },
    { title: 'Cargo', dataIndex: 'role', key: 'role', width: 150 },
    { title: 'Ações', key: 'action', width: 220 },
];

// Troca o cargo do funcionário
const mudarCargo = async (userId: string, novoCargo: any, userName: string) => {
    try {
        await userStore.changeUserRole(userId, novoCargo, userName);
        message.success(`Cargo de ${userName} atualizado!`);
    } catch (e) {
        console.error(e);
        message.error('Não foi possível mudar o cargo.');
    }
};

// Exclui um usuário
const deletarUsuario = async (userId: string, userName: string) => {
    if (userId === authStore.usuario.id) {
        return message.warning('Você não pode se auto-excluir!');
    }

    try {
        await userStore.deleteUser(userId, userName);
        message.success(`Usuário ${userName} removido.`);
    } catch (e) {
        console.error(e);
        message.error('Erro ao excluir usuário.');
    }
};

const abrirModalCriar = () => {
    usuarioParaEditar.value = null;
    modalAberto.value = true;
};

const abrirModalEditar = (usuario: any) => {
    usuarioParaEditar.value = { ...usuario };
    modalAberto.value = true;
};

const fecharModal = () => {
    modalAberto.value = false;
    usuarioParaEditar.value = null;
};

onMounted(() => {
    userStore.carregarUsuarios();
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