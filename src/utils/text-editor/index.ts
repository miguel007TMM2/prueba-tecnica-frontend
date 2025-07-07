import { apiRequest } from "@/api";

export function deletePendingNote(id: number) {
  const pending = JSON.parse(localStorage.getItem("pendingNotes") || "[]");
  const newPending = pending.filter((note: { id: number }) => note.id !== id);
  localStorage.setItem("pendingNotes", JSON.stringify(newPending));
}

export function savePendingNoteWithId(note: { title: string; content: string }) {
  const pending = JSON.parse(localStorage.getItem("pendingNotes") || "[]");
  const noteWithId = { ...note, id: Date.now() };
  pending.push(noteWithId);
  localStorage.setItem("pendingNotes", JSON.stringify(pending));
  return noteWithId;
}

export async function sendPendingNotes(
  token: string,
  refreshNotes: () => void
): Promise<void> {
  const pending: { title: string; content: string }[] = JSON.parse(
    localStorage.getItem("pendingNotes") || "[]"
  );

  if (pending.length === 0) return;

  let sent = 0;

  for (const note of pending) {
    try {
      await apiRequest({
        method: "POST",
        endpoint: "/notes",
        token,
        body: note,
      });
      sent++;
    } catch {
      break;
    }
  }
  if (sent > 0) {
    localStorage.removeItem("pendingNotes");
    refreshNotes();
    alert(`${sent} nota(s) sincronizadas con el servidor.`);
  }
}

export function savePendingEdit(noteId: number, noteData: { title: string; content: string }) {
  const pending = JSON.parse(localStorage.getItem("pendingEdits") || "[]");
  const existingIndex = pending.findIndex((edit: { id: number }) => edit.id === noteId);

  if (existingIndex !== -1) {
    pending[existingIndex] = { id: noteId, ...noteData };
  } else {
    pending.push({ id: noteId, ...noteData });
  }
  
  localStorage.setItem("pendingEdits", JSON.stringify(pending));
}

export async function sendPendingEdits(token: string, refreshNotes: () => void) {
  const pendingEdits = JSON.parse(localStorage.getItem("pendingEdits") || "[]");
  if (pendingEdits.length === 0) return;

  let sent = 0;
  for (const edit of pendingEdits) {
    try {
      await apiRequest({
        method: "PUT",
        endpoint: `/notes/${edit.id}`,
        token,
        body: { title: edit.title, content: edit.content },
      });
      sent++;
    } catch {
      break;
    }
  }

  if (sent > 0) {
    localStorage.removeItem("pendingEdits");
    refreshNotes();
    alert(`${sent} edición(es) sincronizadas con el servidor.`);
  }
}