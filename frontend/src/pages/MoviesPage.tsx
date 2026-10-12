import { useMemo, useState } from "react";
import { movieService } from "../api/movieService";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Spinner from "../components/common/Spinner";
import MovieCard from "../components/movie/MovieCard";
import MovieFilters, { type MovieFilterValues } from "../components/movie/MovieFilters";
import { useApi } from "../hooks/useApi";

const statusOrder = { NOW_SHOWING: 0, UPCOMING: 1, ENDED: 2 } as const;

export default function MoviesPage() {
  const { data: movies, loading, error, reload } = useApi(movieService.getAll);
  const [filters, setFilters] = useState<MovieFilterValues>({ search: "", genre: "", language: "", status: "" });

  const genres = useMemo(() => [...new Set((movies ?? []).map((m) => m.genre))].sort(), [movies]);
  const languages = useMemo(() => [...new Set((movies ?? []).map((m) => m.language))].sort(), [movies]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return (movies ?? [])
      .filter((m) => !q || m.title.toLowerCase().includes(q))
      .filter((m) => !filters.genre || m.genre === filters.genre)
      .filter((m) => !filters.language || m.language === filters.language)
      .filter((m) => !filters.status || m.status === filters.status)
      .sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || a.title.localeCompare(b.title));
  }, [movies, filters]);

  const nowShowing = (movies ?? []).filter((m) => m.status === "NOW_SHOWING").length;

  return (
    <div>
      <section className="mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">Pick a film. Pick your seats.</h1>
        <p className="mt-3 text-lg text-muted">
          {movies ? `${nowShowing} ${nowShowing === 1 ? "film" : "films"} showing now.` : "Loading what’s on."}
        </p>
      </section>

      {loading && <Spinner label="Loading movies…" />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {movies && (
        <>
          <MovieFilters values={filters} genres={genres} languages={languages} onChange={setFilters} />
          {filtered.length === 0 ? (
            <EmptyState
              title={movies.length === 0 ? "No movies yet" : "No movies match these filters"}
              message={movies.length === 0 ? "Movies appear here once an admin adds them." : "Clear a filter to see more."}
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {filtered.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
