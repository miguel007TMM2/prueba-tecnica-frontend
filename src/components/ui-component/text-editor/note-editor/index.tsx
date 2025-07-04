import { TiptapProps } from "@/types";
import { Editor } from "@tiptap/react";
import { EditorToolbar } from "../toolbar";

export function NoteEditor({
  tiptap,
  setTiptap,
  editor,
  onSave,
}: {
  tiptap: TiptapProps;
  setTiptap: React.Dispatch<React.SetStateAction<TiptapProps>>;
  editor: Editor;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="w-full p-2">
        <p>Editor</p>
        <input
          type="text"
          placeholder="Título de la nota"
          value={tiptap.title}
          onChange={(e) =>
            setTiptap((prev) => ({ ...prev, title: e.target.value }))
          }
          className="border rounded p-2 mb-2 w-full"
        />
        <EditorToolbar
          editor={editor}
          headingLevel={tiptap.headingLevel}
          setHeadingLevel={(level) =>
            setTiptap((prev) => ({ ...prev, headingLevel: level }))
          }
        />
        <button
          onClick={onSave}
          className="p-2 bg-blue-500 text-white rounded ml-4 cursor-pointer"
          disabled={tiptap.loading || !tiptap.title}
        >
          {tiptap.loading ? "Guardando..." : "Saved"}
        </button>
        {tiptap.message && (
          <span className="ml-4 text-sm">{tiptap.message}</span>
        )}
      </div>
    </div>
  );
}