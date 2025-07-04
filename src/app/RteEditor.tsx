"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { JSX, useEffect, useState } from "react";
import { deletePendingNote, getToken, savePendingNoteWithId, sendPendingNotes } from "@/utils";
import { apiRequest } from "@/api";
import { NoteViewer } from "@/components/note-viewer";
import { Note, TiptapProps } from "@/types";
import { NoteEditor } from "@/components/note-editor";
import { NotesList } from "@/components/note-list";

export default function Tiptap(): JSX.Element | null {
  const [tiptap, setTiptap] = useState<TiptapProps>({
    headingLevel: 1,
    editorContent: "",
    title: "",
    loading: false,
    message: "",
    notes: [],
    selectedNoteId: null,
    showViewer: false,
    viewerNote: null,
  });

  const editor: ReturnType<typeof useEditor> = useEditor({
    extensions: [
      StarterKit,
      Underline.configure({ HTMLAttributes: { class: "underline" } }),
    ],
    content: "<p>Hello World! 🌍</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm m-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] max-h-[400px] overflow-y-auto",
      },
    },
    onUpdate({ editor }) {
      setTiptap((prev) => ({ ...prev, editorContent: editor.getHTML() }));
    },
    immediatelyRender: false,
  });

  async function fetchNotes(): Promise<void> {
    const token: string | null = getToken();
    try {
      const data = await apiRequest<Note[]>({
        endpoint: "/notas",
        token,
      });
      setTiptap((prev) => ({ ...prev, notes: data }));
    } catch (err) {
      console.error("Error al obtener las notas:", err);
    }
  }

  useEffect(() => {
    fetchNotes();

    const syncOnReconnect = async () => {
      const token = getToken();
      const toDelete = JSON.parse(localStorage.getItem("pendingDeleteNotes") || "[]");
      for (const id of toDelete) {
        try {
          await apiRequest({
            method: "DELETE",
            endpoint: `/nota/${id}`,
            token,
          });
        } catch {}
      }
      if (toDelete.length > 0) {
        localStorage.removeItem("pendingDeleteNotes");
        await fetchNotes();
      }
      sendPendingNotes(token, fetchNotes);
    };
    window.addEventListener("online", syncOnReconnect);

    if (navigator.onLine) {
      syncOnReconnect();
    }

    return () => {
      window.removeEventListener("online", syncOnReconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectNote(note: Note): void {
    setTiptap((prev) => ({
      ...prev,
      viewerNote: note,
      showViewer: true,
    }));
  }

  function handleCloseViewer() {
    setTiptap((prev) => ({
      ...prev,
      showViewer: false,
      viewerNote: null,
    }));
  }

  function handleNewNote() {
    setTiptap((prev) => ({
      ...prev,
      selectedNoteId: null,
      title: "",
      editorContent: "",
    }));
    editor?.commands.setContent("");
  }

  async function handleSave(): Promise<void> {
    setTiptap((prev) => ({ ...prev, loading: true, message: "" }));
    const { title, editorContent } = tiptap;
    const noteData = { title, content: editorContent };

    if (!navigator.onLine) {
      const noteWithId = savePendingNoteWithId(noteData);
      setTiptap((prev) => ({
        ...prev,
        loading: false,
        selectedNoteId: null,
        title: "",
        message:
          "Sin conexión. Nota guardada localmente y se enviará cuando haya internet.",
        notes: [...prev.notes, noteWithId],
        editorContent: "",
      }));
      return;
    }

    try {
      const token = getToken();
      await apiRequest({
        method: "POST",
        endpoint: "/nota",
        token,
        body: noteData,
      });
      editor?.commands.setContent("");
      setTiptap((prev) => ({
        ...prev,
        message: "Nota guardada correctamente",
        selectedNoteId: null,
        title: "",
      }));
      await fetchNotes();
    } catch (err) {
      const noteWithId = savePendingNoteWithId(noteData);
      editor?.commands.setContent("");
      setTiptap((prev) => ({
        ...prev,
        message:
          "Sin conexión. Nota guardada localmente y se enviará cuando haya internet.",
        title: "",
        selectedNoteId: null,
        notes: [...prev.notes, noteWithId],
      }));
      console.error("Error al guardar la nota:", err);
    } finally {
      setTiptap((prev) => ({ ...prev, loading: false }));
    }
  }

  async function handleDeleteNote(id: number): Promise<void> {
    const isLocal = tiptap.notes.some(
      (note) => note.id === id && String(note.id).length >= 13
    );

    if (isLocal) {
      deletePendingNote(id);
      setTiptap((prev) => ({
        ...prev,
        notes: prev.notes.filter((note) => note.id !== id),
        message: "Nota local eliminada",
        selectedNoteId: null,
      }));
      return;
    }

    if (navigator.onLine) {
      const token = getToken();
      try {
        await apiRequest({
          method: "DELETE",
          endpoint: `/nota/${id}`,
          token,
        });
        setTiptap((prev) => ({
          ...prev,
          notes: prev.notes.filter((note) => note.id !== id),
          message: "Nota eliminada correctamente",
          selectedNoteId: null,
        }));
      } catch {
        setTiptap((prev) => ({
          ...prev,
          message: "No se pudo eliminar la nota",
        }));
      }
      return;
    }

    const toDelete = JSON.parse(localStorage.getItem("pendingDeleteNotes") || "[]");
    toDelete.push(id);
    localStorage.setItem("pendingDeleteNotes", JSON.stringify(toDelete));
    setTiptap((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== id),
      message: "Nota marcada para eliminar cuando haya conexión",
      selectedNoteId: null,
    }));
  }

  if (!editor) {
    return null;
  }

  return (
    <>
      {tiptap.showViewer && tiptap.viewerNote && (
        <NoteViewer note={tiptap.viewerNote} onClose={handleCloseViewer} />
      )}
      <div className="mb-4">
        <h2 className="font-bold mb-2">Mis notas</h2>
        <button
          onClick={handleNewNote}
          className="mb-2 p-2 bg-yellow-500 text-white rounded cursor-pointer hover:bg-yellow-600"
        >
          Empty Note editor
        </button>
        <NotesList
          notes={tiptap.notes}
          selectedNoteId={tiptap.selectedNoteId}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
        />
      </div>

      {!tiptap.showViewer && (
        <>
          <NoteEditor
            tiptap={tiptap}
            setTiptap={setTiptap}
            editor={editor}
            onSave={handleSave}
          />
          <div className="border rounded-lg p-2">
            <p>Content</p>
            <span className="text-sm text-gray-500 mb-2">
              <EditorContent
                editor={editor}
                className="border rounded-lg p-2"
              />
            </span>
            <div className="mt-4">
              <p className="font-bold">Contenido actual (HTML):</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {tiptap.editorContent}
              </pre>
            </div>
          </div>
        </>
      )}
    </>
  );
}
