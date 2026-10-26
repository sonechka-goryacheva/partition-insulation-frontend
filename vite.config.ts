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
  },
})
