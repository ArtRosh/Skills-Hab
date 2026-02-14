// client/src/pages/Home.jsx
import { useContext } from "react";
import DataContext from "../../../context/DataContext";

function Home() {
  const { topics, topicsLoading } = useContext(DataContext);

  if (topicsLoading) {
    return (
      <div className="py-4">
        <h1 className="mb-2">Topics</h1>
        <p className="text-muted">Loading topics...</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="mb-3">Topics</h1>

      {topics.length === 0 ? (
        <p className="text-muted">No topics yet.</p>
      ) : (
        <div className="d-grid gap-3">
          {topics.map((t) => (
            <div key={t.id} className="card">
              <div className="card-body">
                <h5 className="card-title mb-1">{t.topic}</h5>
                {t.description ? (
                  <p className="card-text text-muted mb-0">{t.description}</p>
                ) : (
                  <p className="card-text text-muted mb-0">No description.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;