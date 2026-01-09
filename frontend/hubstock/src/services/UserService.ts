import { MOCKED_USERS } from '@/api/mockData';
import type { User, UserRole } from '@/types/entity-types';

const DELAY_MS = 500;
const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {

    // Busca todos os usuários
    public async getAllUsers(): Promise<User[]> {
        await mockDelay(DELAY_MS);
        return structuredClone(MOCKED_USERS).filter(
            (user: User) => user.role !== 'SUPERADMINISTRADOR'
        );
    }

    // Atualiza o papel de um usuário
    public async updateUserRole(userId: string, newRole: UserRole): Promise<User> {
        await mockDelay(DELAY_MS);

        const userIndex = MOCKED_USERS.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }

        const user = MOCKED_USERS[userIndex];
        if (!user) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }

        user.role = newRole;

        return user;
    }

    // Exclusão de um usuário
    public async deleteUser(userId: string): Promise<void> {
        await mockDelay(DELAY_MS);

        const index = MOCKED_USERS.findIndex(u => u.id === userId);
        if (index === -1) {
            throw new Error(`Usuário com ID ${userId} não encontrado para exclusão.`);
        }

        MOCKED_USERS.splice(index, 1);
    }
}

export const userService = new UserService();