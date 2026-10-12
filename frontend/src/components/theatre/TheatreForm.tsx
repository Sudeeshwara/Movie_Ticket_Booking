import { useState, type FormEvent } from "react";
import type { Theatre, TheatreRequest, TheatreStatus } from "../../types";
import { THEATRE_STATUSES } from "../../types";
import { formatEnum } from "../../utils/format";
import { hasErrors, type FieldErrors } from "../../utils/validation";
import { InputField, SelectField } from "../common/FormField";

interface Props {
  initial?: Theatre | null;
  busy: boolean;
  onSubmit: (data: TheatreRequest) => void;
  onCancel: () => void;
}

type FormState = { name: string; location: string; capacity: string; status: TheatreStatus };

export default function TheatreForm({ initial, busy, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    capacity: initial ? String(initial.capacity) : "",
    status: initial?.status ?? "ACTIVE",
  });
  const [errors, setErrors] = useState<FieldErrors<FormState>>({});
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const cap = Number(form.capacity);
    const errs: FieldErrors<FormState> = {
      name: !form.name.trim() ? "Theatre name is required" : undefined,
      location: !form.location.trim() ? "Location is required" : undefined,
      capacity: !form.capacity ? "Capacity is required" : !Number.isInteger(cap) || cap < 1 || cap > 260 ? "Enter a whole number from 1 to 260" : undefined,
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    onSubmit({ name: form.name.trim(), location: form.location.trim(), capacity: cap, status: form.status });
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4">
      <InputField id="t-name" label="Theatre name" value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
      <InputField id="t-location" label="Location" value={form.location} error={errors.location} onChange={(e) => set({ location: e.target.value })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          id="t-capacity"
          label="Capacity"
          type="number"
          min={1}
          max={260}
          value={form.capacity}
          error={errors.capacity}
          hint="Seats are laid out in rows of 10 (A1–A10, B1–B10…)"
          onChange={(e) => set({ capacity: e.target.value })}
        />
        <SelectField id="t-status" label="Status" value={form.status} onChange={(e) => set({ status: e.target.value as TheatreStatus })}>
          {THEATRE_STATUSES.map((s) => (
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
          {busy ? "Saving…" : initial ? "Save theatre" : "Add theatre"}
        </button>
      </div>
    </form>
  );
}
