import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";
import { PartitionTilesPage } from "./pages/PartitionTilesPage";
import { PartitionFeedPage } from "./pages/PartitionFeedPage";
import { PartitionLoginPage } from "./pages/PartitionLoginPage";
import { PartitionCreatePage } from "./pages/PartitionCreatePage";

// Страницы приложения внутри общей оболочки с нижним меню
function App() {
  return (
    <BrowserRouter>
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
