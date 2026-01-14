<template>
  <a-modal 
    :open="open" 
    :title="`Entrada de Estoque: ${product?.nomeProduto}`" 
    @cancel="$emit('close')" 
    @ok="salvarMudanca"
    :confirmLoading="isLoading" 
    ok-text="Confirmar Entrada" 
    cancel-text="Cancelar"
  >
    <a-form layout="vertical">
      <a-descriptions :column="1" size="small" style="margin-bottom: 20px">
        <a-descriptions-item label="Quanto tem agora">
          <a-tag color="blue">{{ product?.estoqueAtual }} {{ product?.unidadeMedidaProduto }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>

      <a-form-item label="Quantidade para adicionar" required>
        <a-input-number v-model:value="quantidade" :min="1" style="width: 100%" placeholder="Ex: 10" />
      </a-form-item>

      <a-form-item label="Observações (Opcional)">
        <a-textarea 
          v-model:value="observacao" 
          :rows="3"
          placeholder="Ex: Compra com fornecedor, ajuste de estoque..." 
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Produto } from '@/types/entity-types';
import { message } from 'ant-design-vue';

const props = defineProps<{
  open: boolean;
  product: Produto | null;
  isLoading: boolean;
}>();

const emit = defineEmits(['close', 'confirm']);

const quantidade = ref<number>(1);
const observacao = ref<string>('');

// Reseta os campos qnd o modal abre
watch(() => props.open, (estaAberto) => {
  if (estaAberto) {
    quantidade.value = 1;
    observacao.value = '';
  }
});

// Funcao que valida e manda os dados pro componente pai (a lista de produtos)
const salvarMudanca = () => {
  if (!props.product?.id) {
    return message.error('ID do produto não encontrado!');
  }

  if (quantidade.value <= 0) {
    return message.warning('Tem que colocar pelo menos 1 unidade.');
  }

  // Avisa o componente pai que pode salvar no banco
  emit('confirm', {
    productId: props.product.id,
    quantity: quantidade.value,
    notes: observacao.value
  });
};
</script>