import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// vite.config.ts — ESM, __dirname нет: нужен для path.resolve, как в методичке
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // vite-plugin-mkcert не в списке плагинов: он вызывает Go-mkcert (-CAROOT),
    // а сертификат выпущен npm-пакетом mkcert (create-ca / create-cert) и читается в server.https
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Звукоизоляция перегородок',
        short_name: 'Перегородки',
        description: 'Каталог конструкций звукоизоляции перегородок',
        start_url: '/partition-insulation-frontend/',
        scope: '/partition-insulation-frontend/',
        display: 'standalone',
        background_color: '#141416',
        theme_color: '#EE4623',
        lang: 'ru',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'partition-icon-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: 'partition-icon-512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // Фото каталога и шрифты входят в кеш. Видео mp4 не кладём: ролик «Профи М1» больше лимита workbox
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
      },
    }),
  ],
  // Репозиторий GitHub Pages: https://sonechka-goryacheva.github.io/partition-insulation-frontend/
  base: "/partition-insulation-frontend/",
  server: {
    watch: {
      // нужно для hot-reload при запуске в docker: Vite сам опрашивает файлы на изменения
      usePolling: true,
    },
    host: true, // слушать все интерфейсы, чтобы работал проброс порта из контейнера и заход с телефона по IP
    strictPort: true, // если порт 3000 занят — ошибка, а не переход на другой порт
    port: 3000,
    // HTTPS для телефона в одной сети: сертификат mkcert (cert.key / cert.crt), CA — ca.crt
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    // Обратный прокси вместо CORS: браузер обращается только к localhost:3000
    proxy: {
      // 1) веб-сервис: /api/partitions → http://localhost:8080/api/partitions (префикс /api у бэкенда уже есть)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      // 2) хранилище S3 (MinIO): /partition-minio/<бакет>/<файл> → http://localhost:9000/<бакет>/<файл>
      '/partition-minio': {
        target: 'http://localhost:9000',
        changeOrigin: true, // Host = localhost:9000, как в подписанной ссылке MinIO
        rewrite: (path) => path.replace(/^\/partition-minio/, ''),
      },
    },
  },
})
