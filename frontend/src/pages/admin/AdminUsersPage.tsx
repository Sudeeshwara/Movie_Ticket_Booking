import { useState } from "react";
import { userService } from "../../api/userService";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import Spinner from "../../components/common/Spinner";
import StatusBadge from "../../components/common/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useApi } from "../../hooks/useApi";
import type { Role, User } from "../../types";
import { getErrorMessage } from "../../utils/errors";
import { formatDateTime } from "../../utils/format";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const { data, setData, loading, error, reload } = useApi(userService.getAll);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const changeRole = async (u: User, role: Role) => {
    setBusyId(u.id);
    try {
      const updated = await userService.update(u.id, { name: u.name, email: u.email, phone: u.phone ?? "", role });
      setData((list) => (list ?? []).map((x) => (x.id === updated.id ? updated : x)));
      toast.success(`${u.name} is now ${role === "ADMIN" ? "an admin" : "a customer"}.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    if (!deleting) return;
    setBusyId(deleting.id);
    try {
      await userService.remove(deleting.id);
      setData((list) => (list ?? []).filter((x) => x.id !== deleting.id));
      toast.success("User deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
      setDeleting(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Users</h2>
      {loading && <Spinner />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data &&
        (data.length === 0 ? (
          <EmptyState title="No users" />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => {
                  const self = u.id === me?.userId;
                  return (
                    <tr key={u.id}>
                      <td className="font-semibold">
                        {u.name} {self && <span className="text-xs font-normal text-muted">(you)</span>}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone ?? "—"}</td>
                      <td>{formatDateTime(u.createdAt)}</td>
                      <td>
                        {self ? (
                          <StatusBadge status={u.role} />
                        ) : (
                          <select
                            className="input w-auto py-1"
                            aria-label={`Role of ${u.name}`}
                            value={u.role}
                            disabled={busyId === u.id}
                            onChange={(e) => changeRole(u, e.target.value as Role)}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="text-right">
                        {!self && (
                          <button className="btn-ghost px-2 text-velvet" onClick={() => setDeleting(u)} disabled={busyId === u.id}>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this user?"
        message={`${deleting?.name} (${deleting?.email}) will be removed. Users with bookings can’t be deleted.`}
        confirmLabel="Delete user"
        busy={busyId !== null}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
