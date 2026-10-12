import { useState } from "react";
import { theatreService } from "../../api/theatreService";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Modal from "../../components/common/Modal";
import Spinner from "../../components/common/Spinner";
import StatusBadge from "../../components/common/StatusBadge";
import TheatreForm from "../../components/theatre/TheatreForm";
import { useToast } from "../../context/ToastContext";
import { useApi } from "../../hooks/useApi";
import type { Theatre, TheatreRequest } from "../../types";
import { getErrorMessage } from "../../utils/errors";

export default function AdminTheatresPage() {
  const toast = useToast();
  const { data, setData, loading, error, reload } = useApi(theatreService.getAll);
  const [editing, setEditing] = useState<Theatre | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Theatre | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (req: TheatreRequest) => {
    setBusy(true);
    try {
      if (editing) {
        const updated = await theatreService.update(editing.id, req);
        setData((list) => (list ?? []).map((t) => (t.id === updated.id ? updated : t)));
        toast.success("Theatre saved.");
      } else {
        const created = await theatreService.create(req);
        setData((list) => [...(list ?? []), created]);
        toast.success("Theatre added.");
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
      await theatreService.remove(deleting.id);
      setData((list) => (list ?? []).filter((t) => t.id !== deleting.id));
      toast.success("Theatre deleted.");
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
        <h2 className="text-xl font-bold">Theatres</h2>
        <button className="btn-primary" onClick={() => setEditing(null)}>
          Add theatre
        </button>
      </div>

      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (data.length === 0 ? (
          <EmptyState title="No theatres yet" message="Add a theatre before scheduling shows." />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((t) => (
                  <tr key={t.id}>
                    <td className="font-semibold">{t.name}</td>
                    <td>{t.location}</td>
                    <td>{t.capacity}</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <button className="btn-ghost px-2" onClick={() => setEditing(t)}>
                        Edit
                      </button>
                      <button className="btn-ghost px-2 text-velvet" onClick={() => setDeleting(t)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      <Modal title={editing ? "Edit theatre" : "Add theatre"} open={editing !== undefined} onClose={() => !busy && setEditing(undefined)}>
        <TheatreForm key={editing?.id ?? "new"} initial={editing} busy={busy} onSubmit={save} onCancel={() => setEditing(undefined)} />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete this theatre?"
        message={`"${deleting?.name}" will be removed. Theatres that already have shows can’t be deleted; set them to Inactive instead.`}
        confirmLabel="Delete theatre"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
