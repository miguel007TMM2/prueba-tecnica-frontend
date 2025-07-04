import { Note } from "@/types";
import { FaTimes } from "react-icons/fa";

export function NoteViewer({
  note,
  onClose,
}: {
  note: Note;
  onClose: () => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 mb-8 relative border-2 border-blue-400">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-500 hover:bg-red-100 rounded-full p-2 cursor-pointer"
        title="Cerrar"
        type="button"
      >
        <FaTimes size={20} />
      </button>
      <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </div>
  );
}