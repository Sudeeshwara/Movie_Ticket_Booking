import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { movieService } from "../api/movieService";
import { showService } from "../api/showService";
import { theatreService } from "../api/theatreService";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import ShowCard from "../components/show/ShowCard";
import ShowFilters, { type ShowFilterValues } from "../components/show/ShowFilters";
import { useApi } from "../hooks/useApi";

export default function ShowsPage() {
  const [params, setParams] = useSearchParams();
  const filters: ShowFilterValues = {
    movieId: params.get("movieId") ?? "",
    theatreId: params.get("theatreId") ?? "",
    date: params.get("date") ?? "",
  };

  const shows = useApi(showService.getAll);
  const movies = useApi(movieService.getAll);
  const theatres = useApi(theatreService.getAll);

  // Filters live in the URL so a filtered list can be linked to (e.g. from a theatre card)
  const setFilters = (v: ShowFilterValues) => {
    const next = new URLSearchParams();
    Object.entries(v).forEach(([k, val]) => val && next.set(k, val));
    setParams(next, { replace: true });
  };

  const filtered = useMemo(
    () =>
      (shows.data ?? []).filter(
        (s) =>
          (!filters.movieId || String(s.movieId) === filters.movieId) &&
          (!filters.theatreId || String(s.theatreId) === filters.theatreId) &&
          (!filters.date || s.showDate === filters.date),
      ),
    [shows.data, filters.movieId, filters.theatreId, filters.date],
  );

  return (
    <div>
      <PageHeader title="Shows" subtitle="Filter by movie, theatre or date, then choose your seats." />
      <ShowFilters values={filters} movies={movies.data ?? []} theatres={theatres.data ?? []} onChange={setFilters} />
      {shows.loading && <Spinner label="Loading shows…" />}
      {shows.error && <ErrorState message={shows.error} onRetry={shows.reload} />}
      {shows.data &&
        (filtered.length === 0 ? (
          <EmptyState
            title={shows.data.length === 0 ? "No shows yet" : "No shows match these filters"}
            message={shows.data.length === 0 ? "Shows appear here once an admin schedules them." : "Try another date or clear a filter."}
          />
        ) : (
          <div className="grid gap-3">
            {filtered.map((s) => (
              <ShowCard key={s.id} show={s} />
            ))}
          </div>
        ))}
    </div>
  );
}
