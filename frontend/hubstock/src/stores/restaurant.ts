import { defineStore } from 'pinia';
import { restaurantService } from '@/services/RestaurantService';
import type { Restaurant } from '@/api/mockData';
import { ref } from 'vue';

export const useRestaurantStore = defineStore('restaurant', () => {
    const restaurants = ref<Restaurant[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function loadRestaurants(force = false) {
        if (restaurants.value.length > 0 && !force) return;

        isLoading.value = true;
        error.value = null;
        try {
            restaurants.value = await restaurantService.getAllRestaurants();
        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : String(e);
            error.value = 'Falha ao carregar a lista de restaurantes.' + (errMsg ? ` Detalhes: ${errMsg}` : '');
            console.error(errMsg || error.value);
        } finally {
            isLoading.value = false;
        }
    }

    async function addRestaurant(data: Omit<Restaurant, 'id'>) {
        try {
            const newRestaurant = await restaurantService.createRestaurant(data);
            restaurants.value.push(newRestaurant);
            console.log(`Restaurante ${newRestaurant.name} criado com sucesso!`);
        } catch (e: unknown) {
            const errMsg = e instanceof Error ? e.message : String(e);
            console.error(errMsg || 'Falha ao criar restaurante.');
            throw e;
        }
    }

    return {
        restaurants,
        isLoading,
        error,
        loadRestaurants,
        addRestaurant,
    };

});