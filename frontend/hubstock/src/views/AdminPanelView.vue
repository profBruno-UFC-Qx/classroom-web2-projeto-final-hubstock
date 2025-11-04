<template>
    <div class="admin-container">
        <h1 class="bg-red-400">Gerenciamento de Produtos</h1>

        <div class="admin-tools">
            <p v-if="productStore.isLoading">Carregando dados de produtos...</p>
            <p v-else-if="productStore.error" class="error-message">
                Erro: {{ productStore.error }}
            </p>

            <table v-else class="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Estoque</th>
                        <th>Preço Venda</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in productStore.enrichedProducts" :key="product.id">
                        <td>{{ product.id }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.categoryName }}</td>
                        <td>{{ product.currentStock }} {{ product.unitOfMeasure }}</td>
                        <td>R$ {{ product.salePrice.toFixed(2) }}</td>
                        <td>
                            <button @click="editProduct(product.id)" class="btn btn-sm btn-edit">Editar</button>
                            <button @click="confirmDelete(product.id, product.name)"
                                class="btn btn-sm btn-delete">Excluir</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <button class="btn btn-primary add-btn">➕ Adicionar Novo Produto</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/product';

const productStore = useProductStore();

onMounted(() => {
    productStore.loadAllData();
});

function editProduct(id: number) {
    alert(`Funcionalidade de Edição do Produto ${id} será implementada.`);
}

async function confirmDelete(id: number, name: string) {
    if (confirm(`Tem certeza que deseja excluir o produto: ${name} (ID: ${id})?`)) {
        try {
            await productStore.removeProduct(id);
            alert(`Produto ${name} excluído com sucesso (Mocked).`);
        } catch (e: unknown) {
            alert(`Erro ao excluir: ${(e as Error).message}`);
        }
    }
}
</script>

<style scoped>
.admin-container {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.admin-tools {
    margin-top: 20px;
}

.product-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-table th,
.product-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.product-table th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #333;
}

.btn {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    margin-right: 5px;
}

.btn-edit {
    background-color: #ffc107;
    color: #333;
}

.btn-delete {
    background-color: #dc3545;
    color: white;
}

.add-btn {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    margin-top: 15px;
}

.error-message {
    color: #dc3545;
}
</style>