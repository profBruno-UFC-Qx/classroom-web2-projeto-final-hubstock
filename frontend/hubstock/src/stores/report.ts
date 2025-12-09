import { defineStore } from 'pinia';
import { reportService, type SaleReport } from '@/services/ReportService';
import { ref } from 'vue';

interface SummaryMetrics {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    totalSalesCount: number;
}

export const useReportStore = defineStore('report', () => {
    const salesReport = ref<SaleReport[]>([]);
    const summaryMetrics = ref<SummaryMetrics>({ totalRevenue: 0, totalCost: 0, totalProfit: 0, totalSalesCount: 0 });
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Carrega o relatório completo de vendas e as métricas de resumo.
    async function loadReports() {
        isLoading.value = true;
        error.value = null;

        try {
            // carrega em paralelo
            const [reports, metrics] = await Promise.all([
                reportService.getSalesReport(),
                reportService.getSummaryMetrics(),
            ]);

            salesReport.value = reports;
            summaryMetrics.value = metrics;

        } catch (e) {
            error.value = 'Falha ao carregar relatórios de vendas.';
            console.error('Erro ao carregar relatórios:', e);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        salesReport,
        summaryMetrics,
        isLoading,
        error,
        loadReports,
    };
});