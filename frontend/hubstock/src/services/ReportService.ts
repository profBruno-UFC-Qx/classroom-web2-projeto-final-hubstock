import { MOCKED_SALES, MOCKED_SALE_ITEMS, MOCKED_PRODUCTS, MOCKED_USERS } from '@/api/mockData';
import type { Sale, SaleItem, Product, User } from '@/types/entity-types';

const DELAY_MS = 500;
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface SaleReportItem extends SaleItem {
    productName: string;
    productCostPrice: number;
    salePrice: number;
    totalCost: number;
    totalProfit: number;
    totalRevenue: number;
}

export interface SaleReport extends Sale {
    userName: string;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    items: SaleReportItem[];
}

class ReportService {

    // Consolidar os dados brutos de vendas, adicionando detalhes do produto e cálculos financeiros.
    private consolidateSalesData(sales: Sale[]): SaleReport[] {
        const productMap = new Map<number, Product>();
        for (const p of MOCKED_PRODUCTS) {
            productMap.set(p.id, p);
        }

        const userMap = new Map<string, User>();
        for (const u of MOCKED_USERS) {
            userMap.set(u.id, u);
        }


        return sales.map(sale => {
            let totalSaleCost = 0;
            const totalSaleRevenue = sale.totalAmount;

            const reportItems: SaleReportItem[] = MOCKED_SALE_ITEMS
                .filter(item => item.saleId === sale.id)
                .map(item => {
                    const product = productMap.get(item.productId);

                    const cost = product ? product.costPrice : 0;
                    const revenue = item.unitPrice;

                    const totalCost = cost * item.quantity;
                    const totalRevenue = revenue * item.quantity;
                    const totalProfit = totalRevenue - totalCost;

                    totalSaleCost += totalCost;

                    return {
                        ...item,
                        productName: product?.name || 'Produto Desconhecido',
                        productCostPrice: cost,
                        salePrice: revenue,
                        totalCost: totalCost,
                        totalRevenue: totalRevenue,
                        totalProfit: totalProfit,
                    };
                });

            return {
                ...sale,
                userName: userMap.get(sale.userId)?.name || 'Usuário Desconhecido',
                totalRevenue: totalSaleRevenue,
                totalCost: totalSaleCost,
                totalProfit: totalSaleRevenue - totalSaleCost,
                items: reportItems,
            };
        });
    }

    // Retorna um relatório consolidado de todas as vendas.
    public async getSalesReport(): Promise<SaleReport[]> {
        await mockDelay(DELAY_MS);

        const consolidated = this.consolidateSalesData(MOCKED_SALES);

        return consolidated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Retorna as métricas de resumo (Total, Lucro, Custo) para todas as vendas.
    public async getSummaryMetrics() {
        await mockDelay(DELAY_MS);

        const sales = this.consolidateSalesData(MOCKED_SALES);

        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalCost = sales.reduce((sum, sale) => sum + sale.totalCost, 0);
        const totalProfit = totalRevenue - totalCost;

        return {
            totalRevenue: Number.parseFloat(totalRevenue.toFixed(2)),
            totalCost: Number.parseFloat(totalCost.toFixed(2)),
            totalProfit: Number.parseFloat(totalProfit.toFixed(2)),
            totalSalesCount: sales.length,
        };
    }
}

export const reportService = new ReportService();