import { defineStore } from 'pinia';
import { userService } from '@/services/UserService';
import type { Usuario, UsuarioPapel, PublicRegistrationPayload, UpdateUserPayload } from '@/types/entity-types';
import { ref } from 'vue';
import { restaurantService } from '@/services/RestaurantService';
import { useAuthStore } from './authStore';

export const useUserStore = defineStore('user', () => {
    const users = ref<Usuario[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const authStore = useAuthStore();

    // Atualiza o perfil do usuário logado
    async function updateUserProfile(userId: string, payload: UpdateUserPayload) {
        isLoading.value = true;
        try {
            const updatedUser = await userService.updateProfile(userId, payload);

            const nomeNovo = updatedUser?.nome || payload.nome;
            const emailNovo = updatedUser?.email || payload.email;

            // atualiza a lista local de usuários
            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1 && users.value[index]) {
                users.value[index].nome = nomeNovo;
                users.value[index].email = emailNovo;
            }

            // atualiza o estado global no AuthStore para mudar no header
            if (authStore.usuario?.id === userId) {
                authStore.usuario.nome = nomeNovo;
                authStore.usuario.email = emailNovo;
                localStorage.setItem('usuario', JSON.stringify(authStore.usuario));
            }

            console.log('Perfil atualizado com sucesso!');
        } catch (e: any) {
            // Se cair aqui, a mensagem do back aparece na tela
            error.value = e.response?.data?.erro || 'Falha ao salvar as alterações de perfil.';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    // Altera o papel de um usuário
    async function changeUserRole(userId: string, newRole: UsuarioPapel, userName: string) {
        try {
            const updatedUser = await userService.updateUserRole(userId, newRole);

            const index = users.value.findIndex(u => u.id === userId);
            if (index !== -1 && users.value[index]) {
                users.value[index] = updatedUser;
            }
            console.log(`Papel de ${userName} alterado para ${newRole}.`);
        } catch (e: any) {
            console.error(e.response?.data?.erro || 'Falha ao alterar o papel.');
            throw e;
        }
    }

    // Deleta um usuário
    async function deleteUser(userId: string, userName: string) {
        try {
            await userService.deleteUser(userId);
            users.value = users.value.filter(u => u.id !== userId);
            console.log(`Usuário ${userName} excluído com sucesso.`);
        } catch (e: any) {
            console.error(e.response?.data?.erro || 'Falha ao excluir o usuário.');
            throw e;
        }
    }

    // Novo Restaurante + Primeiro Admin
    async function registerNewRestaurantAndAdmin(payload: PublicRegistrationPayload): Promise<void> {
        isLoading.value = true;
        try {
            await restaurantService.registrarRestaurantePublico(payload);
            console.log("Restaurante e Admin criados com sucesso!");
        } catch (e: any) {
            const msg = e.response?.data?.erro || "Erro no cadastro";
            throw new Error(msg);
        } finally {
            isLoading.value = false;
        }
    }

    async function registerUserInRestaurant(userData: any) {
        isLoading.value = true;
        try {
            const payload = {
                nome: userData.nome,
                email: userData.email,
                senha: userData.senha,
                role: userData.role,
                restauranteId: userData.restauranteId
            };
            await userService.createUser(payload);
        } catch (e: any) {
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function carregarUsuarios() {
        isLoading.value = true;
        try {
            users.value = await userService.getUsuariosDoMeuRestaurante();
        } catch (e: any) {
            console.error(e);
            error.value = "Erro ao carregar os funcionários.";
        } finally {
            isLoading.value = false;
        }
    }

    function reset() {
        users.value = [];
        isLoading.value = false;
    }

    return {
        users,
        isLoading,
        error,
        carregarUsuarios,
        changeUserRole,
        deleteUser,
        registerNewRestaurantAndAdmin,
        updateUserProfile,
        registerUserInRestaurant,
        reset
    };
});