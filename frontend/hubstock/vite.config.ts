import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const HUBSTOCK_PRIMARY_COLOR = '#42b983';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // Modifica a variável principal do Ant Design
          'primary-color': HUBSTOCK_PRIMARY_COLOR,
          // Opcional: Modificar o fundo do layout, caso não seja tratado por CSS
          // 'layout-body-background': '#f0f2f5', 
        },
        // Configuração necessária para o Ant Design funcionar com Less
        javascriptEnabled: true,
      }
    }
  }
})
