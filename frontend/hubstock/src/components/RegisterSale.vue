<template>
  <div class="sale-register">
    <h3>📝 Registrar Nova Venda</h3>
    
    <div v-if="saleStore.error" class="error-message">
        🚨 Erro na Venda: {{ saleStore.error }}
    </div>

    <form @submit.prevent="handleSaleSubmission">
        
        <div class="product-selection-area">
            <h4>Produtos no Pedido</h4>
            <div v-for="(item, index) in saleItems" :key="index" class="sale-item">
                <select v-model="item.productId" required class="product-select">
                    <option :value="0" disabled>-- Selecione um Produto --</option>
                    <option v-for="p in productStore.enrichedProducts" :key="p.id" :value="p.id">
                        {{ p.name }} (Estoque: {{ p.currentStock }}) - R$ {{ p.salePrice.toFixed(2) }}
                    </option>
                </select>
                
                <input 
                    type="number" 
                    v-model.number="item.quantity" 
                    min="1" 
                    placeholder="Qtd" 
                    required 
                    class="quantity-input"
                    @change="validateQuantity(item)"
                />
                
                <button type="button" @click="removeItem(index)" class="btn-remove">X</button>
            </div>
            
            <button type="button" @click="addItem" class="btn-add">➕ Adicionar Produto</button>
        </div>

        <div class="sale-summary">
            <h4>Resumo</h4>
            <div class="summary-line">
                <span>Itens:</span>
                <span>{{ totalItems }}</span>
            </div>
            <div class="summary-line total">
                <span>Total a Pagar:</span>
                <span>R$ {{ totalAmount.toFixed(2) }}</span>
            </div>
        </div>

        <button 
            type="submit" 
            :disabled="!isValid || saleStore.isLoading" 
            class="btn-submit"
        >
            {{ saleStore.isLoading ? 'Registrando...' : 'Finalizar Venda' }}
        </button>
        
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import { useSaleStore } from '@/stores/sale';

const authStore = useAuthStore();
const productStore = useProductStore();
const saleStore = useSaleStore();

interface SaleItemForm {
    productId: number;
    quantity: number;
}

const saleItems = ref<SaleItemForm[]>([
    { productId: 0, quantity: 1 }
]);

const totalItems = computed(() => {
    return saleItems.value.filter(item => item.productId > 0).reduce((sum, item) => sum + item.quantity, 0);
});

const totalAmount = computed(() => {
    let total = 0;
    for (const item of saleItems.value) {
        const product = productStore.enrichedProducts.find(p => p.id === item.productId);
        if (product) {
            total += product.salePrice * item.quantity;
        }
    }
    return total;
});

const isValid = computed(() => {
    // Deve ter pelo menos um item válido
    if (saleItems.value.length === 0 || saleItems.value.every(item => item.productId === 0 || item.quantity <= 0)) {
        return false;
    }
    // Lógica de estoque baixo (o service fará a validação final, mas é bom ter um aviso visual)
    return true;
});


function addItem() {
    saleItems.value.push({ productId: 0, quantity: 1 });
}

function removeItem(index: number) {
    saleItems.value.splice(index, 1);
}

function validateQuantity(item: SaleItemForm) {
    if (item.quantity < 1) {
        item.quantity = 1;
    }
}

async function handleSaleSubmission() {
    const validItems = saleItems.value
        .filter(item => item.productId > 0 && item.quantity > 0)
        .map(item => ({ 
            productId: item.productId, 
            quantity: item.quantity 
        }));

    if (validItems.length === 0) {
        alert("Adicione pelo menos um produto e a quantidade antes de finalizar a venda.");
        return;
    }

    const userId = authStore.userId || "";

    try {
        const newSale = await saleStore.registerSale(userId, validItems);
        
        alert(`Venda #${newSale.id} no valor de R$ ${newSale.totalAmount.toFixed(2)} registrada com sucesso!`);
        
        // Limpa o formulário
        saleItems.value = [{ productId: 0, quantity: 1 }];

    } catch (e) {
        // O erro já está no saleStore.error
        console.error('Erro na submissão da venda:', e);
    }
}

// O Garçom precisa do ID do usuário, que deve ser exportado do authStore
// Adicione um getter para o usuário no authStore.ts (se ainda não tiver):
// getters: { user: (state) => ({ id: 2, role: state.userRole, name: state.userName }) }
// Para o mock funcionar, vamos apenas usar 2 (Garçom João) por enquanto, ou assumir que o authStore tem o ID.
// (Vou assumir que você ajustará o authStore para ter o ID do usuário logado)
</script>

<style scoped>
/* Estilos básicos para o componente de venda */
.sale-register {
    background: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
    max-width: 600px;
    margin: 30px auto;
}

.product-selection-area {
    padding: 15px;
    border: 1px dashed #ccc;
    margin-bottom: 20px;
    border-radius: 6px;
}

.sale-item {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: center;
}

.product-select {
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.quantity-input {
    width: 60px;
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-add {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.btn-remove {
    background-color: #ccc;
    color: #333;
    border: none;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.sale-summary {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
}

.summary-line.total {
    font-size: 1.2em;
    font-weight: bold;
    border-top: 1px solid #adb5bd;
    margin-top: 5px;
    padding-top: 10px;
    color: #007bff;
}

.btn-submit {
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1.1em;
    cursor: pointer;
}
.btn-submit:disabled {
    background-color: #a0c9f1;
    cursor: not-allowed;
}

.error-message {
    padding: 10px;
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    margin-bottom: 15px;
}
</style>