import { defineStore } from 'pinia';
import { biService, type MonthlyRevenue, type TopSellingProduct } from '@/services/BIService';
import { ref } from 'vue';

export const useBistore = defineStore('bi', () => {
    const revenueHistory = ref<MonthlyRevenue[]>([]);
    const topSellers = ref<TopSellingProduct[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Carrega todos os dados de BI para um restaurante específico.
    async function loadRestaurantBI(restId: string) {
        isLoading.value = true;
        error.value = null;

        try {
            const [history, sellers] = await Promise.all([
                biService.getRevenueHistory(restId),
                biService.getTopSellingProducts(restId),
            ]);

            revenueHistory.value = history;
            topSellers.value = sellers;
            
        } catch (e: unknown) {
            const errMessage = e instanceof Error ? e.message : String(e);
            error.value = `Falha ao carregar dados de BI para o restaurante ${restId}. ${errMessage}`;
            console.error(error.value, e);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        revenueHistory,
        topSellers,
        isLoading,
        error,
        loadRestaurantBI,
    };
});