import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // нужно для hot-reload при запуске в docker: Vite сам опрашивает файлы на изменения
      usePolling: true,
    },
    host: true, // слушать все интерфейсы, чтобы работал проброс порта из контейнера
    strictPort: true, // если порт 3000 занят — ошибка, а не переход на другой порт
    port: 3000,
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
