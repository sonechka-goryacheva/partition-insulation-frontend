import "./PartitionTilesPage.css";
import { useEffect } from "react";
import type { FC } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PartitionRwFilter } from "../components/PartitionRwFilter";
import { PartitionCard } from "../components/PartitionCard";
import { ROUTES } from "../Routes";
import type { AppDispatch } from "../store";
import {
  deletePartitionSystem,
  getPartitionSystemsList,
  setPartitionRwFromAction,
  setPartitionRwToAction,
  usePartitionError,
  usePartitionLoading,
  usePartitionRwFrom,
  usePartitionRwTo,
  usePartitionSystems,
} from "../slices/partitionSystemsSlice";
import { usePartitionIsAuthenticated } from "../slices/partitionUserSlice";
import type { PartitionSystem } from "../modules/partitionTypes";
import { PARTITION_RW_MAX, PARTITION_RW_MIN } from "../modules/partitionMock";

// Страница «Плитка конструкций»: тёмная шапка с фильтром по Rw и карточки в две колонки.
// Список загружается из веб-сервиса через thunk getPartitionSystemsList,
// значения фильтра хранятся в Redux и сохраняются при переходе в ленту и обратно
export const PartitionTilesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const rwFrom = usePartitionRwFrom();
  const rwTo = usePartitionRwTo();
  const partitionSystems = usePartitionSystems();
  const loading = usePartitionLoading();
  const error = usePartitionError();
  const isAuthenticated = usePartitionIsAuthenticated();

  // при открытии страницы — запрос списка с текущим фильтром
  useEffect(() => {
    dispatch(getPartitionSystemsList()); // отправляем thunk
  }, [dispatch]);

  const handleFilter = () => {
    dispatch(getPartitionSystemsList());
  };

  // «Удалить» у своей конструкции: подтверждение, затем thunk deletePartitionSystem
  const handleDelete = (partitionSystem: PartitionSystem) => {
    if (window.confirm(`Удалить конструкцию «${partitionSystem.partitionName}»?`)) {
      dispatch(deletePartitionSystem(partitionSystem.partitionSystemId));
    }
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
          setRwFrom={(value) => dispatch(setPartitionRwFromAction(value))}
          setRwTo={(value) => dispatch(setPartitionRwToAction(value))}
          onSubmit={handleFilter}
          loading={loading}
        />
      </header>

      <section className="partitionCatalog">
        <div className="partitionGrid">
          {error && <p className="partitionEmptyMessage">{error}</p>}
          {!loading && !error && !partitionSystems.length && (
            <p className="partitionEmptyMessage">Конструкций с таким индексом Rw не найдено.</p>
          )}
          {partitionSystems.map((partitionSystem) => (
            <PartitionCard
              key={partitionSystem.partitionSystemId}
              partitionName={partitionSystem.partitionName}
              partitionThicknessMm={partitionSystem.partitionThicknessMm}
              soundIndexRw={partitionSystem.soundIndexRw}
              partitionPhotoUrl={partitionSystem.partitionPhotoUrl}
              partitionLikesCount={partitionSystem.partitionLikesCount}
              partitionIsLiked={isAuthenticated && partitionSystem.partitionIsLiked === 1}
              onClick={() => handleCardClick(partitionSystem.partitionSystemId)}
              // признак для удаления: своя конструкция (partitionIsMine = 1) и выполнен вход
              onDelete={
                isAuthenticated && partitionSystem.partitionIsMine === 1
                  ? () => handleDelete(partitionSystem)
                  : undefined
              }
              deleteDisabled={loading}
            />
          ))}
        </div>
      </section>
    </>
  );
};
