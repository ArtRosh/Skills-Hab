// client/src/components/RequestList.jsx
function RequestList({ requests }) {
  if (!requests || requests.length === 0) {
    return <div className="text-muted">No requests for this topic.</div>;
  }

  return (
    <ul className="list-group">
      {requests.map((r) => (
        <li key={r.id} className="list-group-item">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-semibold">{r.description}</div>
              <div className="text-muted small">Request ID: {r.id}</div>
            </div>
            <span className="badge text-bg-secondary">{r.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RequestList;