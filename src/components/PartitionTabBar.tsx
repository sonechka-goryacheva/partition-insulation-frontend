import "./PartitionTabBar.css";
import { useState } from "react";
import type { FC, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { PARTITION_LOGOUT_LABEL, ROUTES, ROUTE_LABELS } from "../Routes";
import type { AppDispatch } from "../store";
import { logoutPartitionUser } from "../modules/partitionAuth";
import {
  getPartitionSystemsList,
  resetPartitionFilterAction,
  usePartitionSystems,
} from "../slices/partitionSystemsSlice";
import { resetPartitionUserAction, usePartitionIsAuthenticated } from "../slices/partitionUserSlice";

// Меню: шире 545px пункты в строку, уже — бургер.
// Гость: «Лента», «Плитка», «Войти»; после входа доступна «Добавить», последний пункт — «Выход»
export const PartitionTabBar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const partitionSystems = usePartitionSystems(); // текущий список из Redux
  const isAuthenticated = usePartitionIsAuthenticated();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname.startsWith(ROUTES.PARTITION_FEED);
  const isTiles = location.pathname === ROUTES.PARTITION_TILES;
  const isLogin = location.pathname === ROUTES.PARTITION_LOGIN;
  const isCreate = location.pathname === ROUTES.PARTITION_CREATE;

  // «Лента» открывает первую конструкцию текущего списка;
  // список пуст (плитку ещё не открывали) — первую конструкцию ленты веб-сервиса
  const goToFeed = () => {
    const firstId = partitionSystems[0]?.partitionSystemId;
    navigate(firstId ? `${ROUTES.PARTITION_FEED}/${firstId}` : ROUTES.PARTITION_FEED);
  };

  const goToTiles = () => navigate(ROUTES.PARTITION_TILES);

  const goToLogin = () => navigate(ROUTES.PARTITION_LOGIN);

  const goToCreate = () => navigate(ROUTES.PARTITION_CREATE);

  // «Выход»: запрос axios, затем вручную в Redux — интерфейс гостя и сброс фильтра пользователя
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logoutPartitionUser();
    } catch {
      // веб-сервис недоступен — всё равно переходим в интерфейс гостя
    }
    dispatch(resetPartitionUserAction());
    dispatch(resetPartitionFilterAction());
    setLogoutLoading(false);
    if (isTiles) {
      dispatch(getPartitionSystemsList()); // плитка уже открыта — обновляем список как гость
    } else {
      navigate(ROUTES.PARTITION_TILES); // плитка сама запросит список при открытии
    }
  };

  const renderItems = (): ReactNode => (
    <>
      <button
        type="button"
        className={`partitionNavItem ${isFeed ? "partitionNavItemActive" : ""}`}
        onClick={goToFeed}
      >
        <svg className="partitionNavIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        <span>{ROUTE_LABELS.PARTITION_FEED}</span>
      </button>
      <button
        type="button"
        className={`partitionNavItem ${isCreate ? "partitionNavItemActive" : ""}`}
        onClick={goToCreate}
        disabled={!isAuthenticated}
      >
        <svg className="partitionNavIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="9" y1="12" x2="15" y2="12" />
        </svg>
        <span>{ROUTE_LABELS.PARTITION_CREATE}</span>
      </button>
      <button
        type="button"
        className={`partitionNavItem ${isTiles ? "partitionNavItemActive" : ""}`}
        onClick={goToTiles}
      >
        <svg className="partitionNavIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
        <span>{ROUTE_LABELS.PARTITION_TILES}</span>
      </button>
      {isAuthenticated ? (
        <button type="button" className="partitionNavItem" onClick={handleLogout} disabled={logoutLoading}>
          <svg className="partitionNavIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
            <polyline points="16 8 20 12 16 16" />
            <line x1="9" y1="12" x2="20" y2="12" />
          </svg>
          <span>{PARTITION_LOGOUT_LABEL}</span>
        </button>
      ) : (
        <button
          type="button"
          className={`partitionNavItem ${isLogin ? "partitionNavItemActive" : ""}`}
          onClick={goToLogin}
        >
          <svg className="partitionNavIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
            <polyline points="10 8 14 12 10 16" />
            <line x1="3" y1="12" x2="14" y2="12" />
          </svg>
          <span>{ROUTE_LABELS.PARTITION_LOGIN}</span>
        </button>
      )}
    </>
  );

  return (
    <nav className="partitionNav" aria-label="Разделы">
      <div className="partitionNavBar">
        <div className="partitionNavLinks">{renderItems()}</div>
        <div
          className={`partitionNavBurger ${menuOpen ? "active" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <div className="partitionNavBurgerTarget" />
          {/* Клик по пункту не всплывает к бургеру и не закрывает меню */}
          <div className="partitionNavMenu" onClick={(event) => event.stopPropagation()}>
            {renderItems()}
          </div>
        </div>
      </div>
    </nav>
  );
};
