import api from './ApiService';
import type { PublicRegistrationPayload, Restaurante } from '@/types/entity-types';

class RestaurantService {
    /**
     * Busca todos os restaurantes cadastrados
     */
    public async getAllRestaurants(): Promise<Restaurante[]> {
        const { data } = await api.get<Restaurante[]>('/restaurantes');
        return data;
    }

    /**
     * Busca detalhes de um restaurante específico.
     */
    public async getRestaurantById(id: string): Promise<Restaurante> {
        const { data } = await api.get<Restaurante>(`/restaurantes/${id}`);
        return data;
    }

    /**
     * Cria um novo restaurante junto com o Administrador inicial
     */
    public async registrarRestaurantePublico(dados: PublicRegistrationPayload) {
        const { data } = await api.post('/public/register', dados);
        return data;
    }
}

export const restaurantService = new RestaurantService();