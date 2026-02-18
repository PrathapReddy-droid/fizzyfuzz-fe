// Components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../App";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isLogin, userData } = useContext(MyContext);

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  if (!userData || !allowedRoles.includes(userData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
