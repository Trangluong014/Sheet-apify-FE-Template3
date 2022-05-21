import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/NotFoundPage";
import BlankLayout from "../layouts/BlankLayout";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<BlankLayout />}>
        <Route index element={<NotFoundPage />} />
      </Route>
      <Route
        element={
          <MainLayout />
        }
        path="/:websiteId"
      >
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default Router;