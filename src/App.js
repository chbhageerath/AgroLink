import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import AuthCallback from "@/components/AuthCallback";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import ProductDetail from "@/pages/ProductDetail";
import CreateListing from "@/pages/CreateListing";
import Cart from "@/pages/Cart";
import Orders from "@/pages/Orders";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import AdminPanel from "@/pages/AdminPanel";

function AppRouter() {
  const location = useLocation();
  // Handle OAuth callback via URL fragment (session_id in hash)
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/listings/new" element={<ProtectedRoute roles={["farmer","admin"]}><CreateListing /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPanel /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
