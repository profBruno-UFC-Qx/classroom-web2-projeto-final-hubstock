<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="title">HubStock - Login</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        
        <div class="input-group">
          <label for="username">Usuário (Testes: admin ou garcom)</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Digite o nome de usuário" 
            required
          />
        </div>
        
        <div class="input-group">
          <label for="password">Senha (Qualquer coisa serve por enquanto)</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Digite sua senha" 
            required
          />
        </div>
        
        <button type="submit" :disabled="isLoading" class="login-button">
          {{ isLoading ? 'Acessando...' : 'Entrar' }}
        </button>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
      </form>

      <p class="mock-info">
        * Usuários de Teste: **admin** (Administrador) e **garcom** (Garçom). Senha pode ser qualquer coisa.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.login-box {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.input-group input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
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

.mock-info {
    font-size: 0.8em;
    margin-top: 20px;
    padding: 10px;
    border-top: 1px solid #eee;
    color: #6c757d;
    text-align: center;
}
</style>