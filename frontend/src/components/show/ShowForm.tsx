import { useState, type FormEvent } from "react";
import type { Movie, Show, ShowRequest, ShowStatus, Theatre } from "../../types";
import { SHOW_STATUSES } from "../../types";
import { formatEnum, todayIso } from "../../utils/format";
import { hasErrors, type FieldErrors } from "../../utils/validation";
import { InputField, SelectField } from "../common/FormField";

interface Props {
  initial?: Show | null;
  movies: Movie[];
  theatres: Theatre[];
  busy: boolean;
  onSubmit: (data: ShowRequest) => void;
  onCancel: () => void;
}

type FormState = { movieId: string; theatreId: string; showDate: string; showTime: string; ticketPrice: string; status: ShowStatus };

export default function ShowForm({ initial, movies, theatres, busy, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    movieId: initial ? String(initial.movieId) : "",
    theatreId: initial ? String(initial.theatreId) : "",
    showDate: initial?.showDate ?? "",
    showTime: initial?.showTime.substring(0, 5) ?? "",
    ticketPrice: initial ? String(initial.ticketPrice) : "",
    status: initial?.status ?? "SCHEDULED",
  });
  const [errors, setErrors] = useState<FieldErrors<FormState>>({});
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  // Mirror backend rules in the pickers: no ENDED movies, only ACTIVE theatres (keep current values when editing)
  const movieOptions = movies.filter((m) => m.status !== "ENDED" || String(m.id) === form.movieId);
  const theatreOptions = theatres.filter((t) => t.status === "ACTIVE" || String(t.id) === form.theatreId);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const price = Number(form.ticketPrice);
    const errs: FieldErrors<FormState> = {
      movieId: !form.movieId ? "Choose a movie" : undefined,
      theatreId: !form.theatreId ? "Choose a theatre" : undefined,
      showDate: !form.showDate ? "Show date is required" : !initial && form.showDate < todayIso() ? "Show date cannot be in the past" : undefined,
      showTime: !form.showTime ? "Show time is required" : undefined,
      ticketPrice: !form.ticketPrice ? "Ticket price is required" : !(price > 0) ? "Price must be greater than 0" : undefined,
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    onSubmit({
      movieId: Number(form.movieId),
      theatreId: Number(form.theatreId),
      showDate: form.showDate,
      showTime: form.showTime,
      ticketPrice: price,
      status: form.status,
    });
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <SelectField id="s-movie" label="Movie" value={form.movieId} error={errors.movieId} onChange={(e) => set({ movieId: e.target.value })}>
        <option value="">Choose a movie</option>
        {movieOptions.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </SelectField>
      <SelectField id="s-theatre" label="Theatre" value={form.theatreId} error={errors.theatreId} onChange={(e) => set({ theatreId: e.target.value })}>
        <option value="">Choose a theatre</option>
        {theatreOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name} ({t.location})
          </option>
        ))}
      </SelectField>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField id="s-date" label="Date" type="date" min={initial ? undefined : todayIso()} value={form.showDate} error={errors.showDate} onChange={(e) => set({ showDate: e.target.value })} />
        <InputField id="s-time" label="Time" type="time" value={form.showTime} error={errors.showTime} onChange={(e) => set({ showTime: e.target.value })} />
        <InputField id="s-price" label="Ticket price (LKR)" type="number" min={0.01} step="0.01" value={form.ticketPrice} error={errors.ticketPrice} onChange={(e) => set({ ticketPrice: e.target.value })} />
        <SelectField id="s-status" label="Status" value={form.status} onChange={(e) => set({ status: e.target.value as ShowStatus })}>
          {SHOW_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatEnum(s)}
            </option>
          ))}
        </SelectField>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : initial ? "Save show" : "Add show"}
        </button>
      </div>
    </form>
  );
}
