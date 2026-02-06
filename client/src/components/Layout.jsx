import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { DataProvider } from "../context/DataContext";

function Layout() {
  return (
    <DataProvider>
      <div className="container py-4">
        <NavBar />
        <Outlet />
      </div>
    </DataProvider>
  );
}

export default Layout;