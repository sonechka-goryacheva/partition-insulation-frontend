import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { AppLayout } from "./AppLayout";
import { PartitionTilesPage } from "./pages/PartitionTilesPage";
import { PartitionFeedPage } from "./pages/PartitionFeedPage";

// Две страницы ЛР-5 внутри общей оболочки с нижним меню
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.PARTITION_TILES} element={<PartitionTilesPage />} />
          <Route path={`${ROUTES.PARTITION_FEED}/:partitionSystemId`} element={<PartitionFeedPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
