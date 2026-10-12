import { useState } from "react";
import { movieService } from "../../api/movieService";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";
import StatusBadge from "../../components/common/StatusBadge";
import MovieForm from "../../components/movie/MovieForm";
import { useToast } from "../../context/ToastContext";
import { useApi } from "../../hooks/useApi";
import type { Movie, MovieRequest } from "../../types";
import { getErrorMessage } from "../../utils/errors";
import { formatDate, formatDuration } from "../../utils/format";

export default function AdminMoviesPage() {
  const toast = useToast();
  const { data, setData, loading, error, reload } = useApi(movieService.getAll);
  const [editing, setEditing] = useState<Movie | null | undefined>(undefined); // undefined = closed, null = new
  const [deleting, setDeleting] = useState<Movie | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (req: MovieRequest) => {
    setBusy(true);
    try {
      if (editing) {
        const updated = await movieService.update(editing.id, req);
        setData((list) => (list ?? []).map((m) => (m.id === updated.id ? updated : m)));
        toast.success("Movie saved.");
      } else {
        const created = await movieService.create(req);
        setData((list) => [...(list ?? []), created]);
        toast.success("Movie added.");
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
      await movieService.remove(deleting.id);
      setData((list) => (list ?? []).filter((m) => m.id !== deleting.id));
      toast.success("Movie deleted.");
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
        <h2 className="text-xl font-bold">Movies</h2>
        <button className="btn-primary" onClick={() => setEditing(null)}>
          Add movie
        </button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (data.length === 0 ? (
          <EmptyState title="No movies yet" message="Add the first movie to start scheduling shows." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Language</th>
                  <th>Duration</th>
                  <th>Release</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr key={m.id}>
                    <td className="font-semibold">{m.title}</td>
                    <td>{m.genre}</td>
                    <td>{m.language}</td>
                    <td>{formatDuration(m.duration)}</td>
                    <td>{formatDate(m.releaseDate)}</td>
                    <td>
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <button className="btn-ghost px-2" onClick={() => setEditing(m)}>
                        Edit
                      </button>
                      <button className="btn-ghost px-2 text-velvet" onClick={() => setDeleting(m)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <Modal title={editing ? "Edit movie" : "Add movie"} open={editing !== undefined} onClose={() => !busy && setEditing(undefined)}>
        <MovieForm key={editing?.id ?? "new"} initial={editing} busy={busy} onSubmit={save} onCancel={() => setEditing(undefined)} />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this movie?"
        message={`"${deleting?.title}" will be removed. Movies that already have shows can’t be deleted; set them to Ended instead.`}
        confirmLabel="Delete movie"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
