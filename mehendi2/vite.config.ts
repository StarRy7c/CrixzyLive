import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // load .env variables for the current mode (safe fallback to empty string)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      // bind to all interfaces so external tunnels (ngrok) can reach the dev server
      host: true, // equivalent to '0.0.0.0'

      // allow ngrok subdomains during dev; keep strict if you want
      allowedHosts: ['*.ngrok-free.app'],
      // allowedHosts: true, // <-- alternative: allow all hosts
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },

    build: {
      // IMPORTANT for shared hosts (Hostinger) — generates relative asset paths
      base: './',

      // raise chunk warning threshold (optional)
      chunkSizeWarningLimit: 1000,

      // helps when dependencies mix ESM and CJS
      commonjsOptions: {
        transformMixedEsModules: true
      },

      rollupOptions: {
        // ensure dependencies are bundled (not accidentally externalized)
        external: [],

        output: {
          // put all node_modules into one vendor chunk to avoid inter-chunk resolution issues
          manualChunks(id) {
            if (id.includes('node_modules')) return 'vendor';
          }
        }
      }
    }
  };
});
