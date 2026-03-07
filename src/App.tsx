import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProductPage from "./pages/ProductPage";
import SalesPage from "./pages/SalesPage";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import SalesHistoryPage from "./pages/SalesHistoryPage";
import CreateStore from "./pages/CreateStore";
import PurchasePage from "./pages/PurchasePage.js";
import PurchaseHistoryPage from "./pages/PurchaseHistory.js";

import { ProductsProvider } from "./context/ProductsProvider";
import CreateUserPage from "./pages/CreateUserPage.js";

function App() {
  return (
    <ProductsProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-store" element={<CreateStore />} />
        <Route path="/create-user" element={<CreateUserPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProductPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SalesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales-history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SalesHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PurchasePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases-history"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PurchaseHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ProductsProvider>
  );
}

export default App;
