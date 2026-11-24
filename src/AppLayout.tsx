import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { PartitionTabBar } from "./components/PartitionTabBar";
import { PartitionLoader } from "./components/PartitionLoader";
import "./MobileApp.css";

// Общая оболочка страниц: контент до 1200px, меню сверху и анимация загрузки.
// Данные страниц хранятся в Redux (слайс partitionSystemsSlice)
export const AppLayout: FC = () => (
  <main className="partitionScreen">
    <Outlet />
    <PartitionTabBar />
    <PartitionLoader />
  </main>
);
