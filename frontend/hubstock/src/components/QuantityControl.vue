<template>
    <div class="quantity-control">
        <a-button size="small" type="text" @click="decrement" :disabled="loading">
            <template #icon>
                <minus-outlined v-if="item.quantidade > 1" />
                <delete-outlined v-else class="delete-icon" />
            </template>
        </a-button>

        <span class="quantity-display">{{ item.quantidade }}</span>

        <a-button size="small" type="text" @click="increment" :disabled="loading">
            <template #icon><plus-outlined /></template>
        </a-button>
    </div>
</template>

<script setup lang="ts">
import { PlusOutlined, MinusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const props = defineProps<{
    item: any;
    loading?: boolean;
}>();

const emit = defineEmits(['update-quantity', 'remove-item']);

const increment = () => {
    emit('update-quantity', props.item.produtoId, props.item.quantidade + 1);
};

const decrement = () => {
    if (props.item.quantidade > 1) {
        emit('update-quantity', props.item.produtoId, props.item.quantidade - 1);
    } else {
        emit('remove-item', props.item.produtoId);
    }
};
</script>

<style scoped>
.quantity-control {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 15px;
}

.quantity-display {
    display: inline-block;
    min-width: 25px;
    text-align: center;
    font-weight: bold;
    transition: opacity 0.1s;
}

.delete-icon {
    color: #ff4d4f;
}
</style>