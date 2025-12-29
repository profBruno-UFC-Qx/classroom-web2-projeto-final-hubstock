<template>
  <a-modal
    :open="open"
    title="Adicionar Novo Colaborador (Garçom)"
    @cancel="$emit('close')"
    @ok="handleSubmit"
    :confirm-loading="isLoading"
  >
    <a-form layout="vertical" :model="formState">
      
      <a-form-item label="Nome Completo" required>
        <a-input v-model:value="formState.name" placeholder="Ex: Maria da Silva" />
      </a-form-item>

      <a-form-item label="E-mail" required>
        <a-input v-model:value="formState.email" placeholder="Ex: maria.silva@hubstock.com" />
      </a-form-item>

      <a-form-item label="Senha" required>
        <a-input-password v-model:value="formState.password" placeholder="Digite uma senha" />
      </a-form-item>
      
      <a-form-item label="Papel Inicial" required>
        <a-select v-model:value="formState.role" :disabled="isEditMode">
            <a-select-option value="GARCOM">GARCOM</a-select-option>
            <a-select-option value="ADMINISTRADOR">ADMINISTRADOR</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-alert v-if="error" message="Erro ao salvar" :description="error" type="error" show-icon style="margin-top: 15px;" />
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { message } from 'ant-design-vue';

const userStore = useUserStore();

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['close', 'saved']);

const defaultFormState = {
  name: '',
  email: '',
  password: '',
  role: 'GARCOM' as const,
};

const formState = ref({ ...defaultFormState });
const isLoading = ref(false);
const error = ref<string | null>(null);
const isEditMode = ref(false);

// Reseta o formulário ao abrir
watch(() => props.open, (newOpen) => {
  if (newOpen) {
    error.value = null;
    formState.value = { ...defaultFormState };
  }
});

// Validação simples
const validate = () => {
  if (!formState.value.name || !formState.value.email || formState.value.password.length < 4) {
    error.value = 'Por favor, preencha nome e email, e defina uma senha de no mínimo 4 caracteres.';
    return false;
  }
  return true;
};

// Simulação de submissão
const handleSubmit = async () => {
  if (!validate()) return;

  isLoading.value = true;
  error.value = null;

  try {
    await userStore.createUserMock(formState.value); 
    
    message.success(`Colaborador ${formState.value.name} criado com sucesso!`);
    
    emit('saved');
    emit('close');

  } catch (err: unknown) {
    error.value = (err as Error).message || 'Falha ao simular a criação do usuário.';
  } finally {
    isLoading.value = false;
  }
};
</script>