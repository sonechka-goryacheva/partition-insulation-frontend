import { Api } from "./Api";

// Экземпляр сгенерированного клиента. Пути в Api.ts уже начинаются с /api
// (от корня origin, не от base Pages), поэтому baseURL пустой:
// локально запросы идут на localhost:3000 и через прокси Vite.
// На GitHub Pages /api недоступен — гость получает mock-коллекцию.
export const api = new Api({
  baseURL: "",
});
