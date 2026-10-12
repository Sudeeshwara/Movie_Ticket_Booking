import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      message="The link may be broken or the page may have moved."
      action={
        <Link to="/" className="btn-primary">
          Go to movies
        </Link>
      }
    />
  );
}
