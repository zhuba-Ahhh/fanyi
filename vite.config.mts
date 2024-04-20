import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  envDir: './env',
  plugins: [react(), tsconfigPaths(), svgrPlugin(), visualizer()],
  server: {
    proxy: {
      '/api': {
        target: 'https://openapi.youdao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // 单位 kb
  },
});
