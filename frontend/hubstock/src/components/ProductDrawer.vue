<template>
    <a-drawer title="Lançar Produtos" :placement="placement" :width="drawerWidth" :open="open" @close="$emit('close')">

        <a-input-search v-model:value="termoBusca" placeholder="Pesquisar produto..." style="margin-bottom: 16px"
            :loading="productStore.isLoading" @search="onSearch" @input="onInput" />

        <div class="drawer-content">
            <div v-for="(products, category) in groupedProducts" :key="category" class="category-section">
                <a-divider orientation="left" class="category-divider">
                    <span class="category-title">{{ category }}</span>
                </a-divider>

                <div class="products-grid-drawer">
                    <a-card v-for="product in products" :key="product.id" hoverable class="product-card-drawer"
                        :class="{ 'out-of-stock-card': product.estoqueAtual === 0 }"
                        @click="handleProductSelect(product)">

                        <div class="product-stock-badge" :class="getStockBadgeClass(product.estoqueAtual)">
                            {{ product.estoqueAtual > 0 ? `Estoque: ${product.estoqueAtual}` : 'ESGOTADO' }}
                        </div>

                        <template #cover>
                            <img alt="product" :src="product.urlImagemProduto || FALLBACK_IMAGE_URL"
                                class="product-image" @error="handleImageError(product)" />
                        </template>

                        <a-card-meta :title="product.nomeProduto">
                            <template #description>
                                <div class="product-details">
                                    <span class="price">R$ {{ Number(product.precoVendaProduto).toFixed(2) }}</span>
                                </div>
                            </template>
                        </a-card-meta>
                    </a-card>
                </div>
            </div>

            <a-empty v-if="Object.keys(groupedProducts).length === 0" description="Nenhum produto encontrado." />
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductStore } from '@/stores/productStore';
import type { Produto } from '@/types/entity-types';
import { message } from 'ant-design-vue';

const productStore = useProductStore();
const FALLBACK_IMAGE_URL = 'https://i.imgur.com/4U63rk7.png';

const termoBusca = ref('');
let debounceTimer: any = null;

defineProps({
    open: { type: Boolean, required: true },
    placement: { type: String, default: 'right' },
    drawerWidth: { type: [String, Number], default: "500px" },
});

const emit = defineEmits(['close', 'productSelected']);

const handleImageError = (product: Produto) => {
    product.urlImagemProduto = FALLBACK_IMAGE_URL;
};

const getStockBadgeClass = (estoque: number) => {
    if (estoque === 0) return 'stock-red';
    if (estoque <= 10) return 'stock-orange';
    return 'stock-green';
};

// Agrupa os produtos por categoria
const groupedProducts = computed(() => {
    const groups: Record<string, Produto[]> = {};

    productStore.produtos.forEach(product => {
        const cat = product.categoriaProduto || 'OUTROS';
        if (!groups[cat]) {
            groups[cat] = [];
        }
        groups[cat].push(product);
    });

    return groups;
});

const handleProductSelect = (product: Produto) => {
    if (product.estoqueAtual <= 0) {
        message.error(`Produto ${product.nomeProduto} esgotado.`);
        return;
    }
    emit('productSelected', product);
};

const onSearch = () => {
    productStore.loadProduct(termoBusca.value);
};

// Debounce de 500ms ao digitar
const onInput = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        productStore.loadProduct(termoBusca.value);
    }, 500);
};
</script>

<style scoped>
.category-section {
    margin-bottom: 24px;
}

.category-title {
    font-size: 1.1em;
    font-weight: bold;
    color: #595959;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.category-divider {
    margin: 12px 0;
}

.products-grid-drawer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
}

.drawer-content {
    padding-bottom: 50px;
}

.product-card-drawer {
    position: relative;
    cursor: pointer;
    border: 1px solid #f0f0f0;
    transition: all 0.3s;
}

.product-card-drawer:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-stock-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 5;
    padding: 2px 6px;
    font-size: 0.7em;
    font-weight: bold;
    color: white;
    border-radius: 4px;
}

.stock-green {
    background-color: #52c41a;
}

.stock-orange {
    background-color: #fa8c16;
}

.stock-red {
    background-color: #f5222d;
}

.product-image {
    height: 100px;
    width: 100%;
    object-fit: contain;
    background-color: #fafafa;
    padding: 5px;
}

.out-of-stock-card {
    opacity: 0.5;
    filter: grayscale(1);
    cursor: not-allowed;
}

.price {
    font-weight: bold;
    color: #1890ff;
}

@media (max-width: 576px) {
    .product-image {
        height: 80px;
    }

    .category-title {
        font-size: 0.9em;
    }

    .product-card-drawer {
        height: auto;
    }
}
</style>