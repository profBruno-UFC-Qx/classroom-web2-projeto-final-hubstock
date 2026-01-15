import api from './ApiService';

class VendaService {

    /**
     * Adiciona um item à venda de uma mesa
     */
    async adicionarItem(mesaId: string, produtoId: string, quantidade: number) {
        return api.post('/vendas/adicionar-item', { mesaId, produtoId, quantidade });
    }

    /**
     * Remove um item da venda de uma mesa
     */
    async removerItem(mesaId: string, produtoId: string, quantidade: number) {
        return api.post('/vendas/remover-item', { mesaId, produtoId, quantidade });
    }

    /**
     * Finaliza a venda de uma mesa
     */
    async finalizarVenda(mesaId: string) {
        return api.post(`/vendas/finalizar/${mesaId}`);
    }
}

export const vendaService = new VendaService();