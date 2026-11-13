import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TbNotebook, TbEye, TbEyeOff, TbTrash } from "react-icons/tb";
import { HTTP_STATUS, useColors } from "../../../utils/types";
import { useGuestbookService, type GuestbookEntry } from "../../../services/useGuestbookService";
import { useSnackbar } from "../../../hooks/useSnackBar";

const PAGE_SIZE = 10;

const GuestbookManagementPage: React.FC = () => {
  const colors = useColors();
  const guestbookService = useGuestbookService();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const queryKey = ["guestbook", page];

  const { data: queryResult, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await guestbookService.getEntries({
        page: String(page),
        size: String(PAGE_SIZE),
        sortBy: "createdAt",
        sortDir: "DESC",
      });
      return res?.status === HTTP_STATUS.OK ? res.data.data : null;
    },
    placeholderData: (prev) => prev,
  });

  const entries: GuestbookEntry[] = queryResult?.content ?? [];
  const totalPages: number = queryResult?.totalPages ?? 0;

  const updateLocalStatus = (id: number, status: "ACTIVE" | "INACTIVE") => {
    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.content) return old;
      return { ...old, content: old.content.map((e: GuestbookEntry) => (e.id === id ? { ...e, status } : e)) };
    });
  };

  const handleToggleVisibility = async (entry: GuestbookEntry) => {
    setActioningId(entry.id);
    try {
      const hiding = entry.status === "ACTIVE";
      const res = hiding ? await guestbookService.hide(entry.id) : await guestbookService.unhide(entry.id);
      if (res?.status === HTTP_STATUS.OK) {
        updateLocalStatus(entry.id, hiding ? "INACTIVE" : "ACTIVE");
        showSnackbar("success", hiding ? "Entry hidden from the public portfolio" : "Entry made visible again");
      } else {
        showSnackbar("error", "Failed to update entry");
      }
    } catch {
      showSnackbar("error", "Failed to update entry");
    } finally {
      setActioningId(null);
    }
  };

  const handleDelete = async (entry: GuestbookEntry) => {
    if (!window.confirm(`Permanently delete this message from ${entry.visitorName}?`)) return;
    setActioningId(entry.id);
    try {
      const res = await guestbookService.deleteEntry(entry.id);
      if (res?.status === HTTP_STATUS.OK) {
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old?.content) return old;
          return { ...old, content: old.content.filter((e: GuestbookEntry) => e.id !== entry.id) };
        });
        showSnackbar("success", "Entry deleted");
      } else {
        showSnackbar("error", "Failed to delete entry");
      }
    } catch {
      showSnackbar("error", "Failed to delete entry");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TbNotebook size={22} style={{ color: colors.primary500 }} />
        <div>
          <h1 className="text-lg font-semibold" style={{ color: colors.neutral800 }}>Guestbook</h1>
          <p className="text-sm" style={{ color: colors.neutral500 }}>
            Messages visitors have left on your public portfolio. Hidden entries stop showing publicly but aren't deleted.
          </p>
        </div>
      </div>

      {isLoading && <p className="text-sm" style={{ color: colors.neutral500 }}>Loading…</p>}

      {!isLoading && entries.length === 0 && (
        <p className="text-sm" style={{ color: colors.neutral500 }}>No guestbook messages yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {entries.map((entry) => {
          const hidden = entry.status !== "ACTIVE";
          return (
            <div
              key={entry.id}
              className="rounded-xl p-4 flex items-start justify-between gap-4"
              style={{
                background: hidden ? colors.neutral50 : "#ffffff",
                border: `1px solid ${colors.neutral200}`,
                opacity: hidden ? 0.7 : 1,
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold" style={{ color: colors.neutral800 }}>{entry.visitorName}</p>
                  {hidden && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: colors.neutral200, color: colors.neutral600 }}>
                      HIDDEN
                    </span>
                  )}
                  <span className="text-xs" style={{ color: colors.neutral500 }}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: colors.neutral700 }}>{entry.message}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  disabled={actioningId === entry.id}
                  onClick={() => handleToggleVisibility(entry)}
                  title={hidden ? "Unhide" : "Hide"}
                  className="p-2 rounded-lg"
                  style={{ background: colors.neutral50, border: `1px solid ${colors.neutral200}`, cursor: "pointer" }}
                >
                  {hidden ? <TbEye size={16} color={colors.neutral600} /> : <TbEyeOff size={16} color={colors.neutral600} />}
                </button>
                <button
                  disabled={actioningId === entry.id}
                  onClick={() => handleDelete(entry)}
                  title="Delete"
                  className="p-2 rounded-lg"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", cursor: "pointer" }}
                >
                  <TbTrash size={16} color="#ef4444" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: colors.neutral100, color: colors.neutral700, border: "none", cursor: page === 0 ? "not-allowed" : "pointer", opacity: page === 0 ? 0.5 : 1 }}
          >
            Previous
          </button>
          <span className="text-xs" style={{ color: colors.neutral500 }}>Page {page + 1} of {totalPages}</span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: colors.neutral100, color: colors.neutral700, border: "none", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", opacity: page >= totalPages - 1 ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default GuestbookManagementPage;
