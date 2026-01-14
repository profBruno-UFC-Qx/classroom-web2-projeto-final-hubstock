import api from './ApiService';
import type { Usuario, UsuarioPapel, UpdateUserPayload } from '@/types/entity-types';

class UserService {
    /**
     * Busca todos os usuários
     */
    public async getAllUsers(): Promise<Usuario[]> {
        const { data } = await api.get<Usuario[]>('/usuarios');
        return data;
    }

    /**
     * Cria um novo usuário
     */
    public async createUser(userData: any): Promise<Usuario> {
        const { data } = await api.post('/usuarios', userData);
        return data.dados;
    }

    /**
     * Atualiza o perfil do usuário logado
     */
    public async updateProfile(userId: string, payload: UpdateUserPayload): Promise<Usuario> {
        const { data } = await api.put(`/usuarios/${userId}`, payload);
        return data.dados;
    }

    /**
     * Atualiza apenas o papel (role) de um usuário
     */
    public async updateUserRole(id: string, papel: UsuarioPapel): Promise<Usuario> {
        const { data } = await api.patch(`/usuarios/${id}/role`, { role: papel });
        return data.dados;
    }

    /**
     * Exclusão definitiva de um usuário
     */
    public async deleteUser(userId: string): Promise<void> {
        await api.delete(`/usuarios/${userId}`);
    }

    /**
     * Busca todos os usuários do restaurante logado
     */
    async getUsuariosDoMeuRestaurante() {
        const { data } = await api.get('/usuarios-restaurante');
        return data;
    }
}

export const userService = new UserService();