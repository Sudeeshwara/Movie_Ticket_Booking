import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/common/Alert";
import { InputField } from "../../components/common/FormField";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/errors";
import { EMAIL_REGEX, hasErrors, PHONE_REGEX, type FieldErrors } from "../../utils/validation";
import AuthLayout from "./AuthLayout";

type FormState = { name: string; email: string; phone: string; password: string; confirm: string };

export default function SignUpPage() {
  const { user, signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<FieldErrors<FormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors<FormState> = {
      name: !form.name.trim() ? "Name is required" : form.name.length > 100 ? "Keep your name under 100 characters" : undefined,
      email: !form.email.trim() ? "Email is required" : !EMAIL_REGEX.test(form.email) ? "Enter a valid email" : undefined,
      phone: form.phone && !PHONE_REGEX.test(form.phone) ? "Phone must be 10 to 15 digits" : undefined,
      password: form.password.length < 6 ? "Use at least 6 characters" : form.password.length > 64 ? "Use at most 64 characters" : undefined,
      confirm: form.password !== form.confirm ? "Passwords do not match" : undefined,
    };
    setErrors(errs);
    if (hasErrors(errs)) return;

    setBusy(true);
    setServerError(null);
    try {
      await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password, phone: form.phone.trim() || undefined });
      toast.success("Account created. You are signed in.");
      navigate(from ?? "/", { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="It takes a minute. Then pick your seats.">
      <form onSubmit={submit} noValidate className="grid gap-4">
        {serverError && <Alert>{serverError}</Alert>}
        <InputField id="name" label="Full name" autoComplete="name" value={form.name} error={errors.name} onChange={(e) => set({ name: e.target.value })} />
        <InputField id="email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => set({ email: e.target.value })} />
        <InputField id="phone" label="Phone (optional)" type="tel" autoComplete="tel" value={form.phone} error={errors.phone} onChange={(e) => set({ phone: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField id="password" label="Password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={(e) => set({ password: e.target.value })} />
          <InputField id="confirm" label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} error={errors.confirm} onChange={(e) => set({ confirm: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary mt-2 py-2.5" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/signin" state={location.state} className="font-semibold text-velvet hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
