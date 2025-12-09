<template>
    <div class="relatorios-container">
        <a-page-header title="Resumo de Vendas e Lucros" />

        <a-alert v-if="reportStore.error" :message="reportStore.error" type="error" show-icon
            style="margin-bottom: 25px;" />

        <a-row :gutter="16" style="margin-bottom: 30px;">
            <a-col :span="8" :xs="24" :sm="12" :lg="8">
                <a-card>
                    <a-statistic title="Receita Total (R$)" :value="reportStore.summaryMetrics.totalRevenue"
                        :precision="2" prefix="R$" value-style="color: #3f8600" />
                </a-card>
            </a-col>
            <a-col :span="8" :xs="24" :sm="12" :lg="8">
                <a-card>
                    <a-statistic title="Lucro Total (R$)" :value="reportStore.summaryMetrics.totalProfit" :precision="2"
                        prefix="R$"
                        :value-style="{ color: reportStore.summaryMetrics.totalProfit > 0 ? '#3f8600' : '#cf1322' }" />
                </a-card>
            </a-col>
            <a-col :span="8" :xs="24" :sm="24" :lg="8">
                <a-card>
                    <a-statistic title="Vendas Registradas" :value="reportStore.summaryMetrics.totalSalesCount"
                        suffix="vendas" />
                </a-card>
            </a-col>
        </a-row>

        <a-card title="Histórico Detalhado de Vendas" :loading="reportStore.isLoading">
            <a-table :columns="columns" :data-source="reportStore.salesReport" row-key="id"
                :pagination="{ pageSize: 10 }" :scroll="{ x: 800 }">
                <template #expandedRowRender="{ record }">
                    <a-list item-layout="horizontal" :data-source="record.items"
                        :header="`Itens da Venda #${record.id}`">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta :title="item.productName">
                                    <template #description>
                                        Qtd: {{ item.quantity }} x R$ {{ item.salePrice.toFixed(2) }}
                                    </template>
                                </a-list-item-meta>
                                <div class="item-profit">Lucro: R$ {{ item.totalProfit.toFixed(2) }}</div>
                            </a-list-item>
                        </template>
                    </a-list>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'totalAmount'">
                        <a-tag color="processing">R$ {{ record.totalAmount.toFixed(2) }}</a-tag>
                    </template>
                    <template v-if="column.key === 'totalProfit'">
                        <a-tag :color="record.totalProfit > 0 ? 'success' : 'error'">R$ {{ record.totalProfit.toFixed(2)
                            }}</a-tag>
                    </template>
                    <template v-if="column.key === 'date'">
                        {{ formatDate(record.date) }}
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useReportStore } from '@/stores/report';

const reportStore = useReportStore();

const columns = [
    { title: 'ID Venda', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Data', dataIndex: 'date', key: 'date', width: 150 },
    { title: 'Vendedor', dataIndex: 'userName', key: 'userName', width: 150 },
    { title: 'Total Bruto', dataIndex: 'totalAmount', key: 'totalAmount', width: 120 },
    { title: 'Custo', dataIndex: 'totalCost', key: 'totalCost', customRender: ({ text }: { text: number }) => `R$ ${text.toFixed(2)}`, width: 120 },
    { title: 'Lucro Líquido', dataIndex: 'totalProfit', key: 'totalProfit', width: 120 },
];

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
};

onMounted(() => {
    reportStore.loadReports();
});
</script>

<style scoped>
.relatorios-container {
    padding: 20px;
}

.relatorios-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.relatorios-container :deep(.ant-page-header-heading-sub-title) {
    margin-top: 5px;
    margin-left: 0 !important;
}

.ant-row>div {
    margin-bottom: 16px;
}

.item-profit {
    font-weight: bold;
    color: #001f3f;
}
</style>