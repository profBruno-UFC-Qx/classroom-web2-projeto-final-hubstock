import { defineStore } from 'pinia';
import { productService } from '@/services/ProductService';
import type { Product, Category } from '@/types/entity-types';
import { ref, computed } from 'vue';

interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Retorna os produtos com informações adicionais, como o nome da categoria.
   */
  const enrichedProducts = computed(() => {
    return products.value.map(product => {
      const category = categories.value.find(c => c.id === product.categoryId);
      return {
        ...product,
        categoryName: category ? category.name : 'Sem Categoria',
        // Adiciona um flag para produtos com estoque baixo (ex: < 10 unidades)
        isLowStock: product.currentStock < 10,
      };
    });
  });

  /**
   * Retorna uma lista de produtos que estão com estoque baixo.
   */
  const lowStockProducts = computed(() => {
    return enrichedProducts.value.filter(p => p.isLowStock);
  });

  /**
   * Carrega todos os produtos e categorias da camada de Service.
   * Só carrega se ainda não estiverem carregados ou se for forçado.
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
   * Adiciona um novo produto e atualiza o estado local.
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
   * Remove um produto e atualiza o estado local.
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

  return { 
      products, 
      categories, 
      isLoading, 
      error, 
      enrichedProducts, 
      lowStockProducts, 
      loadAllData, 
      addNewProduct, 
      removeProduct 
  };
});