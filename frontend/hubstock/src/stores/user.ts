import { defineStore } from 'pinia';
import { userService } from '@/services/UserService';
import type { User, UserRole, PublicRegistrationPayload, Restaurant, UpdateUserPayload } from '@/types/entity-types';
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { MOCKED_USERS } from '@/api/mockData';
import { restaurantService } from '@/services/RestaurantService';
import { useAuthStore } from './auth';

interface NewUserMockData {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
    restaurantId?: string;
}

export const useUserStore = defineStore('user', () => {
    const users = ref<User[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    // Carrega a lista de users
    async function loadUsers(force = false) {
        if (users.value.length > 0 && !force) return;

        isLoading.value = true;
        error.value = null;

        try {
            users.value = await userService.getAllUsers();
        } catch (e: unknown) {
            error.value = (e as Error).message || 'Falha ao carregar lista de usuários.';
        } finally {
            isLoading.value = false;
        }
    }

    async function createUserMock(userData: NewUserMockData): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 500)); // latência

        const newId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

        const newUser: User = {
            id: newId,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            restaurantId: userData.restaurantId || '',
        };

        MOCKED_USERS.push(newUser);

        users.value.push(newUser);

        return newUser;
    }

    async function updateUserProfile(userId: string, payload: UpdateUserPayload): Promise<void> {
        error.value = null;
        isLoading.value = true;

        try {
            const userIndex = MOCKED_USERS.findIndex(u => u.id === userId);

            if (userIndex === -1) {
                throw new Error("Usuário não encontrado no mock.");
            }

            // 1. Atualizar o Mock de Dados (simulação de backend)
            const mockUser = MOCKED_USERS[userIndex];
            if (!mockUser) {
                throw new Error("Usuário não encontrado no mock.");
            }
            mockUser.name = payload.name;
            mockUser.email = payload.email;
            
            // 2. Atualizar o Estado do Pinia (users list)
            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1) {
                users.value[index].name = payload.name;
                users.value[index].email = payload.email;
            }

            // 3. Atualizar o Estado de Autenticação (Para refletir no Header/Layout)
            const authStore = useAuthStore();
            authStore.userName = payload.name; 
            
            // 4. Persistir no LocalStorage
            localStorage.setItem('hubstock_user', payload.name);

            if (payload.newPassword) {
                // Simulação: se a senha foi alterada, o token seria reemitido.
                console.log(`Senha do usuário ${userId} foi alterada (Mock).`);
            }

        } catch (e: unknown) {
            error.value = (e as Error).message || 'Falha ao salvar as alterações de perfil.';
            message.error(error.value);
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    // Atualiza o papel de um user
    async function changeUserRole(userId: string, newRole: UserRole, userName: string) {
        try {
            const updatedUser = await userService.updateUserRole(userId, newRole);

            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1) {
                users.value[index] = updatedUser;
            }
            message.success(`Papel de ${userName} alterado para ${newRole}.`);
        } catch (e: unknown) {
            error.value = (e as Error).message || 'Falha ao alterar o papel.';
            throw e;
        }
    }

    // Deleta um user
    async function deleteUser(userId: string, userName: string) {
        try {
            await userService.deleteUser(userId);
            users.value = users.value.filter(u => u.id !== userId);
            message.success(`Usuário ${userName} excluído com sucesso.`);
        } catch (e: unknown) {
            message.error((e as Error).message || 'Falha ao excluir o usuário.');
            throw e;
        }
    }

    // Registro de restaurante e administrador
    async function registerNewRestaurantAndAdmin(payload: PublicRegistrationPayload): Promise<{ user: User, restaurant: Restaurant }> {
        error.value = null;
        isLoading.value = true;
        
        try {
            const newRestaurantData: Omit<Restaurant, 'id'> = {
                name: payload.restaurantName,
                cnpj: payload.cnpj,
                profileImageUrl: payload.profileImageUrl,
            };
            const newRestaurant = await restaurantService.createRestaurant(newRestaurantData);

            const newUser: NewUserMockData = {
                name: payload.adminName,
                email: payload.adminEmail,
                password: payload.adminPassword,
                role: 'ADMINISTRADOR',
                restaurantId: newRestaurant.id 
            };

            const newAdminUser = await createUserMock(newUser); 
            
            return { user: newAdminUser, restaurant: newRestaurant };

        } catch (e: unknown) {
            error.value = (e as Error).message || 'Falha no cadastro do restaurante.';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        users,
        isLoading,
        error,
        loadUsers,
        createUserMock,
        changeUserRole,
        deleteUser,
        registerNewRestaurantAndAdmin,
        updateUserProfile
    };
});