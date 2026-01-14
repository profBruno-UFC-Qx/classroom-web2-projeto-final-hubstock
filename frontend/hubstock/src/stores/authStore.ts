import { defineStore } from 'pinia';
import { useUserStore } from './userStore';
import { useMesaStore } from './mesaStore';
import { useProductStore } from './productStore';
import { useReportStore } from './reportStore';
import api from '@/services/ApiService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // pega o que ja tava salvo no navegador ou deixa vazio
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    estaAutenticado: (state) => !!state.token,
    isSuperAdmin: (state) => state.usuario?.papel === 'SUPERADMINISTRADOR',
    isAdmin: (state) => state.usuario?.papel === 'ADMINISTRADOR',
    isGarcom: (state) => state.usuario?.papel === 'GARCOM',
  },

  actions: {
    async login(email: string, senha: string) {
      try {
        const { data } = await api.post('/login', { email, senha });

        // guarda o token e os dados do user na store e no storage
        this.token = data.token;
        this.usuario = data.usuario;

        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        return { sucesso: true };
      } catch (error: any) {
        return {
          sucesso: false,
          erro: error.response?.data?.erro || "Deu erro ao logar"
        };
      }
    },

    logout() {
      // limpa tudo que é da autenticação
      this.token = null;
      this.usuario = null;
      localStorage.clear(); // limpa o storage

      // reseta todas as outras stores
      useUserStore().reset();
      useProductStore().reset();
      useMesaStore().reset();
      useReportStore().reset();
    },

    // ve se o usuario logado pode entrar na rota
    hasRequiredRole(papelNecessario: string): boolean {
      const meuPapel = this.usuario?.papel;

      if (!meuPapel) return false;
      if (meuPapel === 'SUPERADMINISTRADOR') return true; // super manda em tudo

      // se for admin, ele pode ver coisa de garçom também
      if (meuPapel === 'ADMINISTRADOR') {
        return papelNecessario === 'ADMINISTRADOR' || papelNecessario === 'GARCOM';
      }

      // se for garçom, so vê coisa de garçom
      return meuPapel === papelNecessario;
    }
  },
});