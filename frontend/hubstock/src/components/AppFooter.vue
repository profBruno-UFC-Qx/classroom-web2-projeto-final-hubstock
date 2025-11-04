<template>
    <footer class="app-footer">
        <p>&copy; {{ currentYear }} HubStock - Gerenciamento de Estoque. </p>
    </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
/* Estilos para o Rodapé (Footer) */
.app-footer {
    text-align: center;
    background-color: #f8f8f8;
    color: #777;
    border-top: 1px solid #eee;
    font-size: 0.9em;
    width: 100%;
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}
</style>