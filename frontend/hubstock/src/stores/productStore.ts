import { defineStore } from 'pinia';
import { productService } from '@/services/ProductService';
import type { Produto, CategoriaProduto } from '@/types/entity-types';
import { ref, computed } from 'vue';

export const useProductStore = defineStore('product', () => {
  const produtos = ref<Produto[]>([]);
  const categories = ref<CategoriaProduto[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const estoqueBaixo = computed(() => {
    return produtos.value.filter(p => p.estoqueAtual <= 10);
  });

  // Carrega os produtos
  async function loadProduct(busca?: string) {
    isLoading.value = true;

    try {
      const loadedProducts = await productService.getAllProducts(busca);
      produtos.value = loadedProducts;
    } catch (e: any) {
      error.value = e.response?.data?.erro || 'Falha ao carregar os dados do inventário.';
    } finally {
      isLoading.value = false;
    }
  }

  // Adiciona um novo produto.
  async function addNewProduct(productData: Omit<Produto, 'id'>) {
    isLoading.value = true;
    try {
      const newProduct = await productService.createProduct(productData);
      produtos.value.unshift(newProduct); // coloca no começo da lista
      return newProduct;
    } catch (e: any) {
      error.value = e.response?.data?.erro || 'Erro ao cadastrar produto.';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  // Atualiza detalhes do produto
  async function updateProduct(productId: string, productData: Partial<Produto>) {
    isLoading.value = true;
    try {
      const updatedProduct = await productService.updateProduct(productId, productData);
      return updatedProduct;
    } catch (e: any) {
      error.value = e.response?.data?.erro || 'Erro ao atualizar produto.';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  // Remove um produto
  async function removeProduct(productId: string) {
    try {
      await productService.deleteProduct(productId);
      produtos.value = produtos.value.filter(p => p.id !== productId);
    } catch (e: any) {
      error.value = e.response?.data?.erro || 'Erro ao excluir produto.';
      throw e;
    }
  }

  // Registra entrada manual de estoque
  async function addStock(productId: string, quantity: number, notes?: string) {
    isLoading.value = true;
    try {
      const updatedProduct = await productService.registerStockEntry(productId, quantity, notes);
      return updatedProduct;
    } catch (e: any) {
      error.value = e.response?.data?.erro || 'Erro ao atualizar estoque.';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  function reset() {
    produtos.value = [];
    isLoading.value = false;
    error.value = null;
  }

  return {
    produtos,
    categories,
    isLoading,
    error,
    estoqueBaixo,
    loadProduct,
    addNewProduct,
    removeProduct,
    updateProduct,
    addStock,
    reset
  };
});