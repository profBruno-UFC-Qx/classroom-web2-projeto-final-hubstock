<template>
    <div class="relatorios-container">
        <a-page-header title="Resumo de Vendas e Lucros" />

        <a-alert v-if="reportStore.error" :message="reportStore.error" type="error" show-icon
            style="margin-bottom: 25px;" />

        <a-row :gutter="16" style="margin-bottom: 30px;">
            <a-col :span="8" :xs="24" :sm="12" :lg="8">
                <a-card>
                    <a-statistic title="Receita Total" :value="reportStore.metricasResumo.receitaTotal" :precision="2"
                        prefix="R$" value-style="color: #3f8600" />
                </a-card>
            </a-col>
            <a-col :span="8" :xs="24" :sm="12" :lg="8">
                <a-card>
                    <a-statistic title="Lucro Total" :value="reportStore.metricasResumo.lucroTotal" :precision="2"
                        prefix="R$"
                        :value-style="{ color: reportStore.metricasResumo.lucroTotal > 0 ? '#3f8600' : '#cf1322' }" />
                </a-card>
            </a-col>
            <a-col :span="8" :xs="24" :sm="24" :lg="8">
                <a-card>
                    <a-statistic title="Vendas Registradas" :value="reportStore.metricasResumo.quantidadeVendas"
                        suffix="vendas" />
                </a-card>
            </a-col>
        </a-row>

        <a-card title="Histórico Detalhado de Vendas" :loading="reportStore.isLoading">
            <a-table :columns="colunas" :data-source="reportStore.historicoVendas" row-key="id"
                :pagination="configuracaoPaginacao" @change="mudarPagina" :scroll="{ x: 800 }">
                <template #expandedRowRender="{ record }">
                    <a-list item-layout="horizontal" :data-source="record.items" header="Produtos desta venda">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta :title="item.nomeProduto"
                                    :description="`Qtd: ${item.quantidade} x R$ ${Number(item.precoVenda).toFixed(2)}`" />
                                <div class="item-lucro">Lucro: R$ {{ Number(item.totalLucro).toFixed(2) }}</div>
                            </a-list-item>
                        </template>
                    </a-list>
                </template>

                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'totalValor'">
                        <a-tag color="blue">R$ {{ Number(record.totalValor).toFixed(2) }}</a-tag>
                    </template>

                    <template v-if="column.key === 'totalLucro'">
                        <a-tag :color="record.totalLucro > 0 ? 'green' : 'red'">
                            R$ {{ Number(record.totalLucro).toFixed(2) }}
                        </a-tag>
                    </template>

                    <template v-if="column.key === 'data'">
                        {{ formataData(record.data) }}
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useReportStore } from '@/stores/reportStore';
import { useRoute, useRouter } from 'vue-router';

const reportStore = useReportStore();
const route = useRoute();
const router = useRouter();

const colunas = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100, customRender: ({ text }: any) => text.substring(0, 8) },
    { title: 'Data', dataIndex: 'data', key: 'data', width: 150 },
    { title: 'Vendedor', dataIndex: 'nomeUsuario', key: 'nomeUsuario', width: 150 },
    { title: 'Total Bruto', dataIndex: 'totalValor', key: 'totalValor', width: 120 },
    { title: 'Lucro Líquido', dataIndex: 'totalLucro', key: 'totalLucro', width: 120 },
];

// Configura os botões de paginação embaixo da tabela
const configuracaoPaginacao = computed(() => ({
    total: reportStore.totalRegistros,
    current: reportStore.paginaAtual,
    pageSize: 10,
    showSizeChanger: false
}));

// Quando o usuário clica num número de página, atualiza a URL
const mudarPagina = (pag: any) => {
    router.push({
        query: { ...route.query, pagina: pag.current }
    });
};

// Pega os dados do servidor baseando-se no número que está na URL
const carregarDadosDaUrl = () => {
    const paginaUrl = Number(route.query.pagina) || 1;
    reportStore.loadReports(paginaUrl);
};

// Vigia a URL, se o número da página mudar chama o back-end de novo
watch(
    () => route.query.pagina,
    () => {
        carregarDadosDaUrl();
    }
);

// Formata a data do banco para o padrão brasileiro
const formataData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

onMounted(() => {
    carregarDadosDaUrl();
});
</script>

<style scoped>
.relatorios-container :deep(.ant-page-header) {
    padding-left: 0;
}

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