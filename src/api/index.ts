import { Api } from "./Api";

// Экземпляр сгенерированного клиента. Пути в Api.ts уже начинаются с /api,
// поэтому baseURL пустой: запросы идут на тот же адрес localhost:3000 и через прокси Vite
export const api = new Api({
  baseURL: "",
});
