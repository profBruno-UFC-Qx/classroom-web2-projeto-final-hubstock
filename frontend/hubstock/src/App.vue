<template>
  <AppHeader v-if="$route.name !== 'Login' && $route.name !== 'NotFound'" />

  <main class="content">
    <router-view />
  </main>
  
  <AppFooter v-if="$route.name !== 'Login' && $route.name !== 'NotFound'" />
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
    flex-grow: 1;
}
</style>