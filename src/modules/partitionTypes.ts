// Типы конструкции перегородки: поля совпадают с ответом веб-сервиса
// (GET /api/partitions, GET /api/partitions/feed), пустые значения — null

// Атрибут конструкции: наименование и единица из справочника + значение
export interface PartitionSystemAttribute {
  partitionAttributeId: number;
  partitionAttributeName: string;
  partitionAttributeUnit: string | null;
  partitionAttributeValue: string;
}

// Карточка конструкции перегородки
export interface PartitionSystem {
  partitionSystemId: number;
  partitionName: string;
  partitionDescription: string | null;
  partitionThicknessMm: number | null;
  soundIndexRw: number | null;
  partitionPhotoUrl: string | null;
  partitionVideoUrl: string | null;
  partitionLikesCount: number;
  partitionIsLiked: 0 | 1;
  partitionIsMine: 0 | 1;
  partitionAttributes: PartitionSystemAttribute[];
}
