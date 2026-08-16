import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const context = useContext(MyContext);

  // Still verifying the token on refresh - render nothing (or a spinner)
  if (context.authChecked === false) {
    return null; // or <Loader />
  }

  if (!context.isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;