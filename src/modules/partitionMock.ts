import type { PartitionSystem } from "./partitionTypes";

// Mock-коллекция конструкций перегородок: в ЛР-5 карточки берутся только отсюда,
// без веб-сервиса, БД и MinIO. Фото — файлы проекта из public/partition-media,
// null — будет показано изображение или видео по умолчанию
export const PARTITION_SYSTEMS_MOCK: PartitionSystem[] = [
  {
    partitionSystemId: 1,
    partitionName: "ГКЛ на металлокаркасе ПС 75, 125 мм",
    partitionDescription:
      "Каркасная перегородка: по два листа ГКЛ 12,5 мм с каждой стороны, стойки ПС 75, в полости минеральная вата 50 мм",
    partitionThicknessMm: 125,
    soundIndexRw: 52,
    partitionPhotoUrl: "/partition-media/partition-gkl-75.svg",
    partitionVideoUrl: null,
    partitionLikesCount: 4,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "42" },
      { partitionAttributeId: 2, partitionAttributeName: "Предел огнестойкости", partitionAttributeUnit: null, partitionAttributeValue: "EI 60" },
      { partitionAttributeId: 3, partitionAttributeName: "Материал обшивки", partitionAttributeUnit: null, partitionAttributeValue: "ГКЛ 2×12,5 мм" },
      { partitionAttributeId: 4, partitionAttributeName: "Заполнение", partitionAttributeUnit: null, partitionAttributeValue: "Минеральная вата 50 мм" },
      { partitionAttributeId: 5, partitionAttributeName: "Тип каркаса", partitionAttributeUnit: null, partitionAttributeValue: "Металлический ПС 75" },
    ],
  },
  {
    partitionSystemId: 2,
    partitionName: "Газобетон D500, 120 мм",
    partitionDescription: "Газобетонные блоки D500 толщиной 100 мм с двусторонней гипсовой штукатуркой по 10 мм",
    partitionThicknessMm: 120,
    soundIndexRw: 41,
    partitionPhotoUrl: "/partition-media/partition-aerated-100.svg",
    partitionVideoUrl: null,
    partitionLikesCount: 1,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "80" },
      { partitionAttributeId: 2, partitionAttributeName: "Предел огнестойкости", partitionAttributeUnit: null, partitionAttributeValue: "EI 180" },
    ],
  },
  {
    partitionSystemId: 3,
    partitionName: "Газобетон D600, 230 мм",
    partitionDescription: "Газобетонные блоки D600 толщиной 200 мм с двусторонней штукатуркой по 15 мм",
    partitionThicknessMm: 230,
    soundIndexRw: 49,
    partitionPhotoUrl: "/partition-media/partition-aerated-200.svg",
    partitionVideoUrl: null,
    partitionLikesCount: 2,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "165" },
      { partitionAttributeId: 2, partitionAttributeName: "Предел огнестойкости", partitionAttributeUnit: null, partitionAttributeValue: "EI 240" },
    ],
  },
  {
    partitionSystemId: 4,
    partitionName: "Кирпич полнотелый в полкирпича, 150 мм",
    partitionDescription: "Кладка из полнотелого керамического кирпича 120 мм с двусторонней цементно-песчаной штукатуркой",
    partitionThicknessMm: 150,
    soundIndexRw: 50,
    partitionPhotoUrl: "/partition-media/partition-brick-120.svg",
    partitionVideoUrl: null,
    partitionLikesCount: 3,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "260" },
      { partitionAttributeId: 2, partitionAttributeName: "Предел огнестойкости", partitionAttributeUnit: null, partitionAttributeValue: "REI 150" },
    ],
  },
  {
    partitionSystemId: 5,
    partitionName: "ГКЛ на двойном каркасе, 205 мм",
    partitionDescription:
      "Два независимых каркаса ПС 75 с зазором 5 мм, по два листа ГКЛ 12,5 мм с каждой стороны, минеральная вата 50 мм в каждом каркасе",
    partitionThicknessMm: 205,
    soundIndexRw: 62,
    partitionPhotoUrl: null,
    partitionVideoUrl: null,
    partitionLikesCount: 5,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [
      { partitionAttributeId: 1, partitionAttributeName: "Поверхностная масса", partitionAttributeUnit: "кг/м²", partitionAttributeValue: "50" },
      { partitionAttributeId: 3, partitionAttributeName: "Материал обшивки", partitionAttributeUnit: null, partitionAttributeValue: "ГКЛ 2×12,5 мм" },
      { partitionAttributeId: 4, partitionAttributeName: "Заполнение", partitionAttributeUnit: null, partitionAttributeValue: "Минеральная вата 2×50 мм" },
      { partitionAttributeId: 5, partitionAttributeName: "Тип каркаса", partitionAttributeUnit: null, partitionAttributeValue: "Двойной металлический ПС 75" },
    ],
  },
  {
    partitionSystemId: 6,
    partitionName: "Кирпич полнотелый в один кирпич, 250 мм",
    partitionDescription: "Кладка из полнотелого керамического кирпича толщиной 250 мм без штукатурки",
    partitionThicknessMm: 250,
    soundIndexRw: 54,
    partitionPhotoUrl: null,
    partitionVideoUrl: null,
    partitionLikesCount: 0,
    partitionIsLiked: 0,
    partitionIsMine: 0,
    partitionAttributes: [],
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
