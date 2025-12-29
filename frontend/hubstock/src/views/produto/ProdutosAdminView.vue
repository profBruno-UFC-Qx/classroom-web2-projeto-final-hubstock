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
      row-key="id">
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
          <a-button type="link" @click="openEditModal(record)">
            <template #icon><edit-outlined /></template>
            Editar
          </a-button>
          <a-divider type="vertical" />
          <a-popconfirm title="Tem certeza que deseja deletar este produto?" ok-text="Sim" cancel-text="Não"
            @confirm="confirmDelete(record.id, record.name)">
            <a-button type="link" danger>
              <template #icon><delete-outlined /></template>
              Excluir
            </a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <ProductForm :open="isModalVisible" :product="selectedProduct" @close="closeModal"
      @saved="productStore.loadAllData(true)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductStore } from '@/stores/product';
import type { Product } from '@/types/entity-types';
import ProductForm from '@/components/ProductForm.vue';
import { message } from 'ant-design-vue';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const productStore = useProductStore();
const FALLBACK_IMAGE_URL = 'https://placehold.co/50x50/D9D9D9/888888?text=P';

const isModalVisible = ref(false);
const selectedProduct = ref<Product | null>(null);

// Colunas da tabela
const columns = [
  { title: 'Imagem', dataIndex: 'imageUrl', key: 'image', width: 80 },
  { title: 'Nome', dataIndex: 'name', key: 'name', sorter: (a: Product, b: Product) => a.name.localeCompare(b.name) },
  { title: 'Categoria', dataIndex: 'categoryName', key: 'categoryName' },
  { title: 'Estoque', dataIndex: 'currentStock', key: 'currentStock', width: 120, sorter: (a: Product, b: Product) => a.currentStock - b.currentStock },
  { title: 'Preço Venda (R$)', dataIndex: 'salePrice', key: 'salePrice', width: 150, customRender: ({ text }: { text: number }) => `R$ ${text.toFixed(2)}` },
  { title: 'Ações', key: 'action', width: 180 },
];

const handleImageError = (record: Product) => {
  // Quando a URL falha, substitui pela imagem de fallback
  record.imageUrl = FALLBACK_IMAGE_URL;
};

// Criar
const openCreateModal = () => {
  selectedProduct.value = null;
  isModalVisible.value = true;
};

// Editar
const openEditModal = (product: Product) => {
  selectedProduct.value = product;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
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
.produto-container :deep(.ant-page-header) {
  padding-left: 0;
}

.produto-container :deep(.ant-page-header-heading-title) {
  flex-direction: column;
  align-items: flex-start;
}

.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  vertical-align: middle;
}

.produto-container {
  padding: 20px;
}
</style>