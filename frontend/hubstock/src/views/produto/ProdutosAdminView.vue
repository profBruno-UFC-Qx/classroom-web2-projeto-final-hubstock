<template>
  <div class="produto-container">
    <a-page-header title="Gerenciamento de Produtos" />

    <a-button type="primary" style="margin-bottom: 20px;" @click="openCreateModal">
      <template #icon><plus-outlined /></template>
      Adicionar Novo Produto
    </a-button>

    <a-alert v-if="productStore.error" message="Erro de Carga" :description="productStore.error" type="error" show-icon
      style="margin-bottom: 15px;" />

    <a-table :columns="columns" :data-source="productStore.enrichedProducts" :loading="productStore.isLoading"
      row-key="id" :scroll="{ x: 900 }">
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'image'">
          <img :src="record.imageUrl" alt="Imagem do Produto" class="product-thumb" @error="handleImageError(record)" />
        </template>

        <template v-if="column.key === 'currentStock'">
          <a-tag :color="record.isLowStock ? 'volcano' : 'green'">
            {{ record.currentStock }} {{ record.unitOfMeasure }}
          </a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <a-space :size="0">
            <a-tooltip title="Entrada de Estoque">
              <a-button type="link" @click="openStockModal(record)" style="color: #fa8c16">
                <template #icon><import-outlined /></template>
              </a-button>
            </a-tooltip>

            <a-divider type="vertical" />

            <a-tooltip title="Editar Produto">
              <a-button type="link" @click="openEditModal(record)">
                <template #icon><edit-outlined /></template>
              </a-button>
            </a-tooltip>

            <a-divider type="vertical" />

            <a-popconfirm title="Deletar este produto?" ok-text="Sim" cancel-text="Não"
              @confirm="confirmDelete(record.id, record.name)">
              <a-tooltip title="Excluir Produto">
                <a-button type="link" danger>
                  <template #icon><delete-outlined /></template>
                </a-button>
              </a-tooltip>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <ProductForm :open="isEditModalVisible" :product="selectedProduct" @close="closeModal"
      @saved="productStore.loadAllData(true)" />

    <StockEntryForm :open="isStockModalVisible" :product="selectedProduct" :isLoading="productStore.isLoading"
      @close="closeStockModal" @confirm="handleStockConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import type { Product } from '@/types/entity-types';
import ProductForm from '@/components/ProductForm.vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, EditOutlined, DeleteOutlined, ImportOutlined } from '@ant-design/icons-vue';
import StockEntryForm from './StockEntryForm.vue';

const productStore = useProductStore();
const FALLBACK_IMAGE_URL = 'https://placehold.co/50x50/D9D9D9/888888?text=P';

const isEditModalVisible = ref(false);
const isStockModalVisible = ref(false);
const selectedProduct = ref<Product | null>(null);

// Colunas da tabela
const columns = [
  {
    title: 'Imagem',
    dataIndex: 'imageUrl',
    key: 'image',
    width: 80,
  },
  {
    title: 'Nome',
    dataIndex: 'name',
    key: 'name',
    width: 200, // Largura fixa para evitar quebra de texto excessiva
    sorter: (a: Product, b: Product) => a.name.localeCompare(b.name)
  },
  {
    title: 'Categoria',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 150
  },
  {
    title: 'Estoque',
    dataIndex: 'currentStock',
    key: 'currentStock',
    width: 120,
    sorter: (a: Product, b: Product) => a.currentStock - b.currentStock
  },
  {
    title: 'Preço Venda',
    dataIndex: 'salePrice',
    key: 'salePrice',
    width: 130,
    customRender: ({ text }: { text: number }) => `R$ ${text.toFixed(2)}`
  },
  {
    title: 'Ações',
    key: 'action',
    width: 130,
    fixed: 'right',
    align: 'center'
  },
];

const openStockModal = (product: Product) => {
  selectedProduct.value = product;
  isStockModalVisible.value = true;
};

const closeStockModal = () => {
  isStockModalVisible.value = false;
  selectedProduct.value = null;
};

const handleStockConfirm = async (data: { productId: number, quantity: number, notes: string }) => {
  try {
    await productStore.registerEntry(data.productId, data.quantity, data.notes);
    message.success('Estoque atualizado!');
    closeStockModal();
  } catch (e) {
    message.error('Erro ao atualizar estoque');
    console.error('Erro ao atualizar estoque: ', e);
  }
};

const handleImageError = (record: Product) => {
  // Quando a URL falha, substitui pela imagem de fallback
  record.imageUrl = FALLBACK_IMAGE_URL;
};

// Criar
const openCreateModal = () => {
  selectedProduct.value = null;
  isEditModalVisible.value = true;
};

// Editar
const openEditModal = (product: Product) => {
  selectedProduct.value = product;
  isEditModalVisible.value = true;
};

const closeModal = () => {
  isEditModalVisible.value = false;
  selectedProduct.value = null;
};

// Deletar
const confirmDelete = async (id: number, name: string) => {
  try {
    await productStore.removeProduct(id);
    message.success(`Produto "${name}" excluído com sucesso!`);
  } catch (e: unknown) {
    message.error((e as Error).message || 'Falha ao excluir o produto.');
  }
};

onMounted(() => {
  productStore.loadAllData();
});
</script>

<style scoped>
.produto-container {
  padding: 20px;
  max-width: 100vw;
  overflow-x: hidden;
}

.produto-container :deep(.ant-page-header) {
  padding-left: 0;
}

.produto-container :deep(.ant-page-header-heading-title) {
  flex-direction: column;
  align-items: flex-start;
}

.product-thumb {
  width: 40px;
  /* Reduzi um pouco para equilibrar com os botões */
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.actions-cell :deep(.ant-btn) {
  padding: 4px 8px;
}

:deep(.ant-table-content) {
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch;
}

:deep(.ant-table-cell) {
  white-space: nowrap;
}
</style>