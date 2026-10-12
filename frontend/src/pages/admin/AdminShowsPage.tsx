import { useMemo, useState } from "react";
import { movieService } from "../../api/movieService";
import { showService } from "../../api/showService";
import { theatreService } from "../../api/theatreService";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";
import StatusBadge from "../../components/common/StatusBadge";
import ShowFilters, { type ShowFilterValues } from "../../components/show/ShowFilters";
import ShowForm from "../../components/show/ShowForm";
import { useToast } from "../../context/ToastContext";
import { useApi } from "../../hooks/useApi";
import type { Show, ShowRequest } from "../../types";
import { getErrorMessage } from "../../utils/errors";
import { formatCurrency, formatDate, formatTime } from "../../utils/format";

export default function AdminShowsPage() {
  const toast = useToast();
  const shows = useApi(showService.getAll);
  const movies = useApi(movieService.getAll);
  const theatres = useApi(theatreService.getAll);
  const [filters, setFilters] = useState<ShowFilterValues>({ movieId: "", theatreId: "", date: "" });
  const [editing, setEditing] = useState<Show | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Show | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () =>
      (shows.data ?? []).filter(
        (s) =>
          (!filters.movieId || String(s.movieId) === filters.movieId) &&
          (!filters.theatreId || String(s.theatreId) === filters.theatreId) &&
          (!filters.date || s.showDate === filters.date),
      ),
    [shows.data, filters],
  );

  const sortShows = (list: Show[]) => [...list].sort((a, b) => `${a.showDate}${a.showTime}`.localeCompare(`${b.showDate}${b.showTime}`));

  const save = async (req: ShowRequest) => {
    setBusy(true);
    try {
      if (editing) {
        const updated = await showService.update(editing.id, req);
        shows.setData((list) => sortShows((list ?? []).map((s) => (s.id === updated.id ? updated : s))));
        toast.success("Show saved.");
      } else {
        const created = await showService.create(req);
        shows.setData((list) => sortShows([...(list ?? []), created]));
        toast.success("Show added.");
      }
      setEditing(undefined);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await showService.remove(deleting.id);
      shows.setData((list) => (list ?? []).filter((s) => s.id !== deleting.id));
      toast.success("Show deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Shows</h2>
        <button className="btn-primary" onClick={() => setEditing(null)} disabled={!movies.data || !theatres.data}>
          Add show
        </button>
      </div>

      <ShowFilters values={filters} movies={movies.data ?? []} theatres={theatres.data ?? []} onChange={setFilters} />

      {shows.loading && <Spinner />}
      {shows.error && <ErrorState message={shows.error} onRetry={shows.reload} />}
      {shows.data &&
        (filtered.length === 0 ? (
          <EmptyState title={shows.data.length === 0 ? "No shows yet" : "No shows match these filters"} message="Shows need a movie that hasn’t ended and an active theatre." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.movieTitle}</td>
                    <td>{s.theatreName}</td>
                    <td>{formatDate(s.showDate)}</td>
                    <td>{formatTime(s.showTime)}</td>
                    <td>{formatCurrency(s.ticketPrice)}</td>
                    <td>
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <button className="btn-ghost px-2" onClick={() => setEditing(s)}>
                        Edit
                      </button>
                      <button className="btn-ghost px-2 text-velvet" onClick={() => setDeleting(s)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <Modal title={editing ? "Edit show" : "Add show"} open={editing !== undefined} onClose={() => !busy && setEditing(undefined)}>
        <ShowForm
          key={editing?.id ?? "new"}
          initial={editing}
          movies={movies.data ?? []}
          theatres={theatres.data ?? []}
          busy={busy}
          onSubmit={save}
          onCancel={() => setEditing(undefined)}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this show?"
        message="Shows that already have bookings can’t be deleted; set them to Cancelled instead."
        confirmLabel="Delete show"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
