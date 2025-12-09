<template>
    <div class="quantity-control">
        <a-button size="small" @click="decrementQuantity" :disabled="isChanging">
            <template #icon>
                <minus-outlined />
            </template>
        </a-button>

        <span class="quantity-display" :class="{ 'is-changing': isChanging }">
            {{ item.quantity }}
        </span>

        <a-button size="small" @click="incrementQuantity" :disabled="isChanging">
            <template #icon><plus-outlined /></template>
        </a-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import type { MesaItem } from '@/types/venda';

const props = defineProps<{
    item: MesaItem;
}>();

const emit = defineEmits(['updateQuantity', 'removeItem']);

const isChanging = ref(false);

const incrementQuantity = () => {
    emit('updateQuantity', props.item.productId, props.item.quantity + 1);
};

const decrementQuantity = () => {
    if (props.item.quantity === 1) {
        emit('removeItem', props.item.productId);
    }
    else if (props.item.quantity > 1) {
        emit('updateQuantity', props.item.productId, props.item.quantity - 1);
    }
};
</script>

<style scoped>
.quantity-control {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100px;
}

.quantity-display {
    display: inline-block;
    min-width: 25px;
    text-align: center;
    font-weight: bold;
    transition: opacity 0.1s;
}

.is-changing {
    opacity: 0.5;
}
</style>