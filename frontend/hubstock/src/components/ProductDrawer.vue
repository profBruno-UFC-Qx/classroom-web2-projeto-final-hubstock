<template>
    <a-drawer title="Selecione os Produtos" :placement="placement" :width="drawerWidth" :open="open"
        @close="$emit('close')">

        <a-input-search v-model:value="searchText" placeholder="Buscar produtos..." style="margin-bottom: 20px;"
            enter-button />

        <div class="products-grid-drawer">
            <a-card v-for="product in filteredProducts" :key="product.id" hoverable class="product-card-drawer"
                :class="{ 'out-of-stock-card': product.currentStock === 0 }" @click="handleProductSelect(product)">

                <div class="product-stock-badge" :class="getStockBadgeClass(product.currentStock)">
                    {{ product.currentStock > 0 ? `Estoque: ${product.currentStock}` : 'ESGOTADO' }}
                </div>
                
                <template #cover>
                    <img alt="product" :src="product.imageUrl" class="product-image" style="height: 80px;"
                        @error="handleImageError(product)" />
                </template>

                <a-card-meta :title="product.name">
                    <template #description>
                        <div class="product-details">
                            <span class="price">R$ {{ product.salePrice.toFixed(2) }}</span>
                            <span> | {{ product.categoryName }}</span>
                        </div>
                    </template>
                </a-card-meta>
                
            </a-card>
            <a-empty v-if="filteredProducts.length === 0" description="Nenhum produto encontrado." />
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductStore } from '@/stores/product';
import type { Product } from '@/types/entity-types';
import { message } from 'ant-design-vue';

const productStore = useProductStore();

const FALLBACK_IMAGE_URL = 'https://i.imgur.com/4U63rk7.png';

const handleImageError = (product: Product) => {
    product.imageUrl = FALLBACK_IMAGE_URL;
};

const getStockBadgeClass = (currentStock: number) => {
    if (currentStock === 0) return 'stock-red';
    if (currentStock <= 10) return 'stock-orange';
    return 'stock-green';
};

defineProps({
    open: { type: Boolean, required: true },
    placement: { type: String, default: 'right' },
    drawerWidth: { type: [String, Number], default: '500px' },
});

const emit = defineEmits(['close', 'productSelected']);

const searchText = ref('');

const filteredProducts = computed(() => {
    if (!searchText.value) {
        return productStore.enrichedProducts;
    }
    const searchLower = searchText.value.toLowerCase();
    return productStore.enrichedProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.categoryName.toLowerCase().includes(searchLower)
    );
});

const handleProductSelect = (product: Product) => {
    if (product.currentStock <= 0) {
        message.error(`Produto ${product.name} esgotado.`);
        return;
    }
    emit('productSelected', product);
};
</script>

<style scoped>
.products-grid-drawer {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    padding: 5px;
}

.product-card-drawer {
    /* Adiciona posicionamento relativo para o badge flutuar */
    position: relative; 
    cursor: pointer;
    border: 1px solid #f0f0f0;
    transition: box-shadow 0.2s;
    height: 180px; 
}

.product-stock-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 5;
    padding: 3px 8px;
    font-size: 0.75em;
    font-weight: bold;
    color: white;
    border-radius: 4px;
    white-space: nowrap;
}

.stock-green { background-color: #52c41a; } /* Antdv Green */
.stock-orange { background-color: #fa8c16; } /* Antdv Orange */
.stock-red { background-color: #f5222d; } /* Antdv Red */


.product-card-drawer:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card-drawer :deep(.ant-card-cover) {
    height: 80px;
    overflow: hidden;
}

.product-details {
    margin-top: 5px;
}

.out-of-stock-card {
    opacity: 0.6;
    pointer-events: none;
    border-color: #f00;
}

.product-image {
    height: 80px;
    width: 100%; 
    /* ⚠️ CORREÇÃO AQUI: object-fit: contain; vai garantir que a imagem inteira seja visível (sem crop),
       mantendo a proporção. Se você quer que ela preencha o espaço (com crop), use 'cover'. */
    object-fit: contain; 
    display: block; 
}
</style>