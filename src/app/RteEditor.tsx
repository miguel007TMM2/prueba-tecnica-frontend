"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListOl,
  FaListUl,
  FaHeading,
} from "react-icons/fa";
import { JSX, useEffect, useState } from "react";
import { getCookie } from "cookies-next";

interface Note {
  id: number;
  title: string;
  content: string;
}

type Level = 1 | 2 | 3 | 4 | 5 | 6 ;
interface TiptapProps {
  headingLevel: Level;
  editorContent: string;
  title: string;
  loading: boolean;
  message: string;
  notes: Note[];
  selectedNoteId: number | null;
}


export default function Tiptap(): JSX.Element | null {
  const [tiptap, setTiptap] = useState<TiptapProps>({
    headingLevel: 1,
    editorContent: "",
    title: "",
    loading: false,
    message: "",
    notes: [],
    selectedNoteId: null,
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

  async function sendPendingNotes(token: string, refreshNotes: () => void) {
    const pending: { title: string; content: string }[] = JSON.parse(
      localStorage.getItem("pendingNotes") || "[]"
    );

    if (pending.length === 0) return;

    let sent = 0;

    for (const note of pending) {
      try {
        const res = await fetch(
          "https://ucw4k4kk0coss4k08k0ow4ko.softver.cc/api/nota",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(note),
          }
        );
        if (res.ok) sent++;
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

  function savePendingNote(note: { title: string; content: string }) {
    const pending = JSON.parse(localStorage.getItem("pendingNotes") || "[]");
    pending.push(note);
    localStorage.setItem("pendingNotes", JSON.stringify(pending));
  }

  function getToken() {
    const cookieValue = getCookie("token");
    let token = "";
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue as string);
        token = parsed.token;
      } catch {
        token = cookieValue as string;
      }
    }
    return token;
  }

  async function fetchNotes() {
    const token = getToken();
    const res = await fetch(
      "https://ucw4k4kk0coss4k08k0ow4ko.softver.cc/api/notas",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    if (res.ok) {
      const data = await res.json();
      setTiptap((prev) => ({ ...prev, notes: data }));
    }
  }

  useEffect(() => {
    fetchNotes();

    const syncOnReconnect = () => {
      const token = getToken();
      sendPendingNotes(token, fetchNotes);
    };
    window.addEventListener("online", syncOnReconnect);

    if (navigator.onLine) {
      const token = getToken();
      sendPendingNotes(token, fetchNotes);
    }

    return () => {
      window.removeEventListener("online", syncOnReconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelectNote(note: Note) {
    setTiptap((prev) => ({
      ...prev,
      title: note.title,
      editorContent: note.content,
    }));

    editor?.commands.setContent(note.content);
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

  async function handleSave() {

    setTiptap((prev) => ({ ...prev, loading: true, message: "" }));

    const { title, editorContent } = tiptap;
    const noteData = { title, content: editorContent };

    if (!navigator.onLine) {
      savePendingNote(noteData);
      setTiptap((prev) => ({
        ...prev,
        loading: false,
        selectedNoteId: null,
        title: "",
        message:
          "Sin conexión. Nota guardada localmente y se enviará cuando haya internet.",
        notes: [
          ...prev.notes,
          { id: Date.now(), title, content: editorContent },
        ],
        editorContent: "",
      }));
      return;
    }

    try {
      const token = getToken();
      const res = await fetch(
        "https://ucw4k4kk0coss4k08k0ow4ko.softver.cc/api/nota",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(noteData),
        }
      );
      if (!res.ok) throw new Error("Error al guardar la nota");

      editor?.commands.setContent("");
      setTiptap((prev) => ({
        ...prev,
        message: "Nota guardada correctamente",
        selectedNoteId: null,
        title: "",
      }));

      await fetchNotes();
    } catch (err: unknown) {
      savePendingNote(noteData);
      editor?.commands.setContent("");
      setTiptap((prev) => ({
        ...prev,
       message: "Sin conexión. Nota guardada localmente y se enviará cuando haya internet.",
       title: "",
       selectedNoteId: null,
      }));
      console.error("Error al guardar la nota:", err);
    } finally {
      setTiptap((prev) => ({ ...prev, loading: false }));
    }
  }

  async function handleDeleteNote(id: number) {
    const token = getToken();
    const res = await fetch(
      `https://ucw4k4kk0coss4k08k0ow4ko.softver.cc/api/nota/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );
    if (res.ok) {

      setTiptap((prev) => ({
        ...prev,
        message: "Nota eliminada correctamente",
        selectedNoteId: null,
        title: "",
        notes: prev.notes.filter((note) => note.id !== id),
      }));
     
    } else {
      setTiptap((prev) => ({
        ...prev,
        message: "No se pudo eliminar la nota",
      }));
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="font-bold mb-2">Mis notas</h2>
        <button
          onClick={handleNewNote}
          className="mb-2 p-2 bg-green-500 text-white rounded"
        >
          Nueva nota
        </button>
        <div className="flex flex-wrap gap-2">
          {tiptap.notes.map((note) => (
            <div
              key={note.id}
              className={`border rounded p-2 cursor-pointer w-60 relative ${
                tiptap.selectedNoteId === note.id ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => handleSelectNote(note)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded px-2 py-1"
                title="Eliminar nota"
              >
                Delete
              </button>
              <h3 className="font-semibold truncate">{note.title}</h3>
              <div
                className="text-xs text-gray-500 truncate"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="w-full p-2">
          <p>Editor</p>
          <input
            type="text"
            placeholder="Título de la nota"
            value={tiptap.title}
            onChange={(e) => setTiptap((prev) => ({ ...prev, title: e.target.value }))}
            className="border rounded p-2 mb-2 w-full"
          />
          <div className="flex space-x-2 mb-2">
            <div className="relative">
              <button className="p-2">
                <FaHeading />
              </button>
              <select
                value={tiptap.headingLevel}
                onChange={(e) => {
                  const headingLevel: Level =  Number(e.target.value) as Level;
                  setTiptap((prev) => ({
                    ...prev,
                    headingLevel,
                  }));
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: headingLevel})
                    .run();
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level}>
                    Heading {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
          >
            <FaUnderline />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
          >
            <FaListUl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
          >
            <FaListOl />
          </button>
          <button
            onClick={handleSave}
            className="p-2 bg-blue-500 text-white rounded ml-4"
            disabled={tiptap.loading || !tiptap.title}
          >
            {tiptap.loading ? "Guardando..." : "Saved"}
          </button>
          {tiptap.message && <span className="ml-4 text-sm">{tiptap.message}</span>}
        </div>
      </div>
      <div className="border rounded-lg p-2">
        <p>Content</p>
        <span className="text-sm text-gray-500 mb-2">
          <EditorContent editor={editor} className="border rounded-lg p-2" />
        </span>
        <div className="mt-4">
          <p className="font-bold">Contenido actual (HTML):</p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {tiptap.editorContent}
          </pre>
        </div>
      </div>
    </>
  );
}
