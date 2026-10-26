import { useState } from "react";
import type { FC } from "react";
import { Outlet } from "react-router-dom";
import type { PartitionSystem } from "./modules/partitionTypes";
import { PARTITION_SYSTEMS_MOCK } from "./modules/partitionMock";
import { PartitionTabBar } from "./components/PartitionTabBar";
import "./MobileApp.css";

// Общий список конструкций для страниц: плитка обновляет его после фильтра,
// лента берёт из него порядок для кнопки «Далее»
export interface PartitionOutletContext {
  partitionSystems: PartitionSystem[];
  setPartitionSystems: (partitionSystems: PartitionSystem[]) => void;
}

export const AppLayout: FC = () => {
  const [partitionSystems, setPartitionSystems] = useState<PartitionSystem[]>(PARTITION_SYSTEMS_MOCK);

  return (
    <main className="partitionScreen">
      <Outlet context={{ partitionSystems, setPartitionSystems }} />
      <PartitionTabBar partitionSystems={partitionSystems} />
    </main>
  );
};
