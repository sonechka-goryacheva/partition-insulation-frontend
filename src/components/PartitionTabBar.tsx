import "./PartitionTabBar.css";
import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES, ROUTE_LABELS } from "../Routes";
import type { PartitionSystem } from "../modules/partitionTypes";

interface Props {
  partitionSystems: PartitionSystem[];
}

// Нижнее меню из 4 пунктов (иконки из ЛР-2): в ЛР-5 доступны только «Лента» и «Плитка»
export const PartitionTabBar: FC<Props> = ({ partitionSystems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname.startsWith(ROUTES.PARTITION_FEED);
  const isTiles = location.pathname === ROUTES.PARTITION_TILES;

  // «Лента» открывает первую конструкцию текущего списка
  const goToFeed = () => {
    const firstId = partitionSystems[0]?.partitionSystemId;
    if (firstId) {
      navigate(`${ROUTES.PARTITION_FEED}/${firstId}`);
    }
  };

  const goToTiles = () => navigate(ROUTES.PARTITION_TILES);

  return (
    <nav className="partitionTabbar">
      <button
        type="button"
        className={`partitionTabbarItem ${isFeed ? "partitionTabbarItemActive" : ""}`}
        onClick={goToFeed}
      >
        <svg className="partitionTabbarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        <span className="partitionTabbarLabel">{ROUTE_LABELS.PARTITION_FEED}</span>
      </button>
      <button type="button" className="partitionTabbarItem" disabled>
        <svg className="partitionTabbarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </svg>
        <span className="partitionTabbarLabel">{ROUTE_LABELS.PARTITION_CREATE}</span>
      </button>
      <button
        type="button"
        className={`partitionTabbarItem ${isTiles ? "partitionTabbarItemActive" : ""}`}
        onClick={goToTiles}
      >
        <svg className="partitionTabbarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        <span className="partitionTabbarLabel">{ROUTE_LABELS.PARTITION_TILES}</span>
      </button>
      <button type="button" className="partitionTabbarItem" disabled>
        <svg className="partitionTabbarIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
          <polyline points="10 8 14 12 10 16" />
          <line x1="3" y1="12" x2="14" y2="12" />
        </svg>
        <span className="partitionTabbarLabel">{ROUTE_LABELS.PARTITION_LOGIN}</span>
      </button>
    </nav>
  );
};
