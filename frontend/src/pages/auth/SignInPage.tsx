import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/common/Alert";
import { InputField } from "../../components/common/FormField";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/errors";
import { EMAIL_REGEX, hasErrors, type FieldErrors } from "../../utils/validation";
import AuthLayout from "./AuthLayout";

type FormState = { email: string; password: string };

export default function SignInPage() {
  const { user, signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors<FormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from ?? (user.role === "ADMIN" ? "/admin" : "/")} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: FieldErrors<FormState> = {
      email: !form.email.trim() ? "Email is required" : !EMAIL_REGEX.test(form.email) ? "Enter a valid email" : undefined,
      password: !form.password ? "Password is required" : undefined,
    };
    setErrors(errs);
    if (hasErrors(errs)) return;

    setBusy(true);
    setServerError(null);
    try {
      const u = await signIn({ email: form.email.trim(), password: form.password });
      toast.success(`Welcome back, ${u.name.split(" ")[0]}.`);
      navigate(from ?? (u.role === "ADMIN" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Book seats and manage your tickets.">
      <form onSubmit={submit} noValidate className="grid gap-4">
        {serverError && <Alert>{serverError}</Alert>}
        <InputField id="email" label="Email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <InputField id="password" label="Password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit" className="btn-primary mt-2 py-2.5" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-muted">
          New here?{" "}
          <Link to="/signup" state={location.state} className="font-semibold text-velvet hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
