import { defineStore } from 'pinia';
import { salesService } from '@/services/SalesService';
import { useProductStore } from './product';
import type { Sale } from '@/types/entity-types';
import { ref } from 'vue';

export const useSaleStore = defineStore('sale', () => {
  const lastSale = ref<Sale | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function registerSale(userId: string, items: { productId: number; quantity: number }[]) {
    isLoading.value = true;
    error.value = null;

    try {
      const newSale = await salesService.registerNewSale({ userId, items });
      lastSale.value = newSale;

      const productStore = useProductStore();

      await productStore.loadAllData(true);

      return newSale;

    } catch (e: unknown) {
      error.value = (e as Error).message || 'Erro desconhecido ao registrar a venda.';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    lastSale,
    isLoading,
    error,
    registerSale
  };
});