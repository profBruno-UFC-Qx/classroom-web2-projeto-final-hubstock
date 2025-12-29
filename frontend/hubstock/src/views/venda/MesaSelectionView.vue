<template>
    <div class="selection-container">
        <a-page-header title="Seleção de Mesa" />

        <div class="mesas-grid-large">
            <a-card v-for="mesa in mesas" :key="mesa.id" hoverable
                :class="['mesa-card', { 'mesa-active': mesa.id === selectedMesaId }]" @click="selectMesa(mesa.id)">
                <a-badge :count="mesa.items.length" :offset="[20, -5]" :dot="mesa.items.length > 0">
                    <template #title>Itens no Pedido</template>
                    <div class="mesa-number">Mesa {{ mesa.id }}</div>
                </a-badge>
            </a-card>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { mesas } from '@/types/venda';

const router = useRouter();
const productStore = useProductStore();

const selectedMesaId = ref<number | null>(null);

const selectMesa = (id: number) => {
    router.push({ name: 'PedidoDetail', params: { mesaId: id } });
};

onMounted(() => {
    productStore.loadAllData(); // Carrega os dados na primeira view
});
</script>

<style scoped>
.selection-container :deep(.ant-page-header) {
    padding-left: 0;
}

.selection-container {
    padding: 20px;
    text-align: center;
}

.mesas-grid-large {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    max-width: 900px;
    margin: 30px auto;
}

.mesa-card {
    cursor: pointer;
    text-align: center;
    border: 1px solid #e0e0e0;
    height: 120px;
    padding: 10px;
    transition: all 0.3s;
}

.mesa-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mesa-active {
    border-color: #1890ff;
    background-color: #e6f7ff;
}

.mesa-number {
    font-size: 1.8em;
    font-weight: bold;
}
</style>