<template>
    <div class="perfil-container">
        <a-page-header title="Meu Perfil" />

        <div class="corpo-perfil">
            <a-card :loading="userStore.isLoading">
                <a-form layout="vertical">

                    <div class="cabecalho-usuario">
                        <a-avatar :src="authStore.usuario?.imagemPerfil" :size="64">
                            <template #icon v-if="!authStore.usuario?.imagemPerfil">U</template>
                        </a-avatar>

                        <div class="texto-usuario">
                            <h3 class="nome-grande">{{ authStore.usuario?.nome }}</h3>
                            <a-tag color="blue">{{ authStore.usuario?.papel }}</a-tag>
                        </div>
                    </div>

                    <a-divider />

                    <a-row :gutter="24">
                        <a-col :span="24" :md="12">
                            <a-form-item label="Nome Completo" required>
                                <a-input v-model:value="formulario.nome" placeholder="Seu nome" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24" :md="12">
                            <a-form-item label="E-mail de Acesso" required>
                                <a-input v-model:value="formulario.email" placeholder="seu@email.com" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-form-item style="margin-top: 20px">
                        <a-button type="primary" :disabled="!formValido" @click="salvarPerfil">
                            <template #icon><check-outlined /></template>
                            Salvar Alterações
                        </a-button>
                    </a-form-item>

                    <a-alert v-if="mensagemErro" :message="mensagemErro" type="error" show-icon />
                </a-form>
            </a-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { message } from 'ant-design-vue';
import { CheckOutlined } from '@ant-design/icons-vue';

const authStore = useAuthStore();
const userStore = useUserStore();

const formulario = reactive({
    nome: authStore.usuario?.nome || '',
    email: authStore.usuario?.email || '',
});

const mensagemErro = ref<string | null>(null);

const formValido = computed(() => {
    return formulario.nome.length >= 3 && formulario.email.includes('@');
});

const salvarPerfil = async () => {
    mensagemErro.value = null;

    try {
        const dadosParaSalvar = {
            nome: formulario.nome,
            email: formulario.email,
        };

        await userStore.updateUserProfile(authStore.usuario.id, dadosParaSalvar);

        message.success('Perfil atualizado com sucesso!');
    } catch (e: any) {
        mensagemErro.value = e.response?.data?.erro || 'Erro ao salvar os dados.';
    }
};
</script>

<style scoped>
.perfil-container :deep(.ant-page-header) {
    padding-left: 0;
}

.perfil-container {
    padding: 20px;
    max-width: 100vw;
    overflow-x: hidden;
}

.cabecalho-usuario {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 10px;
}

.nome-grande {
    margin: 0;
    font-size: 1.4em;
    font-weight: 600;
}

.texto-usuario {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>