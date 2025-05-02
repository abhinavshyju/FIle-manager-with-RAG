import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

const useAuth = () => {
  const token = sessionStorage.getItem("authToken");
  return !!token;
};

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
