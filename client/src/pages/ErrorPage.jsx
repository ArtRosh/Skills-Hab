// client/src/pages/ErrorPage.jsx
import { Link, useRouteError } from "react-router-dom";

function ErrorPage() {
  const err = useRouteError();

  return (
    <div className="container py-4">
      <h2>Something went wrong</h2>
      <pre className="text-danger">
        {err?.status} {err?.statusText || err?.message}
      </pre>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}

export default ErrorPage;