<template>
  <a-modal :open="open" :title="isEditMode ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'"
    @cancel="$emit('close')" @ok="handleSubmit" :confirm-loading="isLoading">
    <a-form layout="vertical">

      <a-form-item label="Nome Completo" required>
        <a-input v-model:value="formState.nome" placeholder="Ex: Maria da Silva" />
      </a-form-item>

      <a-form-item label="E-mail" required>
        <a-input v-model:value="formState.email" placeholder="Ex: maria.silva@hubstock.com" />
      </a-form-item>

      <a-form-item :label="isEditMode ? 'Nova Senha (deixe em branco para manter)' : 'Senha'" :required="!isEditMode">
        <a-input-password v-model:value="formState.senha" placeholder="Mínimo 6 caracteres" />
      </a-form-item>

      <a-form-item label="Papel no Sistema" required v-if="!isEditMode">
        <a-select v-model:value="formState.role">
          <a-select-option value="GARCOM">GARÇOM</a-select-option>
          <a-select-option value="ADMINISTRADOR">ADMINISTRADOR</a-select-option>
        </a-select>
      </a-form-item>

      <a-alert v-if="error" message="Erro ao salvar" :description="error" type="error" show-icon
        style="margin-top: 15px;" />
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { message } from 'ant-design-vue';
import type { Usuario } from '@/types/entity-types';

const userStore = useUserStore();

const props = defineProps<{
  open: boolean;
  user?: Usuario | null;
}>();

const emit = defineEmits(['close', 'saved']);

const formState = ref({
  nome: '',
  email: '',
  senha: '',
  role: 'GARCOM',
})
const isLoading = ref(false);
const error = ref<string | null>(null);
const isEditMode = computed(() => !!props.user);

// Reseta o formulário ao abrir
watch(() => props.open, (newOpen) => {
  if (newOpen) {
    error.value = null;
    if (props.user) {
      formState.value = {
        nome: props.user.nome,
        email: props.user.email,
        senha: '',
        role: props.user.role,
      };
    } else {
      formState.value = { nome: '', email: '', senha: '', role: 'GARCOM' };
    }
  }
});

// Validação
const validate = () => {
  if (!formState.value.nome || !formState.value.email) {
    error.value = 'Nome e e-mail são obrigatórios.';
    return false;
  }
  if (!isEditMode.value && formState.value.senha.length < 6) {
    error.value = 'A senha deve ter no mínimo 6 caracteres.';
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;

  isLoading.value = true;
  error.value = null;

  try {
    if (isEditMode.value && props.user) {
      await userStore.updateUserProfile(props.user?.id, {
        nome: formState.value.nome,
        email: formState.value.email,
        senha: formState.value.senha
      });
      message.success(`Dados de ${formState.value.nome} atualizados!`);
    } else {
      await userStore.registerUserInRestaurant({
        nome: formState.value.nome,
        email: formState.value.email,
        papel: formState.value.role,
        senha: formState.value.senha,
        restauranteId: props.user?.restauranteId
      });
      message.success(`Colaborador ${formState.value.nome} criado com sucesso!`);
    }

    emit('saved');
    emit('close');
  } catch (err: any) {
    error.value = err.response?.data?.erro || 'Falha ao salvar usuário.';
  } finally {
    isLoading.value = false;
  }
};
</script>