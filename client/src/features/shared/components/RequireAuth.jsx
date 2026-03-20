import { useContext } from "react";
import { Navigate } from "react-router-dom";
import DataContext from "../../../context/DataContext";

function RequireAuth({ children }) {
  const { currentUser, authLoading } = useContext(DataContext);

  // Wait for authentication to resolve before redirecting
  if (authLoading) return null;
  
  // Redirect unauthenticated users to the login page
  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
}

export default RequireAuth;