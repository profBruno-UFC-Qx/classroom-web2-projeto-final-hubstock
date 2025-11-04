import { defineStore } from 'pinia';
import type { UserRole } from '@/types/entity-types';

interface AuthState {
    token: string | null;
    userRole: UserRole;
    userName: string | null;
    userId: string | null;
}

const MOCKED_USERS = {
    admin: { id: "admin-uuid-123", role: 'ADMINISTRADOR', name: 'Sávio Soares' },
    garcom: { id: "garcom-uuid-123", role: 'GARCOM', name: 'João Silva' },
};

// Expiração do token (3600 segundos = 1 hora)
const MOCK_TOKEN_EXPIRATION_SECONDS = 3600;

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: localStorage.getItem('hubstock_token') || null,
        userRole: (localStorage.getItem('hubstock_role') as UserRole) || null,
        userName: localStorage.getItem('hubstock_user') || null,
        userId: localStorage.getItem('hubstock_userId') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.userRole === 'ADMINISTRADOR',
        isGarcom: (state) => state.userRole === 'GARCOM',
    },

    actions: {
        /**
         * Simula o processo de Login (Requisição ao Backend).
         * @param username O nome de usuário para login ('admin' ou 'garcom').
         * @param password A senha (não verificamos a senha no mock, mas é um campo obrigatório).
         */
        async login(username: string, password: string): Promise<boolean> {
            await new Promise(resolve => setTimeout(resolve, 500));

            // 2. Verifica se o usuário existe
            const user = MOCKED_USERS[username as keyof typeof MOCKED_USERS];

            if (!user) {
                console.error('Login Falhou: Usuário não encontrado.');
                return false;
            }

            // Geração de um Token Falso (JWT Mockado)
            const fakePayload = {
                userId: username === 'admin' ? "admin-uuid-123" : "garcom-uuid-123",
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + MOCK_TOKEN_EXPIRATION_SECONDS,
            };

            // Um token JWT bem simples
            const mockToken = `fake-jwt-header.${btoa(JSON.stringify(fakePayload))}.fake-signature`;

            // Armazena o estado e persiste no LocalStorage
            this.token = mockToken;
            this.userRole = user.role as UserRole;
            this.userName = user.name;
            this.userId = String(user.id);

            localStorage.setItem('hubstock_token', mockToken);
            localStorage.setItem('hubstock_role', user.role);
            localStorage.setItem('hubstock_user', user.name);
            localStorage.setItem('hubstock_userId', String(user.id));

            console.log(`Login bem-sucedido para: ${this.userName} (${this.userRole})`);
            return true;
        },

        /**
         * Realiza o Logout do usuário, limpando o estado e o LocalStorage.
         */
        logout() {
            this.token = null;
            this.userRole = null;
            this.userName = null;

            localStorage.removeItem('hubstock_token');
            localStorage.removeItem('hubstock_role');
            localStorage.removeItem('hubstock_user');
            localStorage.removeItem('hubstock_userId');

            console.log('Logout realizado com sucesso.');
        },

        /**
         * Checa se o usuário atual possui um determinado papel.
         * @param roleToCheck O papel que está sendo verificado.
         */
        hasRequiredRole(roleToCheck: UserRole): boolean {
            if (!roleToCheck) return true; // Se não for exigido um papel específico, permite
            if (!this.userRole) return false; // Se não houver usuário logado, nega

            // O Garçom e o Administrador têm acesso a funcionalidades de Garçom.
            if (roleToCheck === 'GARCOM' && (this.userRole === 'GARCOM' || this.userRole === 'ADMINISTRADOR')) {
                return true;
            }

            // Apenas o Administrador tem acesso a funcionalidades de Administrador.
            if (roleToCheck === 'ADMINISTRADOR' && this.userRole === 'ADMINISTRADOR') {
                return true;
            }

            return false;
        }
    }
});