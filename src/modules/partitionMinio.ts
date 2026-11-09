import type { PartitionSystem } from "./partitionTypes";

// Второй маршрут прокси Vite (vite.config.ts): /partition-minio → http://localhost:9000
const PARTITION_MINIO_PROXY = "/partition-minio";

// Подписанная ссылка MinIO http://localhost:9000/<бакет>/<файл>?X-Amz-...
// → /partition-minio/<бакет>/<файл>?X-Amz-... (тот же путь и подпись, но через прокси)
export const toPartitionMinioProxyUrl = (url: string | null): string | null => {
  if (!url || !/^https?:\/\//.test(url)) return url; // null или локальный файл mock — без изменений
  const minioUrl = new URL(url);
  return `${PARTITION_MINIO_PROXY}${minioUrl.pathname}${minioUrl.search}`;
};

// Фото и видео конструкции из ответа веб-сервиса — через прокси
export const withPartitionMinioProxy = (partitionSystem: PartitionSystem): PartitionSystem => ({
  ...partitionSystem,
  partitionPhotoUrl: toPartitionMinioProxyUrl(partitionSystem.partitionPhotoUrl),
  partitionVideoUrl: toPartitionMinioProxyUrl(partitionSystem.partitionVideoUrl),
});
