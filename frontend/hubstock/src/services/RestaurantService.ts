import { MOCKED_RESTAURANTS } from '@/api/mockData';
import type { Restaurant } from '@/types/entity-types';

const DELAY_MS = 500;
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RestaurantService {

    // Busca todos os restaurantes.
    public async getAllRestaurants(): Promise<Restaurant[]> {
        await mockDelay(DELAY_MS);
        return structuredClone(MOCKED_RESTAURANTS);
    }

    // Criar novo restaurante.
    public async createRestaurant(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
        await mockDelay(DELAY_MS);
        
        const newId = `rest-uuid-${MOCKED_RESTAURANTS.length + 1}`;
        
        const newRestaurant: Restaurant = {
            ...data,
            id: newId,
        };

        MOCKED_RESTAURANTS.push(newRestaurant);
        return newRestaurant;
    }
}

export const restaurantService = new RestaurantService();