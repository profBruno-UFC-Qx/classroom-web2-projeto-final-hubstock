export type UserRole = 'ADMINISTRADOR' | 'GARCOM' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

// PRODUTO (O Estoque)
export type ProductUnit = 'UNIDADE' | 'LITRO' | 'KILOGRAMA';

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  currentStock: number; // Nível atual de estoque
  unitOfMeasure: ProductUnit; // Unidade de medida (ex: UNIDADE, LITRO)
  costPrice: number; // Custo de aquisição (usado para lucros)
  salePrice: number; // Preço de venda
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