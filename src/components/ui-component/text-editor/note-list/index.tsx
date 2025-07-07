import { Note } from "@/types";
import { FaTimes, FaEdit } from "react-icons/fa";

export function NotesList({
  notes,
  selectedNoteId,
  onSelect,
  onDelete,
  onEdit, 
}: {
  notes: Note[];
  selectedNoteId: number | null;
  onSelect: (note: Note) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void; 
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
          <div className="absolute top-1 right-1 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note.id);
              }}
              className="text-xs text-blue-500 hover:bg-blue-100 rounded-full p-1 cursor-pointer"
              title="Editar nota"
              type="button"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="text-xs text-red-500 hover:bg-red-100 rounded-full p-1 cursor-pointer"
              title="Eliminar nota"
              type="button"
            >
              <FaTimes size={14} />
            </button>
          </div>
          <h3 className="font-semibold truncate pr-12">{note.title}</h3>
          <div
            className="text-xs text-gray-500 truncate"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </div>
      ))}
    </div>
  );
}