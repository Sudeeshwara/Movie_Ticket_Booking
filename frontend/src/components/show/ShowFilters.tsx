import type { Movie, Theatre } from "../../types";

export interface ShowFilterValues {
  movieId: string;
  theatreId: string;
  date: string;
}

interface Props {
  values: ShowFilterValues;
  movies: Movie[];
  theatres: Theatre[];
  onChange: (values: ShowFilterValues) => void;
}

export default function ShowFilters({ values, movies, theatres, onChange }: Props) {
  const set = (patch: Partial<ShowFilterValues>) => onChange({ ...values, ...patch });
  const active = values.movieId || values.theatreId || values.date;

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
      <select className="input" aria-label="Filter by movie" value={values.movieId} onChange={(e) => set({ movieId: e.target.value })}>
        <option value="">All movies</option>
        {movies.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>
      <select className="input" aria-label="Filter by theatre" value={values.theatreId} onChange={(e) => set({ theatreId: e.target.value })}>
        <option value="">All theatres</option>
        {theatres.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <input type="date" className="input" aria-label="Filter by date" value={values.date} onChange={(e) => set({ date: e.target.value })} />
      <button className="btn-ghost" disabled={!active} onClick={() => onChange({ movieId: "", theatreId: "", date: "" })}>
        Clear
      </button>
    </div>
  );
}
