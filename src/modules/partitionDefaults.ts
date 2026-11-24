// Файл из public/ с префиксом base (локально и на GitHub Pages — /partition-insulation-frontend/)
export const partitionPublicUrl = (file: string) => `${import.meta.env.BASE_URL}${file}`;

// Фото и видео по умолчанию (те же, что в ЛР-2): файлы лежат в папке public проекта
// и подставляются, если поле конструкции пустое или файл не загрузился
export const PARTITION_DEFAULT_PHOTO = partitionPublicUrl("default-partition.svg");
export const PARTITION_DEFAULT_VIDEO = partitionPublicUrl("default-partition.mp4");
