// client/src/components/RequireAuth.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import DataContext from "../../../context/DataContext";

function RequireAuth({ children }) {
  const { currentUser, authLoading } = useContext(DataContext);

  if (authLoading) return null; 
  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
}

export default RequireAuth;