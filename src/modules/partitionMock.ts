import type { PartitionSystem } from "./partitionTypes";

// Mock-коллекция конструкций перегородок: те же конструкции, что в ЛР-2
// (названия, тип, индекс Rw, описания, лайки, фото и видео из MinIO, бакет partitions).
// В ЛР-5 карточки берутся только отсюда, без веб-сервиса, БД и MinIO:
// фото и видео скопированы в проект (public/partition-media);
// null — будет показано изображение или видео по умолчанию
export const PARTITION_SYSTEMS_MOCK: PartitionSystem[] = [
  {
    partitionSystemId: 1,
    partitionName: "Базовая 1",
    partitionDescription:
      "Каркасная перегородка на одинарном металлическом каркасе с заполнением звукопоглощающим материалом. Применяется для межкомнатных перегородок в жилых и офисных помещениях.",
    partitionThicknessMm: 125,
    soundIndexRw: 52,
    partitionPhotoUrl: "/partition-media/bazovaya-1.png",
    partitionVideoUrl: "/partition-media/bazovaya-1.mp4",
    partitionLikesCount: 3,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "42" },
      { partitionAttributeId: 2, partitionAttributeName: "Предел огнестойкости", partitionAttributeUnit: null, partitionAttributeValue: "EI 60" },
      { partitionAttributeId: 3, partitionAttributeName: "Материал обшивки", partitionAttributeUnit: null, partitionAttributeValue: "ГКЛ 2×12,5 мм" },
      { partitionAttributeId: 4, partitionAttributeName: "Заполнение", partitionAttributeUnit: null, partitionAttributeValue: "Минеральная вата 50 мм" },
      { partitionAttributeId: 5, partitionAttributeName: "Тип каркаса", partitionAttributeUnit: null, partitionAttributeValue: "Одинарный металлический ПС 75" },
    ],
  },
  {
    partitionSystemId: 2,
    partitionName: "Стандарт М1",
    partitionDescription:
      "Каркасная перегородка с усиленной обшивкой из звукоизоляционных панелей. Обеспечивает повышенную защиту от воздушного шума между помещениями.",
    partitionThicknessMm: 150,
    soundIndexRw: 60,
    partitionPhotoUrl: "/partition-media/standart-m1.png",
    partitionVideoUrl: "/partition-media/standart-m1.mp4",
    partitionLikesCount: 2,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "55" },
      { partitionAttributeId: 3, partitionAttributeName: "Материал обшивки", partitionAttributeUnit: null, partitionAttributeValue: "Звукоизоляционные панели + ГКЛ" },
      { partitionAttributeId: 4, partitionAttributeName: "Заполнение", partitionAttributeUnit: null, partitionAttributeValue: "Минеральная вата 100 мм" },
      { partitionAttributeId: 5, partitionAttributeName: "Тип каркаса", partitionAttributeUnit: null, partitionAttributeValue: "Металлический ПС 100" },
    ],
  },
  {
    partitionSystemId: 3,
    partitionName: "Газобетон D500",
    partitionDescription:
      "Перегородка из газобетонных блоков плотностью D500 толщиной 200 мм с двусторонней штукатуркой. Сочетает звукоизоляцию и высокий предел огнестойкости.",
    partitionThicknessMm: 200,
    soundIndexRw: 53,
    partitionPhotoUrl: null,
    partitionVideoUrl: null,
    partitionLikesCount: 0,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [],
  },
  {
    partitionSystemId: 4,
    partitionName: "Профи М1",
    partitionDescription:
      "Перегородка на двойном разнесённом каркасе увеличенной толщины. Применяется в студиях звукозаписи и переговорных комнатах повышенной приватности.",
    partitionThicknessMm: 250,
    soundIndexRw: 74,
    partitionPhotoUrl: "/partition-media/profi-m1.png",
    partitionVideoUrl: "/partition-media/profi-m1.mp4",
    partitionLikesCount: 3,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "68" },
      { partitionAttributeId: 2, partitionAttributeName: "Предел огнестойкости", partitionAttributeUnit: null, partitionAttributeValue: "EI 90" },
      { partitionAttributeId: 3, partitionAttributeName: "Материал обшивки", partitionAttributeUnit: null, partitionAttributeValue: "ГКЛ 2×12,5 мм" },
      { partitionAttributeId: 4, partitionAttributeName: "Заполнение", partitionAttributeUnit: null, partitionAttributeValue: "Минеральная вата 2×100 мм" },
      { partitionAttributeId: 5, partitionAttributeName: "Тип каркаса", partitionAttributeUnit: null, partitionAttributeValue: "Двойной разнесённый металлический" },
    ],
  },
];

// Границы слайдеров фильтра, как в ЛР-2: от 0 до наибольшего Rw в коллекции
export const PARTITION_RW_MIN = 0;
export const PARTITION_RW_MAX = Math.max(
  ...PARTITION_SYSTEMS_MOCK.map((partitionSystem) => partitionSystem.soundIndexRw ?? 0),
);

// Фильтр mock-коллекции по индексу звукоизоляции Rw — как GET /api/partitions?rwFrom&rwTo:
// конструкции без Rw в результат не попадают
export const getPartitionSystemsMock = (rwFrom: number, rwTo: number): PartitionSystem[] =>
  PARTITION_SYSTEMS_MOCK.filter(
    (partitionSystem) =>
      partitionSystem.soundIndexRw !== null &&
      partitionSystem.soundIndexRw >= rwFrom &&
      partitionSystem.soundIndexRw <= rwTo,
  );

// Конструкция по id — как GET /api/partitions/feed/{id}; undefined — нет в коллекции
export const getPartitionSystemByIdMock = (partitionSystemId: number): PartitionSystem | undefined =>
  PARTITION_SYSTEMS_MOCK.find((partitionSystem) => partitionSystem.partitionSystemId === partitionSystemId);
