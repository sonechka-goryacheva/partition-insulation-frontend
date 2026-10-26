// Маршруты приложения и подписи пунктов нижнего меню
export const ROUTES = {
  PARTITION_FEED: "/partition-feed",
  PARTITION_CREATE: "/partition-create",
  PARTITION_TILES: "/",
  PARTITION_LOGIN: "/partition-login",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  PARTITION_FEED: "Лента",
  PARTITION_CREATE: "Добавить",
  PARTITION_TILES: "Плитка",
  PARTITION_LOGIN: "Войти",
};
