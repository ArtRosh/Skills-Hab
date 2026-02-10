// client/src/components/NavBar.jsx
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";

function NavBar() {
  const { currentUser, logout } = useContext(DataContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout().then(() => navigate("/login", { replace: true }));
  }

  return (
    <nav className="navbar navbar-expand navbar-light bg-light rounded px-3 mb-4">
      <div className="navbar-nav me-auto">
        <NavLink className="nav-link" to="/">Home</NavLink>

        {currentUser ? (
          <>
            {currentUser.role === "tutor" ? (
              <>
                <NavLink className="nav-link" to="/topics">My Services</NavLink>
              </>
            ) : currentUser.role === "student" ? (
              <>
                <NavLink className="nav-link" to="/student">Find Tutors</NavLink>
                <NavLink className="nav-link" to="/my-requests">My Requests</NavLink>
              </>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="d-flex align-items-center gap-3">
        {!currentUser ? (
          <>
            <NavLink className="nav-link" to="/login">Login</NavLink>
            <NavLink className="nav-link" to="/signup">Signup</NavLink>
          </>
        ) : (
          <>
            <span className="text-muted">
              {currentUser.name} ({currentUser.role})
            </span>
            <button className="btn btn-outline-secondary" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;