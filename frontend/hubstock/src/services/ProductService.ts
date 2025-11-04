import { MOCKED_PRODUCTS, MOCKED_CATEGORIES } from '@/api/mockData';
import type { Category, Product } from '@/types/entity-types';

const DELAY_MS = 500;
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {

    /**
     * Busca todos os produtos.
     */
    public async getAllProducts(): Promise<Product[]> {
        await mockDelay(DELAY_MS);
        return JSON.parse(JSON.stringify(MOCKED_PRODUCTS));
    }
    /**
     * Busca um produto específico pelo ID.
     */
    public async getProductById(id: number): Promise<Product | undefined> {
        await mockDelay(DELAY_MS);
        return MOCKED_PRODUCTS.find(p => p.id === id);
    }

    /**
     * Busca todas as categorias.
     */
    public async getAllCategories(): Promise<Category[]> {
        await mockDelay(DELAY_MS);
        return JSON.parse(JSON.stringify(MOCKED_CATEGORIES));
    }

    /**
     * Simula a criação de um novo produto.
     * @param productData Os dados do novo produto.
     */
    public async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
        await mockDelay(DELAY_MS);

        const newId = Math.max(...MOCKED_PRODUCTS.map(p => p.id), 0) + 1;

        const newProduct: Product = {
            ...productData as Product,
            id: newId,
            currentStock: productData.currentStock || 0,
        };

        MOCKED_PRODUCTS.push(newProduct);

        return newProduct;
    }

    /**
     * Simula a atualização de um produto existente.
     */
    public async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
        await mockDelay(DELAY_MS);

        const index = MOCKED_PRODUCTS.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error(`Produto com ID ${id} não encontrado para atualização.`);
        }

        MOCKED_PRODUCTS[index] = {
            ...MOCKED_PRODUCTS[index],
            id: MOCKED_PRODUCTS[index]?.id ?? 0,
            categoryId: productData.categoryId ?? MOCKED_PRODUCTS[index]?.categoryId ?? 0,
            name: productData.name ?? MOCKED_PRODUCTS[index]?.name ?? '',
            description: productData.description ?? MOCKED_PRODUCTS[index]?.description ?? '',
            currentStock: productData.currentStock ?? MOCKED_PRODUCTS[index]?.currentStock ?? 0,
            unitOfMeasure: productData.unitOfMeasure ?? MOCKED_PRODUCTS[index]?.unitOfMeasure ?? 'UNIDADE',
            costPrice: productData.costPrice ?? MOCKED_PRODUCTS[index]?.costPrice ?? 0,
            salePrice: productData.salePrice ?? MOCKED_PRODUCTS[index]?.salePrice ?? 0,
        };

        return MOCKED_PRODUCTS[index];
    }

    /**
     * Simula a exclusão de um produto.
     */
    public async deleteProduct(id: number): Promise<void> {
        await mockDelay(DELAY_MS);

        const initialLength = MOCKED_PRODUCTS.length;
        const index = MOCKED_PRODUCTS.findIndex(p => p.id === id);
        if (index !== -1) {
            MOCKED_PRODUCTS.splice(index, 1);
        }

        if (MOCKED_PRODUCTS.length === initialLength) {
            throw new Error(`Produto com ID ${id} não encontrado para exclusão.`);
        }
    }
}

export const productService = new ProductService();