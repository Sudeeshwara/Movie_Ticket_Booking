import { useState } from "react";
import { userService } from "../api/userService";
import ErrorState from "../components/common/ErrorState";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import StatusBadge from "../components/common/StatusBadge";
import ProfileForm from "../components/user/ProfileForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useApi } from "../hooks/useApi";
import type { UserUpdateRequest } from "../types";
import { getErrorMessage } from "../utils/errors";
import { formatDateTime } from "../utils/format";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const userId = user!.userId;
  const { data, setData, loading, error, reload } = useApi(() => userService.getById(userId), [userId]);
  const [busy, setBusy] = useState(false);

  const save = async (req: UserUpdateRequest) => {
    setBusy(true);
    try {
      const updated = await userService.update(userId, req);
      setData(updated);
      updateUser({ name: updated.name, email: updated.email });
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" subtitle="Update your details and password." />
      {loading && <Spinner label="Loading profile…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {data && (
        <>
          <div className="mb-4 flex items-center gap-3 text-sm text-muted">
            <StatusBadge status={data.role} />
            <span>Member since {formatDateTime(data.createdAt)}</span>
          </div>
          <ProfileForm key={data.id} user={data} busy={busy} onSubmit={save} />
        </>
      )}
    </div>
  );
}
