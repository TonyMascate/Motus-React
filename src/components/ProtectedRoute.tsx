import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../utils/hooks";

export default function ProtectedRoute() {
  const { get } = useApi();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await get("/auth/check"); // un endpoint qui retourne 200 si connecté
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [get]);

  if (!authChecked) return <div>Chargement...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
