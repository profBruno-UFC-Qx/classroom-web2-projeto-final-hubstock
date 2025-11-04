<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="title">Bem-vindo ao <span class="hub">Hub</span><span class="stock">Stock</span></h1>
      <p class="subtitle">O seu gerenciador de estoque para restaurantes e bares.</p>
    </div>

    <div class="content-section">
      <div v-if="authStore.isAuthenticated" class="welcome-message">
        <p>Você já está logado como **{{ authStore.userName }} ({{ authStore.userRole }})**.</p>
        <router-link to="/dashboard" class="btn btn-primary">Ir para o Dashboard</router-link>

        <router-link v-if="authStore.isAdmin" to="/admin" class="btn btn-secondary">Ir para Painel Admin</router-link>

      </div>

      <div class="login-box">

        <form @submit.prevent="handleLogin" class="login-form">

          <div class="input-group">
            <label for="username" class="label-forms">Usuário</label>
            <input type="text" id="username" v-model="username" placeholder="admin ou garcom" required />
          </div>

          <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" v-model="password" placeholder="**************" required />
          </div>

          <button type="submit" :disabled="isLoading" class="login-button">
            {{ isLoading ? 'Acessando...' : 'Entrar' }}
          </button>

          <p v-if="error" class="error-message">{{ error }}</p>

        </form>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

async function handleLogin() {
  error.value = '';
  isLoading.value = true;

  try {
    const success = await authStore.login(username.value, password.value);

    if (success) {
      // Se o login for bem-sucedido, redireciona para o Dashboard
      const redirectTo = (router.currentRoute.value.query.redirect as string) || '/dashboard';
      router.push(redirectTo);
    } else {
      error.value = 'Usuário ou senha inválidos. Tente novamente.';
    }
  } catch (err) {
    error.value = 'Ocorreu um erro ao tentar logar.';
    console.error('Erro de Login:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.home-container {
  text-align: center;
  padding-bottom: 50px;
}

.hero-section {
  background-color: #e9ecef;
  /* Cinza claro */
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

.login-prompt,
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
  max-width: 400px;
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
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #42b9835a;
}

.login-button:disabled {
  background-color: #42b9835a;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
}

.mock-info {
  font-size: 0.8em;
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #eee;
  color: #6c757d;
  text-align: center;
}

.btn-secondary {
  display: inline-block;
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  margin-left: 10px;
}

.features h2 {
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.feature-list {
  display: flex;
  gap: 20px;
  text-align: left;
}

.feature-item {
  flex: 1;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background-color: #fcfcfc;
}

.feature-item h3 {
  color: #42b983;
  margin-bottom: 10px;
}
</style>