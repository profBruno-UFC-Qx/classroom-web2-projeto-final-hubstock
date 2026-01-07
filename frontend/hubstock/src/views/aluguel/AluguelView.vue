<template>
    <div class="aluguel-container">
        <a-page-header title="Gestão de Locações" class="header-no-padding" />

        <a-button type="primary" @click="openCreateModal">
            <template #icon><plus-outlined /></template>
            Nova Locação
        </a-button>

        <div class="mt-20">
            <a-empty v-if="aluguelStore.enrichedAlugueis.length === 0" description="Nenhuma locação ativa no momento"
                style="margin-top: 60px;" />

            <a-row v-else :gutter="[16, 16]">
                <a-col v-for="item in aluguelStore.enrichedAlugueis" :key="item.id" :xs="24" :sm="12" :lg="8" :xl="6">
                    <a-card :class="['rental-card', { 'atrasado-border': item.statusReal === 'ATRASADO' }]">

                        <div class="card-header">
                            <img :src="item.produtoFotoUrl || FALLBACK_IMAGE" class="rental-img" />
                            <div class="product-info">
                                <span class="product-name">{{ item.produtoNome }}</span>
                                <a-tag :color="item.statusReal === 'ATRASADO' ? 'red' : 'green'">
                                    {{ item.statusReal }}
                                </a-tag>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="customer-section">
                                <span class="customer-name">{{ item.clienteNome }}</span>
                                <PhoneOutlined class="customer-icon-phone" />
                                <span class="customer-phone">{{ item.clienteTelefone }}</span>
                            </div>

                            <div class="time-section">
                                <div class="time-block">
                                    <span class="label">INÍCIO</span>
                                    <span class="val">{{ formatRelativeDate(item.dataInicio) }} às {{
                                        formatTime(item.dataInicio) }}</span>
                                </div>
                                <div class="time-block timer">
                                    <span class="label">TEMPO RESTANTE</span>
                                    <div class="countdown-wrapper"
                                        :class="{ 'blink-red': item.statusReal === 'ATRASADO' }">
                                        <clock-circle-outlined style="margin-right: 4px;" />
                                        <span class="countdown">
                                            {{ item.tempoFormatado }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <template #actions>
                            <a-tooltip title="WhatsApp">
                                <whats-app-outlined @click="contactWhatsApp(item.clienteTelefone)"
                                    style="color: #25D366; font-size: 18px;" />
                            </a-tooltip>

                            <a-popconfirm title="Finalizar esta locação?"
                                @confirm="aluguelStore.finalizarAluguel(item.id)">
                                <a-tooltip title="Finalizar">
                                    <check-circle-outlined style="color: #1890ff; font-size: 18px;" />
                                </a-tooltip>
                            </a-popconfirm>
                        </template>
                    </a-card>
                </a-col>
            </a-row>
        </div>

        <AluguelForm :open="isModalVisible" @close="isModalVisible = false" />
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAluguelStore } from '@/stores/aluguel';
import {
    PlusOutlined, WhatsAppOutlined, CheckCircleOutlined,
    ClockCircleOutlined, PhoneOutlined
} from '@ant-design/icons-vue';
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

.rental-card {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
    border-left: 5px solid #52c41a;
    /* Verde por padrão */
}

.atrasado-border {
    border-left: 5px solid #f5222d;
    background-color: #fff1f0;
}

.card-header {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.rental-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}

.product-info :deep(.ant-tag) {
    font-size: 10px;
    line-height: 16px;
    padding: 0 10px;
    margin: 4px 0 0 0;
    font-weight: bold;
    text-transform: uppercase;
}

.product-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.product-name {
    font-weight: bold;
    font-size: 16px;
}

.customer-name {
    display: block;
    font-size: 15px;
    font-weight: 500;
}

.customer-phone {
    color: #8c8c8c;
    font-size: 13px;
}

.customer-icon-phone {
    color: #8c8c8c;
    font-size: 13px;
    margin: 0 6px;
}


.time-section {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.02);
    padding: 8px;
    border-radius: 6px;
}

.time-block .label {
    display: block;
    font-size: 10px;
    color: #bfbfbf;
}

.countdown {
    font-weight: bold;
    font-size: 14px;
}

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

.mt-20 {
    margin-top: 20px;
}

.rental-card :deep(.ant-card-actions) {
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
}

.rental-card :deep(.ant-card-actions > li) {
    margin: 8px 0;
}

.countdown-wrapper {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
}
</style>
