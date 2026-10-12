import { Link, useParams } from "react-router-dom";
import { movieService } from "../api/movieService";
import { showService } from "../api/showService";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Spinner from "../components/common/Spinner";
import StatusBadge from "../components/common/StatusBadge";
import MoviePoster from "../components/movie/MoviePoster";
import ShowCard from "../components/show/ShowCard";
import { useApi } from "../hooks/useApi";
import { formatDate, formatDuration } from "../utils/format";

export default function MovieDetailsPage() {
  const id = Number(useParams().id);
  const movie = useApi(() => movieService.getById(id), [id]);
  const shows = useApi(() => showService.getByMovie(id), [id]);

  if (movie.loading) return <Spinner label="Loading movie…" />;
  if (movie.error || !movie.data) return <ErrorState message={movie.error ?? "Movie not found"} onRetry={movie.reload} />;

  const m = movie.data;
  const openShows = (shows.data ?? []).filter((s) => s.status === "SCHEDULED");

  return (
    <div>
      <Link to="/" className="text-sm font-semibold text-muted hover:text-ink">
        Back to movies
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="max-w-[260px]">
          <MoviePoster movie={m} size="lg" />
        </div>
        <div>
          <StatusBadge status={m.status} />
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{m.title}</h1>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-muted">Genre</dt>
              <dd className="font-semibold">{m.genre}</dd>
            </div>
            <div>
              <dt className="text-muted">Language</dt>
              <dd className="font-semibold">{m.language}</dd>
            </div>
            <div>
              <dt className="text-muted">Duration</dt>
              <dd className="font-semibold">{formatDuration(m.duration)}</dd>
            </div>
            <div>
              <dt className="text-muted">Release date</dt>
              <dd className="font-semibold">{formatDate(m.releaseDate)}</dd>
            </div>
          </dl>
          {m.description && <p className="mt-6 max-w-prose leading-relaxed text-ink/85">{m.description}</p>}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Shows</h2>
        {shows.loading && <Spinner label="Loading shows…" />}
        {shows.error && <ErrorState message={shows.error} onRetry={shows.reload} />}
        {shows.data &&
          (openShows.length === 0 ? (
            <EmptyState
              title="No shows open for booking"
              message={m.status === "UPCOMING" ? "This film hasn’t opened yet. Check back closer to the release date." : "There are no scheduled shows for this film right now."}
            />
          ) : (
            <div className="grid gap-3">
              {openShows.map((s) => (
                <ShowCard key={s.id} show={s} hideMovie />
              ))}
            </div>
          ))}
      </section>
    </div>
  );
}
