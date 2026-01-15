<template>
    <div class="selection-container">
        <a-page-header title="Seleção de Mesa" />

        <a-spin :spinning="isLoading">
            <div class="mesas-grid-large">
                <a-card v-for="mesa in mesas" :key="mesa.id" hoverable
                    :class="['mesa-card', { 'mesa-ativa': mesa.temVendaAtiva }]" @click="selectMesa(mesa)">
                    <a-badge :count="mesa.quantidadeItens" :offset="[10, 0]" color="#fa8c16">
                        <div class="mesa-content">
                            <div class="mesa-label">MESA</div>
                            <div class="mesa-number">{{ mesa.numero }}</div>
                        </div>
                    </a-badge>
                </a-card>
            </div>
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Mesa } from '@/types/entity-types';
import { storeToRefs } from 'pinia';
import { useMesaStore } from '@/stores/mesaStore';

const router = useRouter();
const mesaStore = useMesaStore();

const { mesas, isLoading } = storeToRefs(mesaStore);

const fetchMesas = async () => {
    await mesaStore.loadMesas();
};

const selectMesa = (mesa: Mesa) => {
    router.push({
        name: 'PedidoDetail',
        params: {
            mesaId: mesa.id,
            numeroMesa: mesa.numero.toString()
        },
    });
};

onMounted(() => {
    fetchMesas();
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

.mesa-ativa {
    border-color: #1890ff;
    background-color: #e6f7ff;
}

.mesa-label {
    font-size: 0.8em;
    color: #8c8c8c;
}

.mesa-number {
    font-size: 1.8em;
    font-weight: bold;
}

.mesa-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>