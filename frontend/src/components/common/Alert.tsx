interface Props {
  kind?: "error" | "success" | "info";
  children: React.ReactNode;
}

const styles = {
  error: "border-velvet/30 bg-velvet/5 text-velvet",
  success: "border-emerald-700/30 bg-emerald-50 text-emerald-800",
  info: "border-brass/50 bg-brass-soft text-ink",
};

export default function Alert({ kind = "error", children }: Props) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[kind]}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
