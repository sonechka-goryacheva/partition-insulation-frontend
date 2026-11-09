import "./PartitionFeedPage.css";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { useDispatch, useStore } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PartitionAttributesList } from "../components/PartitionAttributesList";
import { ROUTES } from "../Routes";
import type { AppDispatch, RootState } from "../store";
import {
  getPartitionFeedItem,
  likePartitionSystem,
  usePartitionError,
  usePartitionFeedItem,
  usePartitionLoading,
} from "../slices/partitionSystemsSlice";
import { usePartitionIsAuthenticated } from "../slices/partitionUserSlice";
import { PARTITION_DEFAULT_PHOTO, PARTITION_DEFAULT_VIDEO } from "../modules/partitionDefaults";

// Страница «Лента конструкций» (подробнее о конструкции): видео или фото на весь экран,
// колонка ромбов (лайки, Rw, толщина, «Далее»), плашка с описанием и характеристиками.
// Конструкция загружается из веб-сервиса через thunk getPartitionFeedItem
export const PartitionFeedPage: FC = () => {
  const [openDescriptionId, setOpenDescriptionId] = useState<number | null>(null);
  const { partitionSystemId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();
  const navigate = useNavigate();
  const pageData = usePartitionFeedItem(); // открытая конструкция из Redux
  const loading = usePartitionLoading();
  const error = usePartitionError();
  const isAuthenticated = usePartitionIsAuthenticated();

  // id из адреса; без id (/partition-feed) — первая конструкция ленты
  const id = partitionSystemId === undefined ? undefined : Number(partitionSystemId);

  // При открытии страницы или смене id в адресе — запрос конструкции
  // (если она уже в Redux после «Далее», повторно не запрашиваем)
  useEffect(() => {
    const current = store.getState().partitionData.partitionFeedItem;
    if (id !== undefined && current?.partitionSystemId === id) return;
    dispatch(getPartitionFeedItem({ partitionSystemId: id })).then(() => {
      if (id !== undefined) return;
      // открыли /partition-feed — подставляем в адрес id первой конструкции
      const firstItem = store.getState().partitionData.partitionFeedItem;
      if (firstItem) {
        navigate(`${ROUTES.PARTITION_FEED}/${firstItem.partitionSystemId}`, { replace: true });
      }
    });
  }, [dispatch, store, navigate, id]);

  // Описание развёрнуто только у той конструкции, где нажали «Ещё»
  const isDescriptionOpen = pageData !== null && openDescriptionId === pageData.partitionSystemId;

  // Заголовок вкладки браузера — название открытой конструкции
  useEffect(() => {
    document.title = pageData ? `${pageData.partitionName} — Лента` : "Конструкция не найдена";
    return () => {
      document.title = "Звукоизоляция перегородок";
    };
  }, [pageData]);

  // «Далее» — следующая конструкция (GET /feed/{id}?next=true, после последней снова первая),
  // затем адрес страницы меняется на её id
  const handleNext = async () => {
    if (!pageData) return;
    await dispatch(getPartitionFeedItem({ partitionSystemId: pageData.partitionSystemId, next: true }));
    const nextItem = store.getState().partitionData.partitionFeedItem;
    if (nextItem) {
      navigate(`${ROUTES.PARTITION_FEED}/${nextItem.partitionSystemId}`);
    }
  };

  // Сердце закрашено, если пользователь уже поставил лайк (у гостя — всегда пустое)
  const isLiked = isAuthenticated && pageData?.partitionIsLiked === 1;

  // Лайк доступен только после входа: повторное нажатие снимает лайк
  const handleLike = () => {
    if (!pageData) return;
    dispatch(likePartitionSystem({ partitionSystemId: pageData.partitionSystemId, partitionLike: isLiked ? 0 : 1 }));
  };

  if (!pageData) {
    return (
      <>
        <header className="partitionHeader partitionHeaderBlank" />
        {!loading && <p className="partitionFeedNotFound">{error ?? "Конструкция не найдена"}</p>}
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
              <button
                type="button"
                className="partitionDiamond partitionDiamondDark partitionDiamondLike"
                onClick={handleLike}
                disabled={!isAuthenticated || loading}
                aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
                title={isAuthenticated ? undefined : "Лайки доступны после входа"}
              >
                <span className="partitionDiamondInner">
                  <svg className="partitionHeartIcon" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 20s-7-4.6-7-9.3A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7 2.7c0 4.7-7 9.3-7 9.3z" />
                  </svg>
                  <span className="partitionLikesCount">{pageData.partitionLikesCount}</span>
                </span>
              </button>
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
                disabled={loading}
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

          <div className={`partitionFeedOverlay ${isDescriptionOpen ? "partitionFeedOverlayOpen" : ""}`}>
            {error && <p className="partitionFeedError">{error}</p>}
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
