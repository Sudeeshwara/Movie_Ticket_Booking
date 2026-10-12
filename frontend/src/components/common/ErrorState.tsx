interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="panel flex flex-col items-start gap-3 border-velvet/30 p-5 sm:flex-row sm:items-center sm:justify-between" role="alert">
      <p className="text-sm text-velvet">{message}</p>
      {onRetry && (
        <button className="btn-secondary shrink-0" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
