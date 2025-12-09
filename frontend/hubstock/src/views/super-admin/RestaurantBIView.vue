<template>
  <div class="bi-container">
    <a-page-header 
        :title="restaurantName" 
        @back="() => $router.back()"
    />

    <a-alert v-if="biStore.error" :message="biStore.error" type="error" show-icon style="margin-bottom: 25px;" />

    <a-spin :spinning="biStore.isLoading">
        
        <a-card title="Faturamento e Lucro Histórico" style="margin-bottom: 30px;">
            <a-table 
                :columns="revenueColumns" 
                :data-source="biStore.revenueHistory" 
                row-key="month"
                size="small"
                :pagination="false"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'value'">
                        <span :style="{ color: record.profit > 0 ? '#52c41a' : '#f5222d' }">
                            R$ {{ record.revenue.toFixed(2) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'profit'">
                         <a-tag :color="record.profit > 0 ? 'success' : 'error'">
                            R$ {{ record.profit.toFixed(2) }}
                        </a-tag>
                    </template>
                </template>
            </a-table>
        </a-card>

        <a-card title="Top 10 Produtos Mais Vendidos" style="margin-bottom: 30px;">
             <a-table 
                :columns="topSellersColumns" 
                :data-source="biStore.topSellers" 
                row-key="productId"
                size="small"
                :pagination="false"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'totalRevenue'">
                        R$ {{ record.totalRevenue.toFixed(2) }}
                    </template>
                </template>
             </a-table>
        </a-card>
        
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBistore } from '@/stores/bi';
import { useRestaurantStore } from '@/stores/restaurant';

const route = useRoute();
const biStore = useBistore();
const restaurantStore = useRestaurantStore();
const restId = route.params.restId as string;

const restaurantName = ref(`Carregando nome... (${restId})`);

type TopSeller = { productId: string; productName: string; totalQuantity: number; totalRevenue: number };

// Colunas para Faturamento
const revenueColumns = [
    { title: 'Período', dataIndex: 'month', key: 'month', width: 150 },
    { title: 'Receita Bruta', dataIndex: 'revenue', key: 'value', width: 150 },
    { title: 'Lucro Líquido', dataIndex: 'profit', key: 'profit', width: 150 },
];

// Colunas para Produtos Mais Vendidos
const topSellersColumns = [
    { title: 'Produto', dataIndex: 'productName', key: 'productName' },
    { title: 'Qtd. Total Vendida', dataIndex: 'totalQuantity', key: 'totalQuantity', width: 150, sorter: (a: TopSeller, b: TopSeller) => b.totalQuantity - a.totalQuantity },
    { title: 'Faturamento Total', dataIndex: 'totalRevenue', key: 'totalRevenue', width: 150 },
];

const fetchRestaurantName = async () => {
    // Garante que a lista de restaurantes esteja carregada
    await restaurantStore.loadRestaurants(); 
    
    const restaurant = restaurantStore.restaurants.find(r => r.id === restId);
    
    if (restaurant) {
        restaurantName.value = restaurant.name;
    } else {
        restaurantName.value = `Restaurante (ID: ${restId}) não encontrado`;
    }
};

onMounted(() => {
    biStore.loadRestaurantBI(restId);
    
    fetchRestaurantName();
});
</script>

<style scoped>
.bi-container {
    padding: 20px;
}
.bi-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>