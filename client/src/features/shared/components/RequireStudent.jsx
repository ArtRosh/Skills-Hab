import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import DataContext from "../../../context/DataContext";

function RequireStudent({ children }) {
  const { currentUser, authLoading } = useContext(DataContext);
  const location = useLocation();

  if (authLoading) return null;

  if (!currentUser || currentUser.role !== "student") {
    // Redirect to home or a Not Authorized page
    return <Navigate to="/not-authorized" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireStudent;
