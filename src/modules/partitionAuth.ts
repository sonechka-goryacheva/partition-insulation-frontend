import axios from "axios";
import type { PartitionUserResponseDto } from "../api/Api";

// Авторизация и деавторизация — только axios, без кодогенерации и thunk (по заданию ЛР-6).
// Запросы идут через прокси Vite; сессия хранится в куке partitionSessionId (httpOnly),
// которую ставит и очищает веб-сервис

// POST /api/partition-users/login — вход: в ответе данные пользователя, кука ставится сервером
export const loginPartitionUser = async (
  partitionUserLogin: string,
  partitionUserPassword: string,
): Promise<PartitionUserResponseDto> => {
  const response = await axios.post<PartitionUserResponseDto>("/api/partition-users/login", {
    partitionUserLogin,
    partitionUserPassword,
  });
  return response.data;
};

// POST /api/partition-users/logout — выход: сервер удаляет сессию и очищает куку
export const logoutPartitionUser = async (): Promise<void> => {
  await axios.post("/api/partition-users/logout");
};
