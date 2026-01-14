<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="title">Cadastre seu Restaurante</h1>
      <p class="subtitle">Comece a gerenciar seu estoque e equipe agora mesmo.</p>
    </div>

    <div class="content-section">
      <div v-if="authStore.estaAutenticado" class="welcome-message">
        <p>Você já está logado. Redirecionando para seu painel...</p>
      </div>

      <div class="login-box">
        <h3 class="login-title">Dados do Restaurante</h3>

        <form @submit.prevent="handleSubmit" class="login-form">

          <div class="input-group">
            <label for="restaurante-name" class="label-forms">Nome do restaurante</label>
            <input type="text" id="restaurante-name" v-model="formulario.nomeRestaurante"
              placeholder="Ex: Autêntica Comida Caseira" required />
          </div>
          <div class="input-group">
            <label for="cnpj" class="label-forms">CNPJ</label>
            <input type="text" id="cnpj" v-model="formulario.cnpjRestaurante" placeholder="12.345.678/0001-90"
              required />
          </div>
          <div class="input-group">
            <label for="logo-url" class="label-forms">URL da Logo</label>
            <input type="url" id="logo-url" v-model="formulario.urlImagemPerfilRestaurante"
              placeholder="Ex: https://i.imgur.com/logo.png" required />
          </div>

          <div class="input-group">
            <label for="quantidade-mesas" class="label-forms">Quantidade de Mesas Inicial</label>
            <input type="number" id="quantidade-mesas" v-model.number="formulario.quantidadeMesas" min="1" max="100"
              placeholder="Ex: 15" required />
            <small style="color: #8c8c8c;">Você poderá adicionar mais mesas depois.</small>
          </div>

          <a-divider />
          <h3 class="login-title">Dados do Administrador</h3>

          <div class="input-group">
            <label for="admin-name" class="label-forms">Nome completo</label>
            <input type="text" id="admin-name" v-model="formulario.nomeAdministrador" placeholder="Ex: Maria Santos"
              required />
          </div>
          <div class="input-group">
            <label for="admin-email" class="label-forms">E-mail (Login)</label>
            <input type="email" id="admin-email" v-model="formulario.emailAdministrador"
              placeholder="maria.santos@email.com" required />
          </div>
          <div class="input-group">
            <label for="admin-password" class="label-forms">Senha</label>
            <input type="password" id="admin-password" v-model="formulario.senhaAdministrador"
              placeholder="**************" required />
          </div>

          <button type="submit" :disabled="isLoading" class="login-button">
            {{ isLoading ? 'Cadastrando...' : 'Cadastrar e Acessar' }}
          </button>

          <p v-if="error" class="error-message">{{ error }}</p>
        </form>

        <a-divider style="margin: 15px 0;" />
        <p class="login-link-cadastro">
          Já tem uma conta?
          <router-link to="/">Faça Login</router-link>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const { isLoading, error } = storeToRefs(userStore);

const formulario = reactive({
  nomeRestaurante: "",
  cnpjRestaurante: "",
  urlImagemPerfilRestaurante: "",
  quantidadeMesas: 10,
  nomeAdministrador: "",
  emailAdministrador: "",
  senhaAdministrador: ""
});

watch(() => formulario.cnpjRestaurante, (val) => {
  if (!val) return;

  const cleaned = val.replace(/\D/g, '');
  formulario.cnpjRestaurante = cleaned
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
});

async function handleSubmit() {
  if (formulario.senhaAdministrador.length < 4) {
    message.error('A senha deve ter pelo menos 4 caracteres.');
    return;
  }

  try {
    await userStore.registerNewRestaurantAndAdmin(formulario);

    // Tenta o login automático usando o email e senha recém criados
    const loginSuccess = await authStore.login(
      formulario.emailAdministrador,
      formulario.senhaAdministrador
    );

    if (loginSuccess) {
      message.success(`Restaurante "${formulario.nomeRestaurante}" cadastrado com sucesso!`);
      router.push({ name: 'Dashboard' });
    } else {
      message.warning("Cadastro realizado! Por favor, faça login manualmente.");
      router.push({ name: 'Login' });
    }

  } catch (err: any) {
    console.error('Erro de Cadastro:', err);
  }
}
</script>

<style scoped>
.home-container :deep(.ant-page-header) {
  padding-left: 0;
}

.home-container {
  text-align: center;
  padding-bottom: 50px;
}

.hero-section {
  background-color: #e9ecef;
  padding: 60px 20px;
  margin-bottom: 30px;
  border-bottom: 5px solid #42b983;
}

.title {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.hub {
  color: #42b983;
}

.stock {
  color: #2c3e50;
}

.subtitle {
  font-size: 1.2em;
  color: #6c757d;
}

.content-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.welcome-message {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 40px;
  background-color: white;
}

.login-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  /* Aumentado para acomodar mais campos */
  text-align: left;
}

.login-title {
  text-align: center;
  color: #42b983;
  font-weight: bold;
  font-size: 1.3em;
  margin-bottom: 15px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  text-align: start;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #38a169;
}

.login-button:disabled {
  background-color: #a0c9f1;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
}

.login-link-cadastro {
  text-align: center;
  font-size: 0.9em;
  color: #6c757d;
}

.login-link-cadastro a {
  color: #42b983;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link-cadastro a:hover {
  color: #38a169;
  text-decoration: underline;
}
</style>