import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { HistoricoMensal, TopProdutosVendas } from '@/types/entity-types';
import { biService } from '@/services/BIService';

export const useBistore = defineStore('bi', () => {
    const historicoMensal = ref<HistoricoMensal[]>([]);
    const topMaisVendidos = ref<TopProdutosVendas[]>([]);
    const carregando = ref(false);

    async function loadRestaurantBI(restId: string) {
        carregando.value = true;
        
        try {
            const data = await biService.getRestaurantDashboard(restId);

            historicoMensal.value = data.revenueHistory || [];
            topMaisVendidos.value = data.topSellers || [];

        } catch (e) {
            console.log("Erro ao carregar o BI:", e);
        } finally {
            carregando.value = false;
        }
    }

    return { historicoMensal, topMaisVendidos, carregando, loadRestaurantBI };
});