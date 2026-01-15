import api from './ApiService';

class ReportService {
    // Busca o relatório detalhado de vendas do restaurante logado
    async getFullReport(pagina: number, limite: number) {
        const { data } = await api.get(`/relatorios`, {
            params: {
                pagina,
                limite
            }
        });
        return data;
    }

    // Busca apenas as métricas resumidas para os cards do topo
    async getSummary() {
        const { data } = await api.get('/relatorios/resumo');
        return data;
    }
}

export const reportService = new ReportService();