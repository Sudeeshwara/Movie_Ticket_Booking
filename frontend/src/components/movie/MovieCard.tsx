import { Link } from "react-router-dom";
import type { Movie } from "../../types";
import { formatDuration } from "../../utils/format";
import StatusBadge from "../common/StatusBadge";
import MoviePoster from "./MoviePoster";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="group block rounded-xl focus-visible:outline-offset-4">
      <div className="transition-transform group-hover:-translate-y-1">
        <MoviePoster movie={movie} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusBadge status={movie.status} />
        <span className="text-xs text-muted">{formatDuration(movie.duration)}</span>
      </div>
    </Link>
  );
}
