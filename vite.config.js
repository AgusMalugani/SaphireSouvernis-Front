/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { parseClientEnv } from './src/config/parseClientEnv.js';

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd(), '');

  parseClientEnv({
    VITE_API_URL: viteEnv.VITE_API_URL,
    VITE_SHOP_URL: viteEnv.VITE_SHOP_URL,
    VITE_LOGO_URL: viteEnv.VITE_LOGO_URL,
    VITE_WHATSAPP_NUM: viteEnv.VITE_WHATSAPP_NUM,
  });

  return {
    plugins: [react(), tailwindcss()],
    test: {
      environment: 'node',
      globals: false,
    },
  };
});
