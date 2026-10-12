import type { MovieStatus } from "../../types";
import { MOVIE_STATUSES } from "../../types";
import { formatEnum } from "../../utils/format";

export interface MovieFilterValues {
  search: string;
  genre: string;
  language: string;
  status: MovieStatus | "";
}

interface Props {
  values: MovieFilterValues;
  genres: string[];
  languages: string[];
  onChange: (values: MovieFilterValues) => void;
}

export default function MovieFilters({ values, genres, languages, onChange }: Props) {
  const set = (patch: Partial<MovieFilterValues>) => onChange({ ...values, ...patch });
  const active = values.search || values.genre || values.language || values.status;

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input
        type="search"
        className="input"
        placeholder="Search by title"
        aria-label="Search movies by title"
        value={values.search}
        onChange={(e) => set({ search: e.target.value })}
      />
      <select className="input" aria-label="Filter by genre" value={values.genre} onChange={(e) => set({ genre: e.target.value })}>
        <option value="">All genres</option>
        {genres.map((g) => (
          <option key={g}>{g}</option>
        ))}
      </select>
      <select className="input" aria-label="Filter by language" value={values.language} onChange={(e) => set({ language: e.target.value })}>
        <option value="">All languages</option>
        {languages.map((l) => (
          <option key={l}>{l}</option>
        ))}
      </select>
      <select
        className="input"
        aria-label="Filter by status"
        value={values.status}
        onChange={(e) => set({ status: e.target.value as MovieStatus | "" })}
      >
        <option value="">Any status</option>
        {MOVIE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {formatEnum(s)}
          </option>
        ))}
      </select>
      <button
        className="btn-ghost"
        disabled={!active}
        onClick={() => onChange({ search: "", genre: "", language: "", status: "" })}
      >
        Clear
      </button>
    </div>
  );
}
