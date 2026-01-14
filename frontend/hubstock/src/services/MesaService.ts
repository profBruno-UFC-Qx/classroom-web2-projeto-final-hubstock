import type { Mesa } from '@/types/entity-types';
import api from './ApiService';

class MesaService {
    /**
     * Busca todas as mesas do restaurante logado
     */
    public async getAllMesas(): Promise<Mesa[]> {
        const { data } = await api.get<Mesa[]>('/mesas');
        return data;
    }

    /**
     * Busca o pedido ativo de uma mesa específica
     */
    async getPedidoAtivo(mesaId: string) {
        const { data } = await api.get(`/mesas/${mesaId}/pedido-ativo`);
        return data;
    }
}

export const mesaService = new MesaService();