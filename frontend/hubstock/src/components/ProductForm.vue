<template>
  <a-modal :open="open" :title="isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'" @cancel="$emit('close')"
    @ok="handleSubmit" :confirm-loading="isLoading">
    <a-form layout="vertical" :model="formState">

      <a-form-item label="Nome" required>
        <a-input v-model:value="formState.name" placeholder="Ex: Cerveja Pilsen Lata 350ml" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Categoria" required>
            <a-select v-model:value="formState.categoryId" placeholder="Selecione a categoria">
              <a-select-option v-for="cat in productStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Unidade de Medida" required>
            <a-select v-model:value="formState.unitOfMeasure" placeholder="Ex: UNIDADE">
              <a-select-option value="UNIDADE">UNIDADE</a-select-option>
              <a-select-option value="LITRO">LITRO</a-select-option>
              <a-select-option value="KILOGRAMA">KILOGRAMA</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Preço de Custo (R$)" required>
            <a-input-number v-model:value="formState.costPrice" :min="0" style="width: 100%" placeholder="Ex: 10.00" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Preço de Venda (R$)" required>
            <a-input-number v-model:value="formState.salePrice" :min="0" style="width: 100%" placeholder="Ex: 15.00" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="Descrição">
        <a-textarea v-model:value="formState.description" :rows="2" placeholder="Descreva o produto" />
      </a-form-item>

      <a-form-item label="URL da Imagem">
        <a-input v-model:value="formState.imageUrl" placeholder="URL da imagem do produto" />
      </a-form-item>

      <a-form-item v-if="!isEditMode" label="Estoque Inicial" required>
        <a-input-number v-model:value="formState.currentStock" :min="0" style="width: 100%" placeholder="Ex: 200" />
      </a-form-item>

      <a-alert v-if="error" message="Erro ao salvar" :description="error" type="error" show-icon
        style="margin-top: 15px;" />
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useProductStore } from '@/stores/product';
import type { Product, ProductUnit } from '@/types/entity-types';
import { message } from 'ant-design-vue';

const productStore = useProductStore();

const props = defineProps<{
  open: boolean;
  product?: Product | null;
}>();

interface FormStateType {
  id?: number;
  name: string;
  description: string;
  categoryId: number | undefined;
  unitOfMeasure: ProductUnit;
  costPrice: number | null;
  salePrice: number | null;
  currentStock: number | null;
  imageUrl: string;
}

const emit = defineEmits(['close', 'saved']);

// Estado local do forms
const defaultFormState = {
  name: '',
  description: '',
  categoryId: undefined as number | undefined,
  unitOfMeasure: 'UNIDADE' as ProductUnit,
  costPrice: null as number | null,
  salePrice: null as number | null,
  currentStock: null as number | null,
  imageUrl: '',
};

const formState = ref({ ...defaultFormState });
const isLoading = ref(false);
const error = ref<string | null>(null);

const isEditMode = computed(() => !!props.product);

// Reseta o forms ou carrega dados do produto para edição
watch(() => props.open, (newOpen) => {
  if (newOpen) {
    error.value = null;
    if (props.product) {
      formState.value = {
        id: props.product.id,
        name: props.product.name,
        description: props.product.description,
        categoryId: props.product.categoryId,
        unitOfMeasure: props.product.unitOfMeasure,
        costPrice: props.product.costPrice,
        salePrice: props.product.salePrice,
        currentStock: props.product.currentStock,
        imageUrl: props.product.imageUrl || '',
      } as FormStateType;
    } else {
      // Resetar para o estado padrão
      formState.value = { ...defaultFormState };
    }
    // As categorias estejam sempre carregadas
    productStore.loadAllData();
  }
}, { immediate: true });

// Validação do forms
const validate = () => {
  if (
    !formState.value.name ||
    !formState.value.categoryId ||
    !formState.value.unitOfMeasure ||
    formState.value.costPrice == null ||
    formState.value.salePrice == null
  ) {
    error.value = 'Por favor, preencha todos os campos obrigatórios.';
    return false;
  }

  const cost = Number(formState.value.costPrice);
  const sale = Number(formState.value.salePrice);

  if (cost >= sale) {
    error.value = 'O Preço de Venda deve ser maior que o Preço de Custo.';
    return false;
  }
  return true;
};


// Submissão do forms
const handleSubmit = async () => {
  if (!validate()) return;

  isLoading.value = true;
  error.value = null;

  try {
    const dataToSend = {
      name: formState.value.name,
      description: formState.value.description,
      categoryId: formState.value.categoryId!,
      unitOfMeasure: formState.value.unitOfMeasure,
      costPrice: formState.value.costPrice,
      salePrice: formState.value.salePrice,
      imageUrl: formState.value.imageUrl || '',
      currentStock: formState.value.currentStock,
    } as Product;

    if (isEditMode.value) {
      // EDIÇÃO - atualiza no Service, mas sem mudar o currentStock aqui, pois a Entrada/Saída fará isso
      const updatedProduct = await productStore.updateProduct(props.product!.id, dataToSend);
      message.success(`Produto ${updatedProduct.name} atualizado com sucesso!`);
    } else {
      // CRIAÇÃO
      const newProduct = await productStore.addNewProduct(dataToSend as Omit<Product, 'id'>);
      message.success(`Produto ${newProduct.name} criado com sucesso!`);
    }

    emit('saved');
    emit('close');

  } catch (err: unknown) {
    error.value = (err as Error).message || 'Falha ao processar o produto.';
  } finally {
    isLoading.value = false;
  }
};
</script>