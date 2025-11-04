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
      <div v-else class="login-prompt">
        <p>Faça login para começar a gerenciar seu estoque e registrar suas vendas.</p>
        <router-link to="/login" class="btn btn-primary">Fazer Login</router-link>
        <p class="small-text">Usuários de teste: `admin` ou `garcom` (senha: qualquer coisa).</p>
      </div>
      
      <div class="features">
          <h2>Recursos Principais</h2>
          <div class="feature-list">
              <div class="feature-item">
                  <h3>Vendas Rápidas</h3>
                  <p>Garçons podem registrar vendas rapidamente, atualizando o estoque em tempo real.</p>
              </div>
              <div class="feature-item">
                  <h3>Controle Total</h3>
                  <p>Administradores gerenciam produtos, categorias, entradas e relatórios.</p>
              </div>
              <div class="feature-item">
                  <h3>Estoque Inteligente</h3>
                  <p>Alertas automáticos de estoque baixo para reposição na hora certa.</p>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.home-container {
  text-align: center;
  padding-bottom: 50px;
}

.hero-section {
  background-color: #e9ecef; /* Cinza claro */
  padding: 60px 20px;
  margin-bottom: 30px;
  border-bottom: 5px solid #42b983;
}

.title {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}
.hub { color: #42b983; }
.stock { color: #2c3e50; }

.subtitle {
  font-size: 1.2em;
  color: #6c757d;
}

.content-section {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
}

.login-prompt, .welcome-message {
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-bottom: 40px;
    background-color: white;
}

.btn-primary {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-top: 15px;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #0056b3;
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

.small-text {
    margin-top: 10px;
    font-size: 0.8em;
    color: #999;
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