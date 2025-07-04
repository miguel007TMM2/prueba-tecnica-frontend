import { apiRequest } from "@/api";

 export  function deletePendingNote(id: number) {
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
        endpoint: "/nota",
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