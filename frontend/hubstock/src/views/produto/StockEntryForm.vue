<template>
  <a-modal
    :open="open"
    :title="`Entrada de Estoque: ${product?.name}`"
    @cancel="$emit('close')"
    @ok="handleSave"
    :confirmLoading="isLoading"
  >
    <a-form layout="vertical">
      <a-form-item label="Quantidade a adicionar" required>
        <a-input-number v-model:value="quantity" :min="1" style="width: 100%" />
      </a-form-item>
      <a-form-item label="Notas/Observações">
        <a-textarea v-model:value="notes" :rows="3" placeholder="Ex: Fornecedor X, Lote Y" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Product } from '@/types/entity-types';

const props = defineProps<{
  open: boolean;
  product: Product | null;
  isLoading: boolean;
}>();

const emit = defineEmits(['close', 'confirm']);

const quantity = ref(1);
const notes = ref('');

// Resetar campos ao abrir
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    quantity.value = 1;
    notes.value = '';
  }
});

const handleSave = () => {
  emit('confirm', {
    productId: props.product?.id,
    quantity: quantity.value,
    notes: notes.value
  });
};
</script>