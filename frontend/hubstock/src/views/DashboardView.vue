<template>
  <div class="dashboard-container">
    <h2>👋 Olá, {{ authStore.userName }}!</h2>
    <p class="role-info">Seu papel: <strong>{{ authStore.userRole }}</strong></p>
    
    <RegisterSale /> 

    <div class="card low-stock-alert" v-if="productStore.lowStockProducts.length > 0">
        <h3>🚨 Produtos com Estoque Baixo</h3>
        <ul>
            <li v-for="product in productStore.lowStockProducts" :key="product.id">
                **{{ product.name }}** (Estoque Atual: {{ product.currentStock }})
            </li>
        </ul>
        <p v-if="!authStore.isAdmin" class="admin-notice">
            * Avise o administrador para providenciar a reposição!
        </p>
    </div>

    <div class="card stock-list">
        <h3>📊 Nível Geral de Estoque (Visualização)</h3>
        
        <p v-if="productStore.isLoading">Carregando dados de estoque...</p>
        <p v-else-if="productStore.error" class="error-message">
            Erro: {{ productStore.error }}
        </p>
        
        <ul v-else class="product-list">
            <li v-for="product in productStore.enrichedProducts" :key="product.id" :class="{ 'low-stock': product.isLowStock }">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-category">({{ product.categoryName }})</span>
                <span class="product-stock">Estoque: **{{ product.currentStock }}** {{ product.unitOfMeasure }}</span>
            </li>
        </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import RegisterSale from '@/components/RegisterSale.vue';

const authStore = useAuthStore();
const productStore = useProductStore();

onMounted(() => {
    productStore.loadAllData();
});
</script>

<style scoped>
.dashboard-container {
    padding: 30px;
    max-width: 1000px;
    margin: 0 auto;
}

.role-info {
    margin-bottom: 25px;
    color: #6c757d;
}

.card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
}

.low-stock-alert {
    background-color: #ffe0e0; 
    border-left: 5px solid #dc3545;
}

.low-stock-alert ul {
    list-style: disc;
    padding-left: 20px;
}

.low-stock-alert li {
    margin-bottom: 5px;
    color: #dc3545;
    font-weight: 500;
}

.product-list {
    list-style: none;
    padding: 0;
}

.product-list li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dashed #eee;
}

.product-name {
    font-weight: bold;
    flex: 2;
}
.product-category {
    flex: 1;
    color: #6c757d;
    font-size: 0.9em;
}
.product-stock {
    flex: 1;
    text-align: right;
    font-weight: 600;
    color: #28a745;
}

.low-stock .product-stock {
    color: #dc3545;
}

.error-message {
    color: #dc3545;
}
</style>