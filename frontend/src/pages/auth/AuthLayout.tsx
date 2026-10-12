import type { ReactNode } from "react";

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-line bg-white md:grid-cols-[1fr_1.1fr]">
      <div className="hidden flex-col justify-between bg-velvet p-8 text-white md:flex">
        <p className="font-display text-4xl font-extrabold leading-[0.95]">
          Your seat
          <br />
          is waiting.
        </p>
        <div className="grid grid-cols-5 gap-1.5" aria-hidden>
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className={`h-6 rounded-t-md rounded-b-sm ${i === 7 || i === 8 ? "bg-brass" : "bg-white/15"}`} />
          ))}
        </div>
      </div>
      <div className="p-6 sm:p-10">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
