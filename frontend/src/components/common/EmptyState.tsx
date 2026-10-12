import type { ReactNode } from "react";

interface Props {
  title: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: Props) {
  return (
    <div className="panel flex flex-col items-center px-6 py-14 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
