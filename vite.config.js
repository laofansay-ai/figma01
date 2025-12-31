import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 优化构建输出用于 Cloudflare Pages
    outDir: 'dist',
    sourcemap: false, // 生产环境不生成 sourcemap 以减少构建时间
    rollupOptions: {
      output: {
        // 手动分块以优化加载性能
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    // 启用 gzip 压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true
      }
    }
  },
  // 开发服务器配置
  server: {
    port: 3000,
    host: true // 允许外部访问
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    host: true
  }
})
