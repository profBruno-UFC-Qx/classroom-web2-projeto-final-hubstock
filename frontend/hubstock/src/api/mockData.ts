import type { Category, Product, StockMovement, Sale, SaleItem, User, UserRole, ProductUnit, MovementType } from '@/types/entity-types';

export interface Restaurant {
    id: string;
    name: string;
    cnpj: string;
    profileImageUrl: string;
}

export const MOCKED_RESTAURANTS: Restaurant[] = [
    {
        id: "rest-uuid-1",
        name: "Autêntica - Comida Caseira",
        cnpj: "12.345.678/0001-90",
        profileImageUrl: 'https://i.imgur.com/X0eeM1r.png',
    },
    {
        id: "rest-uuid-2",
        name: "Praia Grande Açaí",
        cnpj: "98.765.432/0001-11",
        profileImageUrl: 'https://i.imgur.com/veQsmox.png',
    },
];

export const SUPERADMIN_RESTAURANT_ID = "GLOBAL";

export const MOCKED_USERS: User[] = [
    {
        id: "superadmin-uuid-001",
        name: 'Sávio Soares',
        email: 'savio.superadmin@hubstock.com',
        role: 'SUPERADMINISTRADOR' as UserRole,
        restaurantId: SUPERADMIN_RESTAURANT_ID
    },
    {
        id: "admin-uuid-001",
        name: 'Pedro Santos',
        email: 'pedro.admin@hubstock.com',
        role: 'ADMINISTRADOR' as UserRole,
        restaurantId: "rest-uuid-1"
    },
    {
        id: "garcom-uuid-001",
        name: 'João Silva',
        email: 'joao.garcom@hubstock.com',
        role: 'GARCOM' as UserRole,
        restaurantId: "rest-uuid-2"
    },
];

export const MOCKED_CATEGORIES: Category[] = [
    {
        id: 10,
        name: 'Bebidas Alcoólicas',
        description: 'Cervejas, vinhos e destilados'
    },
    {
        id: 20,
        name: 'Bebidas Não-Alcoólicas',
        description: 'Refrigerantes, sucos e água'
    },
    {
        id: 30,
        name: 'Porções e Petiscos',
        description: 'Comidas rápidas e aperitivos'
    },
    {
        id: 40,
        name: 'Aluguel (Objetos)',
        description: 'Itens alugados por hora/dia'
    },
];

export const MOCKED_PRODUCTS: Product[] = [
    {
        id: 1001,
        categoryId: 10,
        name: 'Cerveja Pilsen Lata 350ml',
        description: 'Lata de 350ml da marca X',
        imageUrl: 'https://i.imgur.com/vvezWgq.png',
        currentStock: 150,
        unitOfMeasure: 'UNIDADE' as ProductUnit,
        costPrice: 2.5,
        salePrice: 6
    },
    {
        id: 1002,
        categoryId: 10,
        name: 'Vinho Tinto Seco 750ml',
        description: 'Garrafa de 750ml',
        imageUrl: 'https://i.imgur.com/9D0R5hh.png',
        currentStock: 25,
        unitOfMeasure: 'UNIDADE' as ProductUnit,
        costPrice: 35,
        salePrice: 70
    },
    {
        id: 2001,
        categoryId: 20,
        name: 'Água Mineral 500ml',
        description: 'Sem gás',
        imageUrl: 'https://i.imgur.com/IszO1L1.png',
        currentStock: 300,
        unitOfMeasure: 'UNIDADE' as ProductUnit,
        costPrice: 1,
        salePrice: 3.5
    },
    {
        id: 3001,
        categoryId: 30,
        name: 'Batata Frita Porção P',
        description: '150g de batata frita',
        imageUrl: 'https://i.imgur.com/vlzYlVE.png',
        currentStock: 0,
        unitOfMeasure: 'KILOGRAMA' as ProductUnit,
        costPrice: 5,
        salePrice: 15
    },
    {
        id: 4001,
        categoryId: 40,
        name: 'Raquete Beach Tênnis',
        description: 'Aluguel por 1 hora',
        imageUrl: 'https://i.imgur.com/KbRZNJa.png',
        currentStock: 10,
        unitOfMeasure: 'UNIDADE' as ProductUnit,
        costPrice: 0,
        salePrice: 30
    },
];

export const MOCKED_MOVEMENTS: StockMovement[] = [
    {
        id: 1,
        productId: 1001,
        type: 'ENTRADA' as MovementType,
        quantity: 200,
        date: '2025-10-20T10:00:00Z',
        responsibleUserId: "admin-uuid-123"
    },
    {
        id: 2,
        productId: 1001,
        type: 'SAIDA_VENDA' as MovementType,
        quantity: 50,
        date: '2025-10-21T18:30:00Z',
        responsibleUserId: "garcom-uuid-123"
    },
    {
        id: 3,
        productId: 3001,
        type: 'SAIDA_PERDA' as MovementType,
        quantity: 10,
        date: '2025-10-22T09:00:00Z',
        responsibleUserId: "admin-uuid-123",
        notes: 'Produto estragado'
    },
];

export const MOCKED_SALES: Sale[] = [
    { id: 100, userId: "garcom-uuid-123", date: '2025-10-21T19:00:00Z', totalAmount: 76.5 },
];

export const MOCKED_SALE_ITEMS: SaleItem[] = [
    {
        id: 1, saleId: 100, productId: 1001, quantity: 5, unitPrice: 6
    },
    {
        id: 2, saleId: 100, productId: 2001, quantity: 12, unitPrice: 3.5
    },
    {
        id: 3, saleId: 100, productId: 4001, quantity: 1, unitPrice: 30
    },
];