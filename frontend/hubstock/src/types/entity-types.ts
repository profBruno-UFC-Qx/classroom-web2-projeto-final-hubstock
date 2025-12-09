export type UserRole = 'SUPERADMINISTRADOR' | 'ADMINISTRADOR' | 'GARCOM';

export interface Restaurant {
  id: string;
  name: string;
  cnpj: string;
  profileImageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  restaurantId: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

// PRODUTO
export type ProductUnit = 'UNIDADE' | 'LITRO' | 'KILOGRAMA';

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  currentStock: number;
  unitOfMeasure: ProductUnit;
  costPrice: number;
  salePrice: number;
  imageUrl?: string;
}

// MOVIMENTACAO_ESTOQUE
export type MovementType = 'ENTRADA' | 'SAIDA_VENDA' | 'SAIDA_PERDA';

export interface StockMovement {
  id: number;
  productId: number;
  type: MovementType;
  quantity: number;
  date: string;
  responsibleUserId: string;
  notes?: string;
}

// VENDA
export interface Sale {
  id: number;
  userId: string;
  date: string;
  totalAmount: number;
}

// ITEM_VENDA
export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number; // Preço pelo qual o item foi vendido
}

// Registro público de restaurante e administrador
export interface PublicRegistrationPayload {
    restaurantName: string;
    cnpj: string;
    profileImageUrl: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
}