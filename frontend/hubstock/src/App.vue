<template>
  <template v-if="$route.name === 'Login' || $route.name === 'NotFound' || $route.name === 'Home' || $route.name === 'RestauranteCadastro'">
    <router-view />
  </template>
  <template v-else>
    <AppLayout />
  </template>
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
</script>