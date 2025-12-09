<template>
    <div class="restaurantes-container">
        <a-page-header title="Painel de Controle Global" />

        <a-card title="Restaurantes Ativos" :loading="restaurantStore.isLoading">
            <a-list item-layout="horizontal" :data-source="restaurantStore.restaurants">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta :title="item.name" :description="`CNPJ: ${item.cnpj}`">
                            <template #avatar>
                                <a-avatar :src="item.profileImageUrl" size="large" />
                            </template>
                        </a-list-item-meta>

                        <div>
                            <a-button type="link" style="margin-right: 10px;"
                                @click="goToBIView(item.id)">Detalhes</a-button>
                        </div>
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
.restaurantes-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.restaurantes-container {
    padding: 20px;
}

@media (max-width: 600px) {
    .restaurantes-container :deep(.ant-list-item-meta) {
        flex-direction: column;
        align-items: flex-start;
    }

    .restaurantes-container :deep(.ant-list-item-meta-avatar) {
        margin-right: 0;
        margin-bottom: 10px;
    }

    .restaurantes-container :deep(.ant-list-item-meta-content) {
        width: 100%;
        min-width: 0;
    }

    .restaurantes-container :deep(.ant-list-item) {
        flex-direction: column;
        align-items: flex-start;
        padding-bottom: 15px;
    }

    .list-actions {
        margin-top: 15px;
    }
}
</style>