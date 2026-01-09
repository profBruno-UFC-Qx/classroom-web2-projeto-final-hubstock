<template>
    <div class="aluguel-container">
        <a-page-header title="Gestão de Locações (Por Pessoa)" class="header-no-padding" />

        <a-button type="primary" style="margin-bottom: 20px;" @click="openCreateModal">
            <template #icon><plus-outlined /></template>
            Nova Locação
        </a-button>

        <a-card :loading="aluguelStore.isLoading">
            <a-table :columns="columns" :data-source="aluguelStore.enrichedAlugueis" row-key="id" :scroll="{ x: 1000 }">
                <template #bodyCell="{ column, record }">

                    <template v-if="column.key === 'image'">
                        <img :src="record.produtoFotoUrl || FALLBACK_IMAGE" class="product-thumb" />
                    </template>

                    <template v-if="column.key === 'cliente'">
                        <div class="cliente-info-wrapper">
                            <span class="cliente-name">{{ record.clienteNome }}</span>
                            <div class="cliente-phone-row">
                                <phone-outlined class="phone-icon" />
                                <span class="cliente-phone">{{ record.clienteTelefone }}</span>
                            </div>
                        </div>
                    </template>

                    <template v-if="column.key === 'dataInicio'">
                        <div class="date-info-wrapper">
                            <span class="date-human">{{ formatRelativeDate(record.dataInicio) }}</span>
                            <small class="date-time-sub">às {{ formatTime(record.dataInicio) }}</small>
                        </div>
                    </template>

                    <template v-if="column.key === 'status'">
                        <div class="status-cell">
                            <a-tag
                                :color="record.statusReal === 'ATRASADO' ? 'red' : record.statusReal === 'ATIVO' ? 'processing' : 'default'"
                                class="status-tag">
                                {{ record.statusReal }}
                            </a-tag>

                            <div v-if="record.statusReal !== 'FINALIZADO'" class="timer-display">
                                <clock-circle-outlined :class="{ 'blink-red': record.statusReal === 'ATRASADO' }" />
                                <span :class="record.statusReal === 'ATRASADO' ? 'text-danger' : 'text-timer'">
                                    {{ record.tempoFormatado }}
                                </span>
                            </div>
                        </div>
                    </template>

                    <template v-if="column.key === 'action'">
                        <a-space>
                            <a-tooltip title="Enviar WhatsApp">
                                <a-button type="link" @click="contactWhatsApp(record.clienteTelefone)">
                                    <template #icon><whats-app-outlined style="color: #25D366" /></template>
                                </a-button>
                            </a-tooltip>

                            <a-popconfirm title="Finalizar e receber objeto?"
                                @confirm="aluguelStore.finalizarAluguel(record.id)">
                                <a-button type="primary" size="small">Finalizar</a-button>
                            </a-popconfirm>
                        </a-space>
                    </template>

                </template>
            </a-table>
        </a-card>

        <AluguelForm :open="isModalVisible" @close="isModalVisible = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAluguelStore } from '@/stores/aluguel';
import { PlusOutlined, WhatsAppOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import AluguelForm from '@/components/AluguelForm.vue';
import { useProductStore } from '@/stores/product';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.locale('pt-br');

const productStore = useProductStore();
const aluguelStore = useAluguelStore();
const isModalVisible = ref(false);
const FALLBACK_IMAGE = 'https://placehold.co/40x40?text=Objeto';

const columns = [
    { title: 'Foto', key: 'image', width: 80, fixed: 'left' },
    { title: 'Cliente / Contacto', key: 'cliente', width: 200, fixed: 'left' },
    { title: 'Objeto', dataIndex: 'produtoNome', key: 'produtoNome', width: 150 },
    { title: 'Início', dataIndex: 'dataInicio', key: 'dataInicio', width: 150 },
    { title: 'Limite (Horas)', dataIndex: 'limiteHoras', key: 'limiteHoras', width: 120 },
    { title: 'Status', key: 'status', width: 120 },
    { title: 'Ações', key: 'action', width: 150, fixed: 'right', align: 'center' },
];

const formatRelativeDate = (date: string) => {
    return dayjs(date).calendar(null, {
        sameDay: '[Hoje]',
        lastDay: '[Ontem]',
        lastWeek: 'DD/MM/YYYY',
        sameElse: 'DD/MM/YYYY',
    });
};

const formatTime = (date: string) => {
    return dayjs(date).format('HH:mm');
};

const openCreateModal = () => {
    isModalVisible.value = true;
};

const contactWhatsApp = (telefone: string) => {
    const num = telefone.replace(/\D/g, '');
    window.open(`https://wa.me/${num}`, '_blank');
};

onMounted(async () => {
    aluguelStore.startTimer();

    if (productStore.products.length === 0) {
        await productStore.loadAllData();
    }
});
</script>


<style scoped>
.aluguel-container :deep(.ant-page-header) {
    padding-left: 0;
}

.aluguel-container :deep(.ant-page-header-heading) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.aluguel-container {
    padding: 20px;
}

/* Ajuste opcional para centralizar o conteúdo da célula da imagem */
:deep(.ant-table-cell) {
    vertical-align: middle;
}

.status-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
}

.status-tag {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 11px;
}

.timer-display {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: 'Courier New', Courier, monospace;
    /* Dá um aspecto de relógio */
    font-size: 13px;
}

.text-timer {
    color: #595959;
}

.text-danger {
    color: #f5222d;
    font-weight: bold;
}

/* Efeito sutil para chamar atenção no atraso */
.blink-red {
    color: #f5222d;
    animation: blink 1.5s infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    100% {
        opacity: 1;
    }
}

.product-thumb {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cliente-info-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.cliente-name {
    font-weight: 600;
    color: #262626;
    font-size: 14px;
}

.cliente-phone-row {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #8c8c8c;
}

.phone-icon {
    font-size: 12px;
}

.cliente-phone {
    font-size: 13px;
}

/* Wrapper da Data */
.date-info-wrapper {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.date-human {
    font-weight: 500;
    color: #434343;
}

.date-time-sub {
    color: #bfbfbf;
    font-size: 11px;
}
</style>