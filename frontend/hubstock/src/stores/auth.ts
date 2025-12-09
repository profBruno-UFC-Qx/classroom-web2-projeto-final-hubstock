import { defineStore } from 'pinia';
import type { User, UserRole } from '@/types/entity-types';
import { MOCKED_USERS, MOCKED_RESTAURANTS, SUPERADMIN_RESTAURANT_ID } from '@/api/mockData';

interface AuthState {
    token: string | null;
    userRole: UserRole | null;
    userName: string | null;
    userId: string | null;
    profileImageUrl: string | null;
}

const LOGIN_MAP = MOCKED_USERS.reduce((acc, user) => {
    // email (sem o domínio '@hubstock.com') como chave de login
    const usernameKey = user.email.split('@')[0].split('.')[0]; 
    acc[usernameKey] = user;
    return acc;
}, {} as Record<string, User>);

const MOCK_TOKEN_EXPIRATION_SECONDS = 3600;

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: localStorage.getItem('hubstock_token') || null,
        userRole: (localStorage.getItem('hubstock_role') as UserRole) || null,
        userName: localStorage.getItem('hubstock_user') || null,
        userId: localStorage.getItem('hubstock_userId') || null,
        profileImageUrl: localStorage.getItem('hubstock_profileImage') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isSuperAdmin: (state) => state.userRole === 'SUPERADMINISTRADOR',
        isAdmin: (state) => state.userRole === 'ADMINISTRADOR',
        isGarcom: (state) => state.userRole === 'GARCOM',

        user: (state) => ({
            id: state.userId,
            role: state.userRole,
            name: state.userName,
            profileImage: state.profileImageUrl,
        }),
    },

    actions: {
        async login(username: string, password: string): Promise<boolean> {
            await new Promise(resolve => setTimeout(resolve, 500));

            const user = LOGIN_MAP[username];

            if (!user) {
                console.error('Login Falhou: Usuário não encontrado.');
                return false;
            }

            let profileImage: string | null = null;

            if (user.restaurantId === SUPERADMIN_RESTAURANT_ID) {
                // SUPERADMIN: img padrão
                profileImage = 'https://i.imgur.com/KnmpSoj.png';
            } else {
                // ADMIN/GARCOM: img do restaurante na qual ele faz parte
                const restaurant = MOCKED_RESTAURANTS.find(r => r.id === user.restaurantId);
                profileImage = restaurant?.profileImageUrl ?? null;
            }

            const fakePayload = {
                userId: user.id,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + MOCK_TOKEN_EXPIRATION_SECONDS,
            };

            const mockToken = `fake-jwt-header.${btoa(JSON.stringify(fakePayload))}.fake-signature`;

            this.token = mockToken;
            this.userRole = user.role;
            this.userName = user.name;
            this.userId = user.id;
            this.profileImageUrl = profileImage;

            localStorage.setItem('hubstock_token', mockToken);
            localStorage.setItem('hubstock_role', user.role ?? '');
            localStorage.setItem('hubstock_user', user.name);
            localStorage.setItem('hubstock_userId', user.id);
            localStorage.setItem('hubstock_profileImage', profileImage || '');

            console.log(`Login bem-sucedido para: ${this.userName} (${this.userRole})`);
            return true;
        },

        logout() {
            this.token = null;
            this.userRole = null;
            this.userName = null;

            localStorage.removeItem('hubstock_token');
            localStorage.removeItem('hubstock_role');
            localStorage.removeItem('hubstock_user');
            localStorage.removeItem('hubstock_userId');
            localStorage.removeItem('hubstock_profileImage');

            console.log('Logout realizado com sucesso.');
        },

        hasRequiredRole(roleToCheck: UserRole): boolean {
            // O Super Admin tem acesso a tudo, exceto rotas exclusivas de outro nível
            if (this.userRole === 'SUPERADMINISTRADOR' && roleToCheck !== null) {
                return true;
            }

            if (!roleToCheck) return true;
            if (!this.userRole) return false;

            // Admin pode acessar rotas de Garçom
            if (roleToCheck === 'GARCOM' && (this.userRole === 'GARCOM' || this.userRole === 'ADMINISTRADOR' || this.userRole === 'SUPERADMINISTRADOR')) {
                return true;
            }

            // Apenas Admin ou Super Admin podem acessar rotas de Admin
            if (roleToCheck === 'ADMINISTRADOR' && (this.userRole === 'ADMINISTRADOR' || this.userRole === 'SUPERADMINISTRADOR')) {
                return true;
            }

            // Acesso exclusivo de Super Admin
            if (roleToCheck === 'SUPERADMINISTRADOR' && this.userRole === 'SUPERADMINISTRADOR') {
                return true;
            }

            return false;
        }
    }
});