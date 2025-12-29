<template>
    <div class="estoque-container">
        <a-page-header title="Registro de Entrada de Mercadoria" />

        <a-alert v-if="productStore.lowStockProducts.length > 0" message="ALERTA: ESTOQUE BAIXO" type="warning"
            show-icon :description="lowStockDescription" style="margin-bottom: 25px;" />
        <a-alert v-if="productStore.error" :message="productStore.error" type="error" show-icon
            style="margin-bottom: 25px;" />

        <div class="card-center-wrapper">

            <a-card title="Nova Entrada de Estoque" :loading="productStore.isLoading" class="input-card">
                <a-form layout="vertical" :model="formState">

                    <a-form-item label="Produto" required>
                        <a-select v-model:value="formState.productId"
                            placeholder="Selecione o produto a ser adicionado">
                            <a-select-option v-for="product in productStore.enrichedProducts" :key="product.id"
                                :value="product.id">
                                {{ product.name }} (Estoque atual: {{ product.currentStock }})
                            </a-select-option>
                        </a-select>
                        <a-alert v-if="selectedProduct" :message="`Unidade de Medida: ${selectedProduct.unitOfMeasure}`"
                            type="info" show-icon style="margin-top: 10px;" />
                    </a-form-item>

                    <a-form-item label="Quantidade de Entrada" required>
                        <a-input-number v-model:value="formState.quantity" :min="1" style="width: 100%"
                            placeholder="Ex: 50" />
                    </a-form-item>

                    <a-form-item label="Notas (Fornecedor, Lote, etc.)">
                        <a-textarea v-model:value="formState.notes" :rows="2"
                            placeholder="Ex: Comprado da Distribuidora ABC" />
                    </a-form-item>

                    <a-button type="primary" :disabled="!isFormValid || productStore.isLoading"
                        @click="handleSubmitEntry" class="btn-register">
                        <template #icon><plus-outlined /></template>
                        Registrar Entrada
                    </a-button>
                </a-form>
            </a-card>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '@/stores/product';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { Product } from '@/types/entity-types';

const productStore = useProductStore();

const formState = ref({
    productId: undefined as number | undefined,
    quantity: 1,
    notes: '',
});

// Encontrar o produto selecionado
const selectedProduct = computed(() => {
    if (!formState.value.productId) return null;
    return productStore.enrichedProducts.find(p => p.id === formState.value.productId) as Product | null;
});

// Validar o formulário
const isFormValid = computed(() => {
    return formState.value.productId !== undefined && formState.value.quantity > 0;
});

const lowStockDescription = computed(() => {
    if (productStore.lowStockProducts.length === 0) return '';

    const productNames = productStore.lowStockProducts
        .map(p => `${p.name} (${p.currentStock} ${p.unitOfMeasure})`)
        .join('; ');

    return `${productNames}`;
});

// Lida com a submissão do formulário de entrada de estoque.
const handleSubmitEntry = async () => {
    if (!isFormValid.value || !formState.value.productId) return;

    try {
        await productStore.registerEntry(
            formState.value.productId,
            formState.value.quantity,
            formState.value.notes
        );

        message.success(`Entrada de ${formState.value.quantity} unidades registrada com sucesso!`);

        formState.value.productId = undefined;
        formState.value.quantity = 1;
        formState.value.notes = '';

    } catch (e: unknown) {
        message.error((e as Error).message || 'Erro ao registrar a entrada de estoque.');
    }
};

onMounted(() => {
    productStore.loadAllData();
});
</script>

<style scoped>
.estoque-container :deep(.ant-page-header) {
    padding-left: 0;
}

.estoque-container {
    padding: 20px;
}

.card-center-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.input-card {
    width: 100%;
    max-width: 600px;
    margin-bottom: 30px;
    margin-left: 0;
    margin-right: 0;
}

.low-stock-card {
    width: 100%;
    max-width: 600px;
}

.estoque-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.estoque-container :deep(.ant-page-header-heading-sub-title) {
    margin-top: 5px;
    margin-left: 0 !important;
}

.btn-register {
    width: 100%;
}
</style>