import { useContext } from "react";
import { Navigate } from "react-router-dom";
import DataContext from "../../../context/DataContext";

const RequireStudent = ({ children }) => {
  const { currentUser } = useContext(DataContext);

  if (!currentUser || currentUser.role !== "student") {

    // Redirect non-student users to the "not authorized" page
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default RequireStudent;
