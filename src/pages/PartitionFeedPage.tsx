import "./PartitionFeedPage.css";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { PartitionAttributesList } from "../components/PartitionAttributesList";
import { ROUTES } from "../Routes";
import type { PartitionOutletContext } from "../AppLayout";
import { getPartitionSystemByIdMock } from "../modules/partitionMock";
import { PARTITION_DEFAULT_PHOTO, PARTITION_DEFAULT_VIDEO } from "../modules/partitionDefaults";

// Страница «Лента конструкций» (подробнее о конструкции): видео или фото на весь экран,
// колонка ромбов (лайки, Rw, толщина, «Далее»), плашка с описанием и характеристиками
export const PartitionFeedPage: FC = () => {
  const [openDescriptionId, setOpenDescriptionId] = useState<number | null>(null);
  const { partitionSystemId } = useParams();
  const { partitionSystems } = useOutletContext<PartitionOutletContext>();
  const navigate = useNavigate();

  // Конструкция из адреса: сначала в общем списке, иначе во всей mock-коллекции
  const id = Number(partitionSystemId);
  const pageData =
    partitionSystems.find((partitionSystem) => partitionSystem.partitionSystemId === id) ??
    getPartitionSystemByIdMock(id);

  // Описание развёрнуто только у той конструкции, где нажали «Ещё»
  const isDescriptionOpen = pageData !== undefined && openDescriptionId === pageData.partitionSystemId;

  // Заголовок вкладки браузера — название открытой конструкции
  useEffect(() => {
    document.title = pageData ? `${pageData.partitionName} — Лента` : "Конструкция не найдена";
    return () => {
      document.title = "Звукоизоляция перегородок";
    };
  }, [pageData]);

  // «Далее» — следующая конструкция общего списка, после последней снова первая (как в API)
  const handleNext = () => {
    if (!pageData || !partitionSystems.length) return;
    const currentIndex = partitionSystems.findIndex(
      (partitionSystem) => partitionSystem.partitionSystemId === pageData.partitionSystemId,
    );
    const nextItem = partitionSystems[(currentIndex + 1) % partitionSystems.length];
    navigate(`${ROUTES.PARTITION_FEED}/${nextItem.partitionSystemId}`);
  };

  if (!pageData) {
    return (
      <>
        <header className="partitionHeader partitionHeaderBlank" />
        <p className="partitionFeedNotFound">Конструкция не найдена</p>
      </>
    );
  }

  return (
    <>
      <header className="partitionHeader partitionHeaderBlank" />

      <section className="partitionFeed">
        {/* Есть своё видео — показываем его; нет видео, но есть фото — фото;
            нет ни того, ни другого — видео по умолчанию с фото по умолчанию в качестве обложки */}
        {pageData.partitionVideoUrl || !pageData.partitionPhotoUrl ? (
          <video
            className="partitionFeedVideo"
            src={pageData.partitionVideoUrl || PARTITION_DEFAULT_VIDEO}
            poster={pageData.partitionPhotoUrl || PARTITION_DEFAULT_PHOTO}
            autoPlay
            loop
            muted
            playsInline
            onError={(event) => {
              if (!event.currentTarget.src.endsWith(PARTITION_DEFAULT_VIDEO)) {
                event.currentTarget.src = PARTITION_DEFAULT_VIDEO;
              }
            }}
          />
        ) : (
          <img
            className="partitionFeedVideo"
            src={pageData.partitionPhotoUrl}
            alt={pageData.partitionName}
            onError={(event) => {
              if (!event.currentTarget.src.endsWith(PARTITION_DEFAULT_PHOTO)) {
                event.currentTarget.src = PARTITION_DEFAULT_PHOTO;
              }
            }}
          />
        )}

        <div className="partitionFeedBottom">
          <div className="partitionActionColumn">
            <span className="partitionDiamondBox">
              <span className="partitionDiamond partitionDiamondDark">
                <span className="partitionDiamondInner">
                  <svg className="partitionHeartIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 20s-7-4.6-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7c0 4.7-7 9.3-7 9.3z" />
                  </svg>
                  <span className="partitionLikesCount">{pageData.partitionLikesCount}</span>
                </span>
              </span>
            </span>

            <span className="partitionDiamondBox">
              <span className="partitionDiamond partitionDiamondBlack">
                <span className="partitionDiamondValue">
                  <span className="partitionDiamondCaption">Rw, дБ</span>
                  <span className="partitionDiamondNumber">{pageData.soundIndexRw}</span>
                </span>
              </span>
            </span>

            <span className="partitionDiamondBox">
              <span className="partitionDiamond partitionDiamondBlack">
                <span className="partitionDiamondValue">
                  <span className="partitionDiamondCaption">Толщ., мм</span>
                  <span className="partitionDiamondNumber">{pageData.partitionThicknessMm}</span>
                </span>
              </span>
            </span>

            <span className="partitionDiamondBox">
              <button
                type="button"
                className="partitionDiamond partitionDiamondAccent"
                onClick={handleNext}
                aria-label="Далее"
              >
                <span className="partitionDiamondInner">
                  <svg className="partitionNextIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="4 8.5 12 16.5 20 8.5" />
                  </svg>
                </span>
              </button>
            </span>
          </div>

          <div className="partitionFeedOverlay">
            <h2 className="partitionFeedName">{pageData.partitionName}</h2>
            {pageData.partitionDescription && (
              <>
                <p className={`partitionDescriptionText ${isDescriptionOpen ? "partitionDescriptionTextOpen" : ""}`}>
                  {pageData.partitionDescription}
                </p>
                <button
                  type="button"
                  className="partitionDescriptionMore"
                  onClick={() => setOpenDescriptionId(isDescriptionOpen ? null : pageData.partitionSystemId)}
                >
                  {isDescriptionOpen ? "Свернуть" : "Ещё"}
                </button>
              </>
            )}
            <PartitionAttributesList partitionAttributes={pageData.partitionAttributes} />
          </div>
        </div>
      </section>
    </>
  );
};
