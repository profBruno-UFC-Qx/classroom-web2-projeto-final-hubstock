import { MOCKED_SALES, MOCKED_SALE_ITEMS, MOCKED_PRODUCTS, MOCKED_MOVEMENTS } from '@/api/mockData';
import type { Sale, SaleItem, Product, StockMovement, MovementType } from '@/types/entity-types';

const DELAY_MS = 600;
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface NewSaleData {
    userId: string;
    items: {
        productId: number;
        quantity: number;
    }[];
}

class SalesService {

    /**
     * Simula o processo de registrar uma nova venda completa.
     * @param saleData Os dados da nova venda (ID do usuário e lista de produtos/quantidades).
     * @returns A venda criada.
     */
    public async registerNewSale(saleData: NewSaleData): Promise<Sale> {
        await mockDelay(DELAY_MS);

        const now = new Date().toISOString();
        let totalAmount = 0;

        const itemsToProcess: { product: Product, quantity: number }[] = [];

        for (const item of saleData.items) {
            const product = MOCKED_PRODUCTS.find(p => p.id === item.productId);

            if (!product) {
                throw new Error(`Produto com ID ${item.productId} não encontrado.`);
            }
            if (product.currentStock < item.quantity) {
                throw new Error(`Estoque insuficiente para o produto: ${product.name}. Disponível: ${product.currentStock}`);
            }

            totalAmount += product.salePrice * item.quantity;
            itemsToProcess.push({ product, quantity: item.quantity });
        }

        // --- Criação da VENDA ---
        const newSaleId = Math.max(...MOCKED_SALES.map(s => s.id), 0) + 1;
        const newSale: Sale = {
            id: newSaleId,
            userId: saleData.userId,
            date: now,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
        };
        MOCKED_SALES.push(newSale);


        const newSaleItems: SaleItem[] = [];
        const newMovements: StockMovement[] = [];
        let saleItemIndex = Math.max(...MOCKED_SALE_ITEMS.map(i => i.id), 0);
        let movementIndex = Math.max(...MOCKED_MOVEMENTS.map(m => m.id), 0);


        for (const { product, quantity } of itemsToProcess) {
            // ITEM_VENDA
            saleItemIndex++;
            newSaleItems.push({
                id: saleItemIndex,
                saleId: newSaleId,
                productId: product.id,
                quantity: quantity,
                unitPrice: product.salePrice,
            });

            // MOVIMENTACAO_ESTOQUE (SAIDA_VENDA)
            movementIndex++;
            newMovements.push({
                id: movementIndex,
                productId: product.id,
                type: 'SAIDA_VENDA' as MovementType,
                quantity: quantity,
                date: now,
                responsibleUserId: saleData.userId,
            });

            // ATUALIZAÇÃO DO PRODUTO (Estoque)
            const productIndex = MOCKED_PRODUCTS.findIndex(p => p.id === product.id);
            if (productIndex !== -1) {
                if (MOCKED_PRODUCTS[productIndex]) {
                    MOCKED_PRODUCTS[productIndex].currentStock -= quantity;
                }
            }
        }

        MOCKED_SALE_ITEMS.push(...newSaleItems);
        MOCKED_MOVEMENTS.push(...newMovements);

        return newSale;
    }

}

export const salesService = new SalesService();