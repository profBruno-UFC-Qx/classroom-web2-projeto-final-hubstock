import type { BIResponse, HistoricoMensal, TopProdutosVendas } from '@/types/entity-types';
import api from './ApiService';

class BIService {
    /**
     * Busca todos os dados de BI de um restaurante
     */
    public async getRestaurantDashboard(restId: string): Promise<BIResponse> {
        const { data } = await api.get<BIResponse>(`/relatorios/restaurante/${restId}`);
        return data;
    }

    /**
     * Busca o histórico mensal de receita de um restaurante
     */
    public async getRevenueHistory(restId: string): Promise<HistoricoMensal[]> {
        const { data } = await api.get<BIResponse>(`/relatorios/restaurante/${restId}`);
        return data.revenueHistory;
    }

    /**
     * Busca os 10 produtos mais vendidos de um restaurante
     */
    public async getTopSellingProducts(restId: string): Promise<TopProdutosVendas[]> {
        const { data } = await api.get<BIResponse>(`/relatorios/restaurante/${restId}`);
        return data.topSellers;
    }
}

export const biService = new BIService();