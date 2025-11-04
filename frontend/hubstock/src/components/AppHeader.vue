<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/" class="logo-link">
        <span class="hub">Hub</span><span class="stock">Stock</span>
      </router-link>
    </div>
    
    <nav v-if="authStore.isAuthenticated" class="main-nav">
      <router-link to="/dashboard" active-class="active">Dashboard</router-link>
      <router-link v-if="authStore.isAdmin" to="/admin" active-class="active">Painel Admin</router-link>
    </nav>

    <div class="user-info" v-if="authStore.isAuthenticated">
      <span><strong>{{ authStore.userName }}</strong></span>
      <button @click="handleLogout" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
    
    <div v-else class="user-info">
        <router-link to="/login" class="login-link">Fazer Login</router-link>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

/**
 * Realiza o logout e redireciona para a tela de Login.
 */
function handleLogout() {
  authStore.logout();
  router.push({ name: 'Login' });
}
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-link {
    text-decoration: none;
}

.hub {
    font-size: 1.5em;
    font-weight: bold;
    color: #42b983;
}
.stock {
    font-size: 1.5em;
    font-weight: bold;
    color: white;
}

.main-nav a {
  color: white;
  text-decoration: none;
  margin-left: 20px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.main-nav a:hover {
  background-color: #3a5068;
}

.main-nav a.active {
    background-color: #42b983;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.login-link {
    color: #42b983;
    text-decoration: none;
    font-weight: bold;
}
</style>