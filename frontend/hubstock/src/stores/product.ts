import { defineStore } from 'pinia';
import { productService } from '@/services/ProductService';
import type { Product, Category } from '@/types/entity-types';
import { ref, computed } from 'vue';
import { useAuthStore } from './auth';

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Produtos enriquecidos com nome da categoria e status de estoque baixo.
  const enrichedProducts = computed(() => {
    return products.value.map(product => {
      const category = categories.value.find(c => c.id === product.categoryId);
      return {
        ...product,
        categoryName: category ? category.name : 'Sem Categoria',
        isLowStock: product.currentStock < 10,
      };
    });
  });

  const lowStockProducts = computed(() => {
    return enrichedProducts.value.filter(p => p.isLowStock);
  });

  /** Carrega todos os produtos e categorias, com cache simples.
  * @param force Se true, força o recarregamento dos dados ignorando o cache.
  */
  async function loadAllData(force = false) {
    if ((products.value.length > 0 && categories.value.length > 0) && !force) {
      console.log("Dados de produtos e categorias já carregados. Usando cache.");
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const loadedCategories = await productService.getAllCategories();
      categories.value = loadedCategories;

      const loadedProducts = await productService.getAllProducts();
      products.value = loadedProducts;

    } catch (e) {
      error.value = 'Falha ao carregar os dados de produtos e categorias.';
      console.error('Erro ao carregar dados:', e);
    } finally {
      isLoading.value = false;
    }
  }

  /**
  * Adiciona um novo produto.
  */
  async function addNewProduct(productData: Omit<Product, 'id'>) {
    error.value = null;
    try {
      const newProduct = await productService.createProduct(productData);
      products.value.push(newProduct);
      return newProduct;
    } catch (e) {
      error.value = 'Falha ao criar o novo produto.';
      throw e;
    }
  }

  /**
  * Deleta um produto pelo ID.
  */
  async function removeProduct(productId: number) {
    error.value = null;
    try {
      await productService.deleteProduct(productId);
      products.value = products.value.filter(p => p.id !== productId);
    } catch (e) {
      error.value = 'Falha ao deletar o produto.';
      throw e;
    }
  }

  /**
     * Atualiza os detalhes de um produto existente.
     */
    async function updateProduct(productId: number, productData: Partial<Product>) {
        error.value = null;
        isLoading.value = true;
        try {
            // atualiza o produto mockado
            const updatedProduct = await productService.updateProduct(productId, productData);

            // atualiza o estado local do Pinia
            const index = products.value.findIndex(p => p.id === productId);
            if (index === -1) {
                console.warn(`Produto com ID ${productId} não encontrado no estado local.`);
            } else {
                // substitui o antigo pelo atualizado
                products.value[index] = updatedProduct;
            }

            return updatedProduct;
        } catch (e) {
            error.value = 'Falha ao atualizar o produto.';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

  /**
  * Registra uma nova entrada de mercadoria.
  */
  async function registerEntry(productId: number, quantity: number, notes?: string) {
    error.value = null;
    isLoading.value = true;

    // ID do Admin logado
    const authStore = useAuthStore();
    const responsibleUserId = authStore.userId;

    if (!responsibleUserId) {
      isLoading.value = false;
      throw new Error("Usuário não autenticado para registrar entrada.");
    }

    try {
      const updatedProduct = await productService.registerStockEntry(
        productId,
        quantity,
        responsibleUserId,
        notes
      );

      // atualiza o produto no estado local
      const index = products.value.findIndex(p => p.id === productId);
      if (index !== -1) {
        products.value[index] = updatedProduct;
      }


      return updatedProduct;
    } catch (e) {
      error.value = "Falha ao registrar a entrada de mercadoria.";
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    products,
    categories,
    isLoading,
    error,
    enrichedProducts,
    lowStockProducts,
    loadAllData,
    addNewProduct,
    removeProduct,
    updateProduct,
    registerEntry,
  };
});