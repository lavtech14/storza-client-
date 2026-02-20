import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProductPage from "./pages/ProductPage";
import SalesPage from "./pages/SalesPage";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import SalesHistoryPage from "./pages/SalesHistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
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
    </Routes>
  );
}

export default App;
