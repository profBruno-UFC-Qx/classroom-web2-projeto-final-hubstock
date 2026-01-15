export type UsuarioPapel = 'SUPERADMINISTRADOR' | 'ADMINISTRADOR' | 'GARCOM';

export interface Restaurante {
  id: string;
  nomeRestaurante: string;
  cnpjRestaurante: string;
  quantidadeMesas: number;
  urlImagemPerfilRestaurante: string;
  usuarios?: Usuario[];
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UsuarioPapel;
  restauranteId: string;

}
export interface UsuarioCompleto {
  id: string;
  nome: string;
  email: string;
  role: UsuarioPapel;
  restauranteId: string;
  senha: string;
}

export type CategoriaProduto = 'ENTRADAS' | 'BEBIDAS' | 'PRATOS_PRINCIPAIS' |  'PIZZAS' | 'SOBREMESAS' | 'SALADA' | 'OUTROS';

export type UnidadeMedida = 'UNIDADE' | 'QUILOGRAMA' | 'LITRO' | 'PACOTE' | 'GARRAFA';

export interface Produto {
  id: string;
  nomeProduto: string;
  descricao: string;
  unidadeMedidaProduto: UnidadeMedida;
  categoriaProduto: CategoriaProduto;
  precoCustoProduto: number;
  precoVendaProduto: number;
  urlImagemProduto?: string;
  estoqueAtual: number;
  createdAt: string;
  updatedAt: string;
}

// MOVIMENTACAO_ESTOQUE
export type MovementType = 'ENTRADA' | 'SAIDA';

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string;
  responsibleUserId: string;
  notes?: string;
}

// VENDA
export interface Venda {
  id: string;
  data: string;
  usuarioId: string;
  nomeUsuario: string;
  restauranteId: string;
  totalValor: number;
  totalCusto: number;
  totalLucro: number;
  items: VendaItem[];
  mesaId: string;
}

// ITEM_VENDA
export interface VendaItem {
  id: string;
  nomeProduto: string;
  quantidade: number;
  precoVenda: number;
  precoCusto: number;
  totalLucro: number;
  vendaId: string;
  venda: Venda;
}

// Registro público de restaurante e administrador
export interface PublicRegistrationPayload {
    nomeRestaurante: string;
    cnpjRestaurante: string;
    urlImagemPerfilRestaurante: string;
    quantidadeMesas: number;
    nomeAdministrador: string;
    emailAdministrador: string;
    senhaAdministrador: string;
}

// Atualização de usuário
export interface UpdateUserPayload {
    nome: string;
    email: string;
    senha?: string;
}

export interface HistoricoMensal {
    month: string;
    revenue: number;
    profit: number;
}

export interface TopProdutosVendas {
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

export interface BIResponse {
    revenueHistory: HistoricoMensal[];
    topSellers: TopProdutosVendas[];
}

export type StatusMesa = 'DISPONIVEL' | 'OCUPADA' | 'RESERVADA';

export interface Mesa {
    id: string;
    numero: number;
    status: StatusMesa;
    restauranteId: string;
    temVendaAtiva: boolean;   
    quantidadeItens: number;
}