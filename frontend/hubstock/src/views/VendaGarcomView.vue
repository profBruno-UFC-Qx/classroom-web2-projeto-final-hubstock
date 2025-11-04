<template>
    <div class="venda-container">
        <a-page-header title="Terminal de Vendas Rápido" />

        <a-layout class="venda-layout">

            <a-layout-sider width="250" class="mesas-sider">
                <h3 class="sider-title">Mesa/Comanda</h3>
                <div class="mesas-grid">
                    <a-card v-for="mesa in mesas" :key="mesa.id" hoverable
                        :class="['mesa-card', { 'mesa-active': mesa.id === selectedMesaId }]"
                        @click="selectMesa(mesa.id)">
                        <a-badge :count="mesa.items.length" :offset="[20, -5]" :dot="mesa.items.length > 0">
                            <template #title>Itens no Pedido</template>
                            <div class="mesa-number">Mesa {{ mesa.id }}</div>
                        </a-badge>
                    </a-card>
                </div>

                <a-button type="primary" block class="finalize-btn" @click="finalizeMesaSale" :disabled="!selectedMesa">
                    Finalizar Venda (Mesa {{ selectedMesaId || '?' }})
                </a-button>
            </a-layout-sider>

            <a-layout-content class="venda-content">
                <div v-if="!selectedMesa" class="no-mesa-selected">
                    Selecione uma mesa ou comanda para iniciar a venda.
                </div>
                <div v-else>
                    <a-button type="primary" size="large" style="margin-bottom: 20px;" @click="drawerVisible = true">
                        <template #icon><shop-outlined /></template>
                        Lançar Pedido
                    </a-button>

                    <h3 class="pedido-title">Pedido da Mesa {{ selectedMesaId }}</h3>

                    <a-list item-layout="horizontal" :data-source="selectedMesa.items">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta :title="`${item.name} (R$ ${item.price.toFixed(2)})`">
                                    <template #description>Qtd: {{ item.quantity }}</template>
                                </a-list-item-meta>
                                <div class="item-total">
                                    R$ {{ (item.price * item.quantity).toFixed(2) }}
                                </div>
                                <template #actions>
                                    <a-button size="small" @click="removeItemFromMesa(item)">-</a-button>
                                </template>
                            </a-list-item>
                        </template>
                    </a-list>

                    <a-statistic title="Total da Mesa" :value="mesaTotal" prefix="R$" class="mesa-statistic" />
                </div>
            </a-layout-content>
        </a-layout>

        <a-drawer title="Selecione os Produtos" :placement="drawerPlacement" :width="drawerWidth" :open="drawerVisible"
            @close="drawerVisible = false">
            <a-input-search v-model:value="searchText" placeholder="Buscar produtos..." style="margin-bottom: 20px;"
                enter-button />

            <div class="products-grid">
                <a-card v-for="product in filteredProducts" :key="product.id" hoverable class="product-card"
                    :class="{ 'low-stock-card': product.isLowStock && product.currentStock > 0, 'out-of-stock-card': product.currentStock === 0 }"
                    @click="addProductToMesa(product)">
                    <a-badge-ribbon :text="product.currentStock > 0 ? `Estoque: ${product.currentStock}` : 'ESGOTADO'"
                        :color="product.currentStock > 10 ? 'green' : product.currentStock > 0 ? 'orange' : 'red'">
                        <a-card-meta :title="product.name">
                            <template #description>
                                <div class="product-details">
                                    <span class="price">R$ {{ product.salePrice.toFixed(2) }}</span>
                                    <span>| {{ product.categoryName }}</span>
                                </div>
                            </template>
                        </a-card-meta>
                        <template #cover>
                            <img alt="product image" src="https://via.placeholder.com/150x80/D9D9D9/888888?text=Item"
                                style="height: 80px;" />
                        </template>
                    </a-badge-ribbon>
                </a-card>
                <a-empty v-if="filteredProducts.length === 0"
                    description="Nenhum produto encontrado. Verifique o estoque." />
            </div>

        </a-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import { useSaleStore } from '@/stores/sale';
import { message } from 'ant-design-vue';
import type { Product } from '@/types/entity-types';

const authStore = useAuthStore();
const productStore = useProductStore();
const saleStore = useSaleStore();

const drawerVisible = ref(false);
const drawerPlacement = ref('right'); // Padrão do Ant Design
const drawerWidth = ref(window.innerWidth > 1000 ? 500 : '100%'); // Responsividade
const searchText = ref('');

// --- MOCK DE MESAS (simulação de estado de mesas) ---
interface MesaItem {
    id: number;
    name: string;
    price: number;
    productId: number;
    quantity: number;
}
interface Mesa {
    id: number;
    items: MesaItem[];
}

// Simulação de 5 mesas
const mesas = ref<Mesa[]>([
    { id: 1, items: [] },
    { id: 2, items: [] },
    { id: 3, items: [] },
    { id: 4, items: [{ id: 1001, name: 'Cerveja Pilsen', price: 6.00, productId: 1001, quantity: 2 }] },
    { id: 5, items: [] },
]);

const selectedMesaId = ref<number | null>(null);

const selectedMesa = computed(() => {
    return mesas.value.find(m => m.id === selectedMesaId.value);
});

const mesaTotal = computed(() => {
    return selectedMesa.value?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
});

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

const selectMesa = (id: number) => {
    selectedMesaId.value = id;
};

const addProductToMesa = (product: Product) => {
    if (!selectedMesa.value) return;

    const existingItem = selectedMesa.value.items.find(i => i.productId === product.id);

    // Simples validação de estoque antes de adicionar
    const totalOrdered = (existingItem ? existingItem.quantity : 0) + 1;
    if (totalOrdered > product.currentStock) {
        message.warning(`Estoque insuficiente! Disponível: ${product.currentStock}`);
        return;
    }

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        selectedMesa.value.items.push({
            id: Date.now(), // ID único temporário
            name: product.name,
            price: product.salePrice,
            productId: product.id,
            quantity: 1,
        });
    }
    message.success(`${product.name} adicionado à Mesa ${selectedMesaId.value}.`);
};

const removeItemFromMesa = (itemToRemove: MesaItem) => {
    if (!selectedMesa.value) return;

    if (itemToRemove.quantity > 1) {
        itemToRemove.quantity -= 1;
    } else {
        selectedMesa.value.items = selectedMesa.value.items.filter(i => i.id !== itemToRemove.id);
    }
    message.info(`Item removido da Mesa ${selectedMesaId.value}.`);
};

const finalizeMesaSale = async () => {
    if (!selectedMesa.value || selectedMesa.value.items.length === 0) {
        message.error("A mesa não possui itens para finalizar a venda.");
        return;
    }

    // Mapeia os itens da mesa para o formato esperado pelo SaleStore
    const itemsToRegister = selectedMesa.value.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
    }));

    // O Garçom logado é o responsável pela venda
    const userId = authStore.userId;
    if (!userId) {
        message.error("Usuário não autenticado. Faça login para registrar vendas.");
        return;
    }

    try {
        await saleStore.registerSale(userId, itemsToRegister);

        message.success(`Venda da Mesa ${selectedMesaId.value} finalizada! Total: R$ ${mesaTotal.value.toFixed(2)}`);

        // Limpa a mesa após a venda (simula o fechamento da comanda)
        selectedMesa.value.items = [];

    } catch (e: unknown) {
        if (e instanceof Error) {
            message.error(`Falha ao registrar a venda: ${e.message}`);
        } else {
            message.error(`Falha ao registrar a venda: ${String(e)}`);
        }
    }
};

// --- Carregamento Inicial ---
onMounted(() => {
    productStore.loadAllData();
});
</script>

<style scoped>
.venda-container {
    height: 100%;
    background: #fff;
    padding: 10px;
    /* Padding interno da View */
}

/* 2. Padding para separar dos lados (Menu e Tela) */
.venda-layout {
    min-height: calc(100vh - 120px);
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    margin: 10px 0;
    /* Separa do Page Header */
}

/* Mesas Sider */
.mesas-sider {
    background: #fff !important;
    padding: 15px !important;
    border-right: 1px solid #f0f0f0;
}

.sider-title {
    margin-bottom: 15px;
    font-size: 1.1em;
    font-weight: bold;
}

.mesas-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.mesa-card {
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    height: 100px;
    /* Altura fixa para uniformidade */
}

.mesa-active {
    border: 2px solid #1890ff;
    background-color: #e6f7ff;
}

.mesa-number {
    font-size: 1.3em;
    font-weight: bold;
    padding: 5px 0;
}

.finalize-btn {
    margin-top: 20px;
    font-size: 1.1em;
    height: 45px;
}


/* Área de Conteúdo da Venda (Principal) */
.venda-content {
    padding: 20px !important;
    /* NOVO: Padding interno para descolar do sider de Mesas */
}

.pedido-title {
    margin-top: 20px;
    font-size: 1.2em;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
}

.item-total {
    font-weight: bold;
    color: #001f3f;
}

.mesa-statistic {
    margin-top: 20px;
    text-align: right;
    font-size: 1.5em;
}

/* Produtos (Dentro do Drawer) */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
}

.product-card {
    cursor: pointer;
    transition: box-shadow 0.3s;
}

.product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card :deep(.ant-card-body) {
    padding: 10px;
}

.product-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: #666;
}

.price {
    font-weight: bold;
    color: #42b983;
}

.out-of-stock-card {
    opacity: 0.5;
    pointer-events: none;
    /* Não permite clique se estiver esgotado */
}

.low-stock-card {
    border: 1px solid orange;
}
</style>