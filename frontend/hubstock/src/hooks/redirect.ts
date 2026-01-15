import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

export function redirectToUser() {
    const authStore = useAuthStore();
    
    switch (authStore.usuario?.papel) {
        case 'SUPERADMINISTRADOR':
            router.push({ name: 'DashboardSuperAdmin' });
            break;
        case 'ADMINISTRADOR':
            router.push({ name: 'Dashboard' });
            break;
        case 'GARCOM':
            router.push({ name: 'MesaSelection' });
            break;
        default:
            router.push({ name: 'Home' });
    }
}
