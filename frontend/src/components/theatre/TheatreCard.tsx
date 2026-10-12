import { Link } from "react-router-dom";
import type { Theatre } from "../../types";
import StatusBadge from "../common/StatusBadge";

export default function TheatreCard({ theatre }: { theatre: Theatre }) {
  return (
    <article className="panel flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold">{theatre.name}</h3>
        <StatusBadge status={theatre.status} />
      </div>
      <p className="mt-1 text-sm text-muted">{theatre.location}</p>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-sm">
          <span className="font-display text-2xl font-bold">{theatre.capacity}</span> <span className="text-muted">seats</span>
        </p>
        {theatre.status === "ACTIVE" && (
          <Link to={`/shows?theatreId=${theatre.id}`} className="text-sm font-semibold text-velvet hover:underline">
            See shows
          </Link>
        )}
      </div>
    </article>
  );
}
