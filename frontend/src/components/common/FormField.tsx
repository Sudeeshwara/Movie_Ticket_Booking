import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface WrapperProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Wrapper({ id, label, error, hint, children }: WrapperProps) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-velvet">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; error?: string; hint?: string };

export function InputField({ id, label, error, hint, className = "", ...rest }: InputProps) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        className={`input ${error ? "input-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </Wrapper>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { id: string; label: string; error?: string; hint?: string };

export function SelectField({ id, label, error, hint, children, className = "", ...rest }: SelectProps) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <select id={id} className={`input ${error ? "input-error" : ""} ${className}`} aria-invalid={!!error} {...rest}>
        {children}
      </select>
    </Wrapper>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; label: string; error?: string; hint?: string };

export function TextAreaField({ id, label, error, hint, className = "", ...rest }: TextAreaProps) {
  return (
    <Wrapper id={id} label={label} error={error} hint={hint}>
      <textarea id={id} className={`input min-h-24 ${error ? "input-error" : ""} ${className}`} aria-invalid={!!error} {...rest} />
    </Wrapper>
  );
}
