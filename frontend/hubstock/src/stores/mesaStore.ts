import { defineStore } from 'pinia';
import { ref } from 'vue';
import { mesaService } from '@/services/MesaService';
import type { Mesa } from '@/types/entity-types';

export const useMesaStore = defineStore('mesa', () => {
  const mesas = ref<Mesa[]>([]);
  const isLoading = ref(false);

  async function loadMesas() {
    isLoading.value = true;

    try {
      const loadedMesas = await mesaService.getAllMesas();
      mesas.value = loadedMesas;
    } catch (e: any) {
      console.log("Erro ao carregar mesas:", e);
    } finally {
      isLoading.value = false;
    }
  }

  function reset() {
    mesas.value = [];
    isLoading.value = false;
  }

  return {
    mesas,
    isLoading,
    loadMesas,
    reset
  };
});