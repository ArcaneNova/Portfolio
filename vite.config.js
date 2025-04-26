import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables from .env file
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
    
    // Define environment variables
    define: {
      // Expose environment variables to client-side code
      __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL || '/api'),
    },
    
    // Server configuration
    server: {
      // Proxy API requests during development
      proxy: {
        // Proxy all API requests to the local dev server
        '/api': {
          target: 'http://localhost:8888',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});
