<template>
  <a-modal
    :open="open"
    title="Registrar Nova Locação"
    @cancel="$emit('close')"
    @ok="handleSave"
    :confirmLoading="aluguelStore.isLoading"
    okText="Iniciar Aluguel"
    cancelText="Cancelar"
  >
    <a-form layout="vertical" :model="formState">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Nome do Cliente" required>
            <a-input v-model:value="formState.clienteNome" placeholder="Ex: Maria Oliveira" />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="Telefone / WhatsApp" required>
            <a-input 
              v-model:value="formState.clienteTelefone" 
              placeholder="(00) 00000-0000"
              @input="applyPhoneMask"
            />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item label="Objeto para Aluguel" required>
            <a-select
              v-model:value="formState.produtoId"
              placeholder="Selecione o objeto"
              @change="handleProductChange"
            >
              <a-select-option 
                v-for="prod in rentalProducts" 
                :key="prod.id" 
                :value="prod.id"
              >
                {{ prod.name }} (Disp: {{ prod.currentStock }})
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Quantidade" required>
            <a-input-number 
              v-model:value="formState.quantidade" 
              :min="1" 
              style="width: 100%" 
            />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Limite (Horas)" required>
            <a-input-number 
              v-model:value="formState.limiteHoras" 
              :min="1" 
              style="width: 100%" 
            />
          </a-form-item>
        </a-col>

      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { useAluguelStore } from '@/stores/aluguel';
import { useProductStore } from '@/stores/product';
import { message } from 'ant-design-vue';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['close']);

const aluguelStore = useAluguelStore();
const productStore = useProductStore();

const formState = reactive({
  clienteNome: '',
  clienteTelefone: '',
  produtoId: undefined as number | undefined,
  produtoNome: '',
  produtoFotoUrl: '',
  limiteHoras: 1,
  quantidade: 1,
});

// Filtra apenas produtos da categoria de aluguel (ID 40 conforme seu mock)
const rentalProducts = computed(() => {
  return productStore.enrichedProducts.filter(p => p.categoryId === 40);
});

// Máscara simples para telefone brasileiro
const applyPhoneMask = (e: Event) => {
  let val = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  
  if (val.length > 6) {
    val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
  } else if (val.length > 2) {
    val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
  } else if (val.length > 0) {
    val = `(${val}`;
  }
  formState.clienteTelefone = val;
};

// Sincroniza dados do produto selecionado (Foto e Nome)
const handleProductChange = (id: number) => {
  const prod = rentalProducts.value.find(p => p.id === id);
  if (prod) {
    formState.produtoNome = prod.name;
    formState.produtoFotoUrl = prod.imageUrl || '';
  }
};

// Limpa o formulário ao fechar/abrir
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    Object.assign(formState, {
      clienteNome: '',
      clienteTelefone: '',
      produtoId: undefined,
      produtoNome: '',
      produtoFotoUrl: '',
      limiteHoras: 1,
      quantidade: 1,
    });
  }
});

const handleSave = async () => {
  if (!formState.clienteNome || !formState.clienteTelefone || !formState.produtoId) {
    return message.warning('Por favor, preencha todos os campos obrigatórios.');
  }

  try {
    await aluguelStore.registrarAluguel({ ...formState });
    message.success('Locação iniciada com sucesso!');
    emit('close');
  } catch (e) {
    message.error('Erro ao registrar locação.');
    console.error(e);
  }
};
</script>