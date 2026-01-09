import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Aluguel } from '@/types/entity-types';
import dayjs from 'dayjs'; // Biblioteca recomendada para manipular datas

export const useAluguelStore = defineStore('aluguel', () => {
    const alugueis = ref<Aluguel[]>([]);
    const isLoading = ref(false);
    const timerId = ref<ReturnType<typeof setInterval> | null>(null);

    const startTimer = () => {
        if (timerId.value) return;
        timerId.value = setInterval(() => {
            // Força o re-cálculo das computed properties
            alugueis.value = [...alugueis.value];
        }, 60000); // Atualiza a cada 1 minuto
    };

    const enrichedAlugueis = computed(() => {
        return alugueis.value.map(item => {
            const agora = dayjs();
            const inicio = dayjs(item.dataInicio);
            const expiraEm = inicio.add(item.limiteHoras, 'hour');
            const minutosRestantes = expiraEm.diff(agora, 'minute');

            return {
                ...item,
                minutosRestantes,
                tempoFormatado: minutosRestantes > 0
                    ? `${Math.floor(minutosRestantes / 60)}h ${minutosRestantes % 60}min`
                    : 'Expirado',
                statusReal: (item.status === 'ATIVO' && minutosRestantes <= 0)
                    ? 'ATRASADO'
                    : item.status
            };
        });
    });

    // Ações
    const registrarAluguel = async (dados: Partial<Aluguel>) => {
        isLoading.value = true;
        try {
            // Aqui iria a chamada para sua API (POST /alugueis)
            // Exemplo de mock para teste:
            const novoAluguel = {
                ...dados,
                id: Math.floor(Math.random() * 1000),
                status: 'ATIVO',
                dataInicio: dayjs().toISOString()
            } as Aluguel;

            alugueis.value.push(novoAluguel);
        } finally {
            isLoading.value = false;
        }
    };

    const finalizarAluguel = async (id: number) => {
        const index = alugueis.value.findIndex(a => a.id === id);
        if (index !== -1) {
            alugueis.value[index].status = 'FINALIZADO';
            // Chamada API (PATCH /alugueis/:id)
        }
    };

    return {
        alugueis,
        enrichedAlugueis,
        isLoading,
        startTimer,
        registrarAluguel,
        finalizarAluguel
    };
});