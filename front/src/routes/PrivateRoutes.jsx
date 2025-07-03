import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutes() {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
