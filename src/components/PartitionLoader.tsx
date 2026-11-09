import "./PartitionLoader.css";
import type { FC } from "react";
import { Spinner } from "react-bootstrap";
import { usePartitionLoading } from "../slices/partitionSystemsSlice";
import { usePartitionCreateLoading } from "../slices/partitionCreateSlice";

// Пока выполняется запрос к веб-сервису (loading в Redux) — спиннер поверх экрана
export const PartitionLoader: FC = () => {
  const partitionSystemsLoading = usePartitionLoading();
  const partitionCreateLoading = usePartitionCreateLoading();
  const loading = partitionSystemsLoading || partitionCreateLoading;
  if (!loading) return null;
  return (
    <div className="partitionLoader" role="status" aria-label="Загрузка">
      <Spinner animation="border" className="partitionLoaderSpinner" />
    </div>
  );
};
