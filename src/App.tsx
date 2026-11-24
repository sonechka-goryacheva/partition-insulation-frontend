import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";
import { PartitionTilesPage } from "./pages/PartitionTilesPage";
import { PartitionFeedPage } from "./pages/PartitionFeedPage";
import { PartitionLoginPage } from "./pages/PartitionLoginPage";
import { PartitionCreatePage } from "./pages/PartitionCreatePage";

// base из vite.config.ts, без завершающего слэша: локально и на Pages один и тот же префикс
const partitionBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

// Страницы приложения внутри общей оболочки с нижним меню
function App() {
  return (
    <BrowserRouter basename={partitionBasename}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.PARTITION_TILES} element={<PartitionTilesPage />} />
          <Route path={ROUTES.PARTITION_FEED} element={<PartitionFeedPage />} />
          <Route path={`${ROUTES.PARTITION_FEED}/:partitionSystemId`} element={<PartitionFeedPage />} />
          <Route path={ROUTES.PARTITION_LOGIN} element={<PartitionLoginPage />} />
          <Route path={ROUTES.PARTITION_CREATE} element={<PartitionCreatePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
