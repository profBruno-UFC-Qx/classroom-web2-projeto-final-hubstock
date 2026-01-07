<template>
    <div class="profile-container">
        <a-page-header title="Meu Perfil" class="header-no-padding" />

        <div class="content-wrapper">
            <a-card :loading="userStore.isLoading" class="form-card">
                <a-form layout="vertical" :model="formState">

                    <div class="avatar-header">
                        <a-avatar :src="authStore.user.profileImage" :size="64" />
                        <div class="user-info">
                            <h3 class="username-display">{{ authStore.userName }}</h3>
                            <a-tag color="blue">{{ authStore.userRole }}</a-tag>
                        </div>
                    </div>

                    <a-divider />

                    <a-row :gutter="24">
                        <a-col :span="24" :md="12">
                            <a-form-item label="Nome Completo" required>
                                <a-input v-model:value="formState.name" placeholder="Nome completo" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24" :md="12">
                            <a-form-item label="E-mail de Acesso" required>
                                <a-input v-model:value="formState.email" placeholder="email@dominio.com" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-divider orientation="left">Segurança</a-divider>

                    <a-row :gutter="24">
                        <a-col :span="24" :md="8">
                            <a-form-item label="Senha Atual">
                                <a-input-password v-model:value="formState.currentPassword"
                                    placeholder="Deixe vazio para manter a atual" />
                            </a-form-item>
                        </a-col>

                        <a-col :span="24" :md="8">
                            <a-form-item label="Nova Senha">
                                <a-input-password v-model:value="formState.newPassword"
                                    placeholder="*************" />
                            </a-form-item>
                        </a-col>

                        <a-col :span="24" :md="8">
                            <a-form-item label="Repita Senha">
                                <a-input-password v-model:value="formState.confirmPassword"
                                    placeholder="*************" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-form-item class="actions-row">
                        <a-button type="primary" :disabled="!isFormValid || userStore.isLoading" @click="handleSubmit">
                            <template #icon><check-outlined /></template>
                            Salvar Alterações
                        </a-button>
                    </a-form-item>

                    <a-alert v-if="error" :message="error" type="error" show-icon />
                </a-form>
            </a-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { message } from 'ant-design-vue';
import { CheckOutlined } from '@ant-design/icons-vue';

const authStore = useAuthStore();
const userStore = useUserStore();

const formState = reactive({
    name: authStore.userName || '',
    email: authStore.userEmail || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});
const error = ref<string | null>(null);

const isFormValid = computed(() => {
    // Verifica se o nome e o email têm conteúdo
    return formState.name.length > 0 && formState.email.length > 0;
});

// Nota: Em um projeto real, você buscaria o email do usuário no backend, mas aqui ele é mockado.
const loadInitialData = () => {
    // Simula a busca do email do usuário logado (usado apenas para o Super Admin/Admin)
    const user = userStore.users.find(u => u.id === authStore.userId);

    if (user) {
        formState.email = user.email; // Usa o email do mockData para o usuário logado
        formState.name = user.name;
    }
};

const handleSubmit = async () => {
    error.value = null;

    if (!isFormValid.value) {
        error.value = "Por favor, preencha o nome e um e-mail válido.";
        return;
    }

    // ⚠️ Validação de Senha Mockada
    if (formState.newPassword && formState.newPassword.length < 4) {
        error.value = 'A nova senha deve ter pelo menos 4 caracteres.';
        return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
        error.value = 'A nova senha e a confirmação não coincidem.';
        return;
    }

    if (formState.currentPassword.length < 4) {
        error.value = 'A senha atual deve ter pelo menos 4 caracteres.';
        return;
    }

    try {
        const payload = {
            name: formState.name,
            email: formState.email,
            newPassword: formState.newPassword || undefined,
        };

        // Chamada ao store para atualizar o perfil mockado
        await userStore.updateUserProfile(authStore.userId!, payload);

        message.success('Perfil e credenciais atualizados com sucesso!');
        formState.newPassword = ''; // Limpa o campo de senha após sucesso

    } catch (e: unknown) {
        error.value = (e as Error).message || 'Falha ao salvar as alterações.';
    }
};

onMounted(() => {
    userStore.loadUsers();
    loadInitialData();
});
</script>

<style scoped>
.profile-container :deep(.ant-page-header) {
    padding-left: 0;
}

.profile-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.profile-container {
    padding: 20px;
}

.form-card {
    border-radius: 8px;
}

.avatar-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 5px;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.username-display {
    margin: 0;
    font-size: 1.4em;
    font-weight: 600;
    color: #1f1f1f;
}

.actions-row {
    margin-top: 24px;
    margin-bottom: 0;
}
</style>