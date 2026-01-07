<template>
    <div class="restaurantes-container">
        <a-page-header title="Painel de Controle Global" />

        <a-card title="Restaurantes Ativos" :loading="restaurantStore.isLoading">
            <a-list item-layout="horizontal" :data-source="restaurantStore.restaurants" class="restaurant-list">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta :title="item.name" :description="`CNPJ: ${item.cnpj}`" @click="goToBIView(item.id)" class="restaurant-item">
                            <template #avatar>
                                <a-avatar :src="item.profileImageUrl" size="large" />
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
            <a-empty v-if="restaurantStore.restaurants.length === 0 && !restaurantStore.isLoading"
                description="Nenhum restaurante cadastrado." />
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRestaurantStore } from '@/stores/restaurant';
import { useRouter } from 'vue-router';

const router = useRouter();
const restaurantStore = useRestaurantStore();

const goToBIView = (restId: string) => {
    router.push({ name: 'RestaurantBI', params: { restId } });
};

onMounted(() => {
    restaurantStore.loadRestaurants();
});
</script>

<style scoped>
.restaurantes-container :deep(.ant-page-header) {
    padding-left: 0;
}

.restaurantes-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.restaurantes-container {
    padding: 20px;
}

.restaurant-item {
    cursor: pointer;
}

.restaurant-item :deep(.ant-list-item-meta-title) {
    color: #1890ff;
}

.restaurant-item :deep(.ant-list-item-meta-title):hover {
    text-decoration: underline;
}

.restaurant-list :deep(.ant-list-item):hover {
    background-color: #f5f5f5;
}
</style>