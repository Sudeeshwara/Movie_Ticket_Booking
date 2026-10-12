import { useState, type FormEvent } from "react";
import type { Movie, MovieRequest, MovieStatus } from "../../types";
import { MOVIE_STATUSES } from "../../types";
import { formatEnum } from "../../utils/format";
import { hasErrors, type FieldErrors } from "../../utils/validation";
import { InputField, SelectField, TextAreaField } from "../common/FormField";

interface Props {
  initial?: Movie | null;
  busy: boolean;
  onSubmit: (data: MovieRequest) => void;
  onCancel: () => void;
}

type FormState = { title: string; description: string; duration: string; language: string; genre: string; releaseDate: string; status: MovieStatus };

export default function MovieForm({ initial, busy, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    duration: initial ? String(initial.duration) : "",
    language: initial?.language ?? "",
    genre: initial?.genre ?? "",
    releaseDate: initial?.releaseDate ?? "",
    status: initial?.status ?? "UPCOMING",
  });
  const [errors, setErrors] = useState<FieldErrors<FormState>>({});
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const validate = (): FieldErrors<FormState> => ({
    title: !form.title.trim() ? "Title is required" : form.title.length > 150 ? "Keep the title under 150 characters" : undefined,
    description: form.description.length > 2000 ? "Keep the description under 2000 characters" : undefined,
    duration: !form.duration ? "Duration is required" : Number(form.duration) <= 0 || !Number.isInteger(Number(form.duration)) ? "Enter whole minutes above 0" : undefined,
    language: !form.language.trim() ? "Language is required" : undefined,
    genre: !form.genre.trim() ? "Genre is required" : undefined,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (hasErrors(errs)) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      duration: Number(form.duration),
      language: form.language.trim(),
      genre: form.genre.trim(),
      releaseDate: form.releaseDate || null,
      status: form.status,
    });
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <InputField id="m-title" label="Title" value={form.title} error={errors.title} onChange={(e) => set({ title: e.target.value })} />
      <TextAreaField id="m-desc" label="Description" value={form.description} error={errors.description} onChange={(e) => set({ description: e.target.value })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField id="m-duration" label="Duration (minutes)" type="number" min={1} value={form.duration} error={errors.duration} onChange={(e) => set({ duration: e.target.value })} />
        <InputField id="m-release" label="Release date" type="date" value={form.releaseDate} onChange={(e) => set({ releaseDate: e.target.value })} />
        <InputField id="m-language" label="Language" value={form.language} error={errors.language} onChange={(e) => set({ language: e.target.value })} />
        <InputField id="m-genre" label="Genre" value={form.genre} error={errors.genre} onChange={(e) => set({ genre: e.target.value })} />
      </div>
      <SelectField id="m-status" label="Status" value={form.status} onChange={(e) => set({ status: e.target.value as MovieStatus })}>
        {MOVIE_STATUSES.map((s) => (
          <option key={s} value={s}>
            {formatEnum(s)}
          </option>
        ))}
      </SelectField>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : initial ? "Save movie" : "Add movie"}
        </button>
      </div>
    </form>
  );
}
