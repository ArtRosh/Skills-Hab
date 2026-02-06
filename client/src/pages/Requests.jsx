// client/src/pages/Requests.jsx
import { useContext } from "react";
import DataContext from "../context/DataContext";
import RequestList from "../components/RequestList";

function Requests() {
  const { currentUser } = useContext(DataContext);

  const requests =
    (currentUser?.topics || []).flatMap((t) => t.requests || []);

  return (
    <div className="py-4">
      <h1 className="mb-2">Requests</h1>
      <p className="text-muted">All incoming requests</p>

      <RequestList requests={requests} />
    </div>
  );
}

export default Requests;