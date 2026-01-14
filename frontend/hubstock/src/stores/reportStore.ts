import { defineStore } from 'pinia';
import { ref } from 'vue';
import { reportService } from '@/services/ReportService';
import type { Venda } from '@/types/entity-types';

export const useReportStore = defineStore('report', () => {
    const historicoVendas = ref<Venda[]>([]);

    // vars para a paginacao
    const totalRegistros = ref(0);
    const paginaAtual = ref(1);
    const itensPorPagina = ref(10);

    // guarda as somas dos cards (total vendido, lucro, ...)
    const metricasResumo = ref({
        receitaTotal: 0,
        lucroTotal: 0,
        quantidadeVendas: 0
    });

    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Busca os dados de acordo com a página
    async function loadReports(pagina = 1) {
        isLoading.value = true;
        error.value = null;
        paginaAtual.value = pagina;

        try {
            // chama o serviço passando qual pagina a gente quer ver
            const data = await reportService.getFullReport(pagina, itensPorPagina.value);

            // preenche a lista e o total de linhas pro componente de paginação
            historicoVendas.value = data.historicoVendas || [];
            totalRegistros.value = data.totalRegistros || 0;

            // atualiza os numeros dos cards de resumo
            metricasResumo.value = {
                receitaTotal: data.resumo?.receitaTotal || 0,
                lucroTotal: data.resumo?.lucroTotal || 0,
                quantidadeVendas: data.resumo?.quantidadeVendas || 0
            };
        } catch (e: any) {
            error.value = e.response?.data?.erro || "Falha ao carregar relatórios.";
            historicoVendas.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    // limpa tudo quando o usuario sai da tela ou faz logout
    function reset() {
        historicoVendas.value = [];
        totalRegistros.value = 0;
        paginaAtual.value = 1;
        metricasResumo.value = { receitaTotal: 0, lucroTotal: 0, quantidadeVendas: 0 };
        isLoading.value = false;
        error.value = null;
    }

    return {
        historicoVendas,
        totalRegistros,
        paginaAtual,
        metricasResumo,
        isLoading,
        error,
        loadReports,
        reset
    };
});