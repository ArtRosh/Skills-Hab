// client/src/components/TopicCard.jsx
import RequestList from "./RequestList";

function TopicCard({ topic }) {
  const requests = topic?.requests || [];

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-1">{topic.topic}</h5>
        <p className="card-text text-muted">{topic.description}</p>

        <hr />

        <h6 className="mb-2">Requests</h6>
        <RequestList requests={requests} />
      </div>
    </div>
  );
}

export default TopicCard;