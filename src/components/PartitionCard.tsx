import "./PartitionCard.css";
import type { FC, MouseEvent } from "react";
import { Card } from "react-bootstrap";
import { PARTITION_DEFAULT_PHOTO } from "../modules/partitionDefaults";

interface Props {
  partitionName: string;
  partitionThicknessMm: number | null;
  soundIndexRw: number | null;
  partitionPhotoUrl: string | null;
  partitionLikesCount: number;
  partitionIsLiked?: boolean; // пользователь поставил лайк — сердце закрашено
  onClick: () => void;
  onDelete?: () => void; // есть только у своих конструкций после входа
  deleteDisabled?: boolean; // идёт запрос — кнопка недоступна
}

// Карточка конструкции в плитке: фото, название, толщина и Rw, лайки; клик — переход в ленту.
// У своей конструкции после входа — кнопка удаления «×» в левом верхнем углу фото
export const PartitionCard: FC<Props> = ({
  partitionName,
  partitionThicknessMm,
  soundIndexRw,
  partitionPhotoUrl,
  partitionLikesCount,
  partitionIsLiked = false,
  onClick,
  onDelete,
  deleteDisabled = false,
}) => {
  // нажатие «Удалить» не должно открывать ленту
  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete?.();
  };

  return (
    <Card className="partitionCard" onClick={onClick}>
      <div className="partitionCardImageBox">
        <Card.Img
          className="partitionCardImage"
          variant="top"
          src={partitionPhotoUrl || PARTITION_DEFAULT_PHOTO}
          alt={partitionName}
          onError={(event) => {
            // Файл фото не загрузился — тоже показываем изображение по умолчанию
            if (!event.currentTarget.src.endsWith(PARTITION_DEFAULT_PHOTO)) {
              event.currentTarget.src = PARTITION_DEFAULT_PHOTO;
            }
          }}
        />
        {onDelete && (
          <button
            type="button"
            className="partitionCardDelete"
            onClick={handleDelete}
            disabled={deleteDisabled}
            aria-label={`Удалить «${partitionName}»`}
            title="Удалить"
          >
            ×
          </button>
        )}
      </div>
      <span className="partitionCardMarker" />
      <Card.Body className="partitionCardBody">
        <Card.Title className="partitionCardName">{partitionName}</Card.Title>
        <Card.Text className="partitionCardSpecs">
          {partitionThicknessMm} мм · Rw {soundIndexRw} дБ
        </Card.Text>
        <span className="partitionCardLikes">
          <svg className="partitionCardHeart" viewBox="0 0 24 24" fill={partitionIsLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M12 20s-7-4.6-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7c0 4.7-7 9.3-7 9.3z" />
          </svg>
          {partitionLikesCount}
        </span>
      </Card.Body>
    </Card>
  );
};
