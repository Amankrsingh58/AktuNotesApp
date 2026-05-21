import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, role, authChecked } = useSelector(
    (state) => state.auth
  );

  if (!authChecked) return null; // or spinner

  return isAuthenticated &&
    (role === "admin" || role === "super_admin")
    ? <Outlet />
    : <Navigate to="/admin-login" replace />;
};


export default ProtectedRoute;
