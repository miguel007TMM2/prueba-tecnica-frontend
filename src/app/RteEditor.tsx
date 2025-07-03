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
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Tiptap() {
  const [headingLevel, setHeadingLevel] = useState<string>("1");
  const [editorContent, setEditorContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const editor = useEditor({
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
      setEditorContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

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

  useEffect(() => {
    async function fetchNotes() {
      const token = getToken();
      const res = await fetch("http://localhost:3800/api/notas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    }
    fetchNotes();
  }, []);

  function handleSelectNote(note: Note) {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    editor?.commands.setContent(note.content);
  }

  // Nueva función para limpiar el editor y los campos
  function handleNewNote() {
    setSelectedNoteId(null);
    setTitle("");
    editor?.commands.setContent("");
  }

  async function handleSave() {
    setLoading(true);
    setMessage("");
    try {
      const token = getToken();

      const res = await fetch("http://localhost:3800/api/nota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          title,
          content: editorContent,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar la nota");
      setMessage("Nota guardada correctamente");
      // Limpiar editor y campos después de guardar
      setTitle("");
      editor?.commands.setContent("");
      setSelectedNoteId(null);
      // Opcional: recargar las notas
      const notesRes = await fetch("http://localhost:3800/api/notas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (notesRes.ok) {
        const data = await notesRes.json();
        setNotes(data);
      }
    } catch (err) {
      setMessage("Error al guardar la nota");
      console.error("Error al guardar la nota:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <>
      {/* Lista de notas */}
      <div className="mb-4">
        <h2 className="font-bold mb-2">Mis notas</h2>
        <button
          onClick={handleNewNote}
          className="mb-2 p-2 bg-green-500 text-white rounded"
        >
          Nueva nota
        </button>
        <div className="flex flex-wrap gap-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`border rounded p-2 cursor-pointer w-60 ${
                selectedNoteId === note.id ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => handleSelectNote(note)}
            >
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 mb-2 w-full"
          />
          <div className="flex space-x-2 mb-2">
            <div className="relative">
              <button className="p-2">
                <FaHeading />
              </button>
              <select
                value={headingLevel}
                onChange={(e) => {
                  const headingLevel = e.target.value;
                  setHeadingLevel(headingLevel);
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: Number(headingLevel) })
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
            disabled={loading || !title}
          >
            {loading ? "Guardando..." : "Saved"}
          </button>
          {message && <span className="ml-4 text-sm">{message}</span>}
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
            {editorContent}
          </pre>
        </div>
      </div>
    </>
  );
}
