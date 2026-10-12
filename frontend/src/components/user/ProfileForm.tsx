import { useState, type FormEvent } from "react";
import type { User, UserUpdateRequest } from "../../types";
import { EMAIL_REGEX, hasErrors, PHONE_REGEX, type FieldErrors } from "../../utils/validation";
import { InputField } from "../common/FormField";

interface Props {
  user: User;
  busy: boolean;
  onSubmit: (data: UserUpdateRequest) => void;
}

type FormState = { name: string; email: string; phone: string; password: string; confirm: string };

export default function ProfileForm({ user, busy, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>({ name: user.name, email: user.email, phone: user.phone ?? "", password: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors<FormState>>({});
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors<FormState> = {
      name: !form.name.trim() ? "Name is required" : undefined,
      email: !EMAIL_REGEX.test(form.email) ? "Enter a valid email" : undefined,
      phone: form.phone && !PHONE_REGEX.test(form.phone) ? "Phone must be 10 to 15 digits" : undefined,
      password: form.password && form.password.length < 6 ? "Use at least 6 characters" : undefined,
      confirm: form.password !== form.confirm ? "Passwords do not match" : undefined,
    };
    setErrors(errs);
    if (hasErrors(errs)) return;
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password || undefined,
    });
    set({ password: "", confirm: "" });
  };

  return (
    <form onSubmit={submit} noValidate className="panel grid gap-4 p-5 sm:p-6">
      <InputField id="u-name" label="Full name" value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
      <InputField id="u-email" label="Email" type="email" value={form.email} error={errors.email} onChange={(e) => set({ email: e.target.value })} />
      <InputField id="u-phone" label="Phone" type="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField id="u-pass" label="New password" type="password" autoComplete="new-password" hint="Leave empty to keep your current password" value={form.password} error={errors.password} onChange={(e) => set({ password: e.target.value })} />
        <InputField id="u-confirm" label="Confirm new password" type="password" autoComplete="new-password" value={form.confirm} error={errors.confirm} onChange={(e) => set({ confirm: e.target.value })} />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
