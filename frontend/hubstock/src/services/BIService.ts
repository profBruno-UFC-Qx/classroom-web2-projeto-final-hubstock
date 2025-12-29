import { MOCKED_PRODUCTS } from '@/api/mockData';

const DELAY_MS = 600;
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface MonthlyRevenue {
    month: string; // Ex: "Jan 2025"
    revenue: number;
    profit: number;
}

export interface TopSellingProduct {
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

class BIService {

    // Faturamento histórico de um restaurante
    public async getRevenueHistory(restId: string): Promise<MonthlyRevenue[]> {
        await mockDelay(DELAY_MS);

        const mockData = [
            { month: 'Jan 2024', revenue: 12000, profit: 3500 },
            { month: 'Fev 2024', revenue: 15500, profit: 4100 },
            { month: 'Mar 2024', revenue: 17800, profit: 4800 },
            { month: 'Abr 2024', revenue: 16200, profit: 3900 },
        ];

        if (restId === 'rest-uuid-2') {
            return mockData.map(d => ({ ...d, revenue: d.revenue * 0.7, profit: d.profit * 0.8 }));
        }

        return mockData;
    }

    // 10 produtos mais vendidos de um restaurante
    public async getTopSellingProducts(restId: string): Promise<TopSellingProduct[]> {
        await mockDelay(DELAY_MS);

        const mockProducts = MOCKED_PRODUCTS.slice(0, 5);

        const topSellers: TopSellingProduct[] = mockProducts.map((p, index) => ({
            productId: p.id,
            productName: p.name,
            totalQuantity: (500 - index * 50) + (restId === 'rest-uuid-2' ? 50 : 0),
            totalRevenue: (p.salePrice * (500 - index * 50)) + (restId === 'rest-uuid-2' ? 100 : 0),
        })).sort((a, b) => b.totalQuantity - a.totalQuantity);

        return topSellers;
    }
}

export const biService = new BIService();