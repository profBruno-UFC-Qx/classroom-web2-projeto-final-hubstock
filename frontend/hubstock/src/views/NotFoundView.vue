<template>
  <div class="not-found-container">
    <div class="status-code">404</div>
    <h1>Página Não Encontrada</h1>
    <p>Ops! Parece que você se perdeu. A rota que você tentou acessar não existe no HubStock.</p>
    
    <router-link to="/" class="btn-home">Voltar para a Página Inicial</router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  background-color: #f4f4f4;
  color: #333;
}

.status-code {
  font-size: 8em;
  font-weight: bold;
  color: #dc3545;
  line-height: 1.1;
  margin-bottom: 10px;
}

h1 {
  font-size: 2em;
  margin-bottom: 15px;
}

p {
  font-size: 1.1em;
  margin-bottom: 30px;
  max-width: 600px;
}

.btn-home {
  display: inline-block;
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-home:hover {
  background-color: #0056b3;
}
</style>