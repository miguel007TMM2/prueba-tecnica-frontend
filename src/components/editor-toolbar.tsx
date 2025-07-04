import { Level } from "@/types";
import { Editor } from "@tiptap/react";
import { FaBold, FaHeading, FaItalic, FaListOl, FaListUl, FaUnderline } from "react-icons/fa";

const toolbarButtons = [
  {
    icon: <FaBold />,
    action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor: Editor) => editor.isActive("bold"),
    key: "bold",
  },
  {
    icon: <FaItalic />,
    action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor: Editor) => editor.isActive("italic"),
    key: "italic",
  },
  {
    icon: <FaUnderline />,
    action: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor: Editor) => editor.isActive("underline"),
    key: "underline",
  },
  {
    icon: <FaListUl />,
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor: Editor) => editor.isActive("bulletList"),
    key: "bulletList",
  },
  {
    icon: <FaListOl />,
    action: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor: Editor) => editor.isActive("orderedList"),
    key: "orderedList",
  },
];


export function EditorToolbar({
  editor,
  headingLevel,
  setHeadingLevel,
}: {
  editor: Editor;
  headingLevel: Level;
  setHeadingLevel: (level: Level) => void;
}) {
  return (
    <div className="flex space-x-2 mb-2">
      <div className="relative">
        <button className="p-2">
          <FaHeading />
        </button>
        <select
          value={headingLevel}
          onChange={(e) => {
            const level = Number(e.target.value) as Level;
            setHeadingLevel(level);
            editor.chain().focus().toggleHeading({ level }).run();
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
      {toolbarButtons.map((btn) => (
        <button
          key={btn.key}
          onClick={() => btn.action(editor)}
          className={`p-2 ${btn.isActive(editor) ? "bg-gray-200" : ""}`}
          type="button"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}