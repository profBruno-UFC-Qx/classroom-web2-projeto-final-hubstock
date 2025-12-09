<template>
    <div class="pedido-detail-container">
        <a-page-header :title="`Pedido da Mesa ${mesaId}`" @back="() => $router.push({ name: 'MesaSelection' })">
            <template #extra>
                <a-button type="primary" danger @click="handleFinalizeSale()" class="finalize-desktop-btn">
                    Finalizar Venda
                </a-button>
            </template>
        </a-page-header>

        <a-layout class="pedido-layout">

            <a-layout-content class="pedido-content">
                <div v-if="!currentMesa" class="error-message">
                    Mesa {{ mesaId }} não encontrada.
                </div>
                <div v-else>
                    <a-button type="primary" size="large" style="margin-bottom: 20px;" @click="drawerVisible = true">
                        <template #icon><shop-outlined /></template>
                        Lançar Pedido
                    </a-button>

                    <h3 class="list-title">Itens do Pedido</h3>

                    <a-list item-layout="horizontal" :data-source="currentMesa.items">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta :title="`${item.name}`"> <template #description>R$ {{
                                        item.price.toFixed(2) }}</template>
                                </a-list-item-meta>

                                <QuantityControl :item="item" @update-quantity="updateItemQuantity"
                                    @remove-item="removeItemFromMesaById" />

                                <div class="item-total-price">
                                    R$ {{ (item.price * item.quantity).toFixed(2) }}
                                </div>

                                <template #actions>
                                </template>
                            </a-list-item>
                        </template>
                    </a-list>

                    <a-statistic title="Total da Mesa" :value="mesaTotal" prefix="R$" class="mesa-statistic" />

                    <a-button type="primary" block size="large" class="finalize-mobile-btn"
                        @click="handleFinalizeSale()">
                        Finalizar Venda (R$ {{ mesaTotal.toFixed(2) }})
                    </a-button>
                </div>
            </a-layout-content>
        </a-layout>

        <div class="pedido-detail-container">
            <ProductDrawer :open="drawerVisible" :drawer-width="drawerWidth" @close="drawerVisible = false"
                @product-selected="addProductToMesa" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import { useSaleStore } from '@/stores/sale';
import { message } from 'ant-design-vue';
import { ShopOutlined } from '@ant-design/icons-vue';
import type { Product } from '@/types/entity-types';
import { mesas } from '@/types/venda';
import ProductDrawer from '@/components/ProductDrawer.vue';
import QuantityControl from '@/components/QuantityControl.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const productStore = useProductStore();
const saleStore = useSaleStore();

const mesaId = computed(() => Number.parseInt(route.params.mesaId as string));

const drawerVisible = ref(false);
const drawerWidth = computed(() => window.innerWidth > 1000 ? 500 : '100%');

const updateItemQuantity = (productId: number, newQuantity: number) => {
    if (!currentMesa.value) return;
    
    const item = currentMesa.value.items.find(i => i.productId === productId);
    if (!item) return;
    
    const product = productStore.products.find(p => p.id === productId);
    if (product && newQuantity > product.currentStock) {
        message.warning(`Estoque máximo atingido para ${item.name}!`);
        return; 
    }

    item.quantity = newQuantity;
};

const currentMesa = computed(() => {
    return mesas.value.find(m => m.id === mesaId.value);
});

const mesaTotal = computed(() => {
    return currentMesa.value?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
});

const addProductToMesa = (product: Product) => {
    if (!currentMesa.value) return;
    
    const existingItem = currentMesa.value.items.find(i => i.productId === product.id);

    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (newQuantity > product.currentStock) {
        message.warning(`Estoque insuficiente! Disponível: ${product.currentStock}.`);
        return; 
    }

    if (existingItem) {
        existingItem.quantity = newQuantity;
    } else {
        currentMesa.value.items.push({
            id: Date.now(), 
            name: product.name,
            price: product.salePrice,
            productId: product.id,
            quantity: 1,
        });
    }
    message.success(`${product.name} adicionado à Mesa ${mesaId.value}.`);
};

const removeItemFromMesaById = (productId: number) => {
    if (!currentMesa.value) return;
    
    currentMesa.value.items = currentMesa.value.items.filter(i => i.productId !== productId);
    message.info('Item removido do pedido.');
};

const handleFinalizeSale = async () => {
    if (!currentMesa.value || currentMesa.value.items.length === 0) {
        message.error("A mesa não possui itens para finalizar a venda.");
        return;
    }

    const itemsToRegister = currentMesa.value.items.map(item => ({ productId: item.productId, quantity: item.quantity }));
    const userId = authStore.userId;
    if (!userId) {
        message.error("Usuário não autenticado. Faça login para registrar vendas.");
        return;
    }

    try {
        await saleStore.registerSale(userId, itemsToRegister);
        message.success(`Venda da Mesa ${mesaId.value} finalizada!`);

        currentMesa.value.items = [];

    } catch (e: unknown) {
        if (e instanceof Error) {
            message.error(`Falha ao registrar a venda: ${e.message}`);
        } else {
            message.error(`Falha ao registrar a venda: ${String(e)}`);
        }
    }
};

onMounted(() => {
    if (!mesaId.value) {
        router.push({ name: 'MesaSelection' });
    }
    productStore.loadAllData();
});
</script>

<style scoped>
.pedido-detail-container {
    padding: 10px 20px;
}

.pedido-layout {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pedido-content {
    padding: 20px;
}

.ant-list-item :deep(.ant-list-item-meta-title) {
    font-weight: bold;
}
.ant-list-item :deep(.ant-list-item-meta-description) {
    color: #42b983;
}

.item-total-price {
    margin-left: auto; 
    padding-left: 10px;
    font-size: 1.1em;
}

.list-title {
    margin-top: 15px;
    font-size: 1.2em;
    font-weight: bold;
}

.item-total-price {
    font-weight: bold;
}

.mesa-statistic {
    margin-top: 20px;
    text-align: end;
    font-weight: bolder;
    color: green;
}

.error-message {
    padding: 20px;
    color: red;
}

.finalize-mobile-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0;
    z-index: 10;
    padding: 15px;
    height: auto;
    font-size: 1.1em;
    display: none;
}

.finalize-desktop-btn {
    display: inline-block;
}

@media (max-width: 767px) {
    .finalize-mobile-btn {
        display: block;
    }

    .finalize-desktop-btn {
        display: none !important;
    }

    .ant-page-header-extra button:first-child {
        display: none;
    }

    .ant-statistic {
        margin-bottom: 70px;
    }
}
</style>