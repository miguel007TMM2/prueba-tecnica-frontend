import { Note } from "@/types";
import { FaTimes } from "react-icons/fa";

export function NotesList({
  notes,
  selectedNoteId,
  onSelect,
  onDelete,
}: {
  notes: Note[];
  selectedNoteId: number | null;
  onSelect: (note: Note) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`border rounded p-2 cursor-pointer w-60 relative ${
            selectedNoteId === note.id ? "bg-blue-100" : "bg-white"
          }`}
          onClick={() => onSelect(note)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="absolute top-1 right-1 text-xs text-red-500 hover:bg-red-100 rounded-full p-1 cursor-pointer"
            title="Eliminar nota"
            type="button"
          >
            <FaTimes size={16} />
          </button>
          <h3 className="font-semibold truncate">{note.title}</h3>
          <div
            className="text-xs text-gray-500 truncate"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      ))}
    </div>
  );
}