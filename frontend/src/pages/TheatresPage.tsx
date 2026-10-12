import { theatreService } from "../api/theatreService";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import TheatreCard from "../components/theatre/TheatreCard";
import { useApi } from "../hooks/useApi";

export default function TheatresPage() {
  const { data, loading, error, reload } = useApi(theatreService.getAll);

  return (
    <div>
      <PageHeader title="Theatres" subtitle="Where the films are showing." />
      {loading && <Spinner label="Loading theatres…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (data.length === 0 ? (
          <EmptyState title="No theatres yet" message="Theatres appear here once an admin adds them." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...data]
              .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
              .map((t) => (
                <TheatreCard key={t.id} theatre={t} />
              ))}
          </div>
        ))}
    </div>
  );
}
