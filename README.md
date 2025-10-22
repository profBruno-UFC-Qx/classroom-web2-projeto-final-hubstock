[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iVa2Dd1Z)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21200888)
# :checkered_flag: HubStock


## :technologist: Membros da equipe

552882 - Sávio de Carvalho Soares - Engenharia de Software

## :bulb: Objetivo Geral
O HubStock é um gerenciador de estoque de restaurantes, bares e etc. O seu objetivo é controlar o que entra e o que sai de mercadorias como bebidas, objetos para aluguel (hora/dia/semana), comidas e entre outras coisas.

## :eyes: Público-Alvo
Dono de Restaurantes/Bares

## :star2: Impacto Esperado
1. Espera-se que os estabelecimentos a serem atendidos tenham um maior controle e saibam a hora exata de repôr mercadorias. 
2. Saibam quanto de vendas estão tendo no dia/mês/ano.

## :people_holding_hands: Papéis ou tipos de usuário da aplicação
Administrador e Garçom

> Tenha em mente que obrigatoriamente a aplicação deve possuir funcionalidades acessíveis a todos os tipos de usuário e outra funcionalidades restritas a certos tipos de usuários.

## :triangular_flag_on_post:	 Principais funcionalidades da aplicação
As funcionalidades do HubStock serão divididas para garantir que cada tipo de usuário (Administrador e Garçom) tenha as ferramentas necessárias para cumprir seu papel, mantendo a segurança e o controle de acesso.

| Funcionalidade | Acesso | Papéis de Acesso |
| :--- | :--- | :--- |
| **Login/Logout** | Acessível a todos os usuários. | Todos |
| **Registro de Saída de Produto (Venda)** | Acessível a todos os usuários. | Garçom, Administrador |
| **Visualizar Nível de Estoque** | Acessível a todos os usuários. | Garçom, Administrador |
| **Gerenciar Produtos / Itens** | Restrita a certos tipos de usuários. | Administrador |
| **Registro de Entrada de Mercadoria** | Restrita a certos tipos de usuários. | Administrador |
| **Relatórios de Vendas e Lucros** | Restrita a certos tipos de usuários. | Administrador |
| **Gerenciamento de Usuários** | Restrita a certos tipos de usuários. | Administrador |

## :spiral_calendar: Entidades ou tabelas do sistema
1.  **USUARIO**
2.  **CATEGORIA** (Para agrupar produtos - ex: Bebidas, Comidas, Aluguel)
3.  **PRODUTO** (O estoque)
4.  **MOVIMENTACAO_ESTOQUE** (Registra toda entrada e saída de PRODUTO)
5.  **VENDA** (Registra as transações para os relatórios)
6.  **ITEM_VENDA** (Os produtos que estavam em uma VENDA específica)

