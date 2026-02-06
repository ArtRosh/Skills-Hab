// client/src/pages/Topics.jsx
import { useContext } from "react";
import DataContext from "../context/DataContext";
import TopicCard from "../components/TopicCard";

function Topics() {
  const { currentUser } = useContext(DataContext);

  const topics = currentUser?.topics || [];

  return (
    <div className="py-4">
      <h1 className="mb-2">Topics</h1>
      <p className="text-muted">Your topics</p>

      <div className="d-grid gap-3">
        {topics.map((t) => (
          <TopicCard key={t.id} topic={t} />
        ))}
      </div>
    </div>
  );
}

export default Topics;