import "./PartitionTilesPage.css";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PartitionRwFilter } from "../components/PartitionRwFilter";
import { PartitionCard } from "../components/PartitionCard";
import { ROUTES } from "../Routes";
import type { PartitionOutletContext } from "../AppLayout";
import {
  PARTITION_RW_MAX,
  PARTITION_RW_MIN,
  PARTITION_SYSTEMS_MOCK,
  getPartitionSystemsMock,
} from "../modules/partitionMock";

// Страница «Плитка конструкций»: тёмная шапка с фильтром по Rw и карточки в две колонки
export const PartitionTilesPage: FC = () => {
  const [rwFrom, setRwFrom] = useState(PARTITION_RW_MIN);
  const [rwTo, setRwTo] = useState(PARTITION_RW_MAX);
  const [partitionSystemsList, setPartitionSystemsList] = useState(PARTITION_SYSTEMS_MOCK);
  const { setPartitionSystems } = useOutletContext<PartitionOutletContext>();
  const navigate = useNavigate();

  // При открытии плитки общий список для ленты — вся mock-коллекция
  useEffect(() => {
    setPartitionSystems(PARTITION_SYSTEMS_MOCK);
  }, [setPartitionSystems]);

  const handleFilter = () => {
    const filtered = getPartitionSystemsMock(rwFrom, rwTo);
    setPartitionSystemsList(filtered);
    setPartitionSystems(filtered);
  };

  const handleCardClick = (partitionSystemId: number) => {
    navigate(`${ROUTES.PARTITION_FEED}/${partitionSystemId}`);
  };

  return (
    <>
      <header className="partitionHeader">
        <h1 className="partitionHeaderTitle">Каталог перегородок</h1>
        <PartitionRwFilter
          rwFrom={rwFrom}
          rwTo={rwTo}
          rwMin={PARTITION_RW_MIN}
          rwMax={PARTITION_RW_MAX}
          setRwFrom={setRwFrom}
          setRwTo={setRwTo}
          onSubmit={handleFilter}
        />
      </header>

      <section className="partitionCatalog">
        <div className="partitionGrid">
          {!partitionSystemsList.length && (
            <p className="partitionEmptyMessage">Конструкций с таким индексом Rw не найдено.</p>
          )}
          {partitionSystemsList.map((partitionSystem) => (
            <PartitionCard
              key={partitionSystem.partitionSystemId}
              partitionName={partitionSystem.partitionName}
              partitionThicknessMm={partitionSystem.partitionThicknessMm}
              soundIndexRw={partitionSystem.soundIndexRw}
              partitionPhotoUrl={partitionSystem.partitionPhotoUrl}
              partitionLikesCount={partitionSystem.partitionLikesCount}
              onClick={() => handleCardClick(partitionSystem.partitionSystemId)}
            />
          ))}
        </div>
      </section>
    </>
  );
};
