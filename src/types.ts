export enum method {
  GET = "GET",
  POST = "POST",
  PUTH = "PUTH",
  DELETE = "DELETE",
}

export enum contentType {
  ApplicationJson = "application/json",
}

export interface Options {
  method: method;
  headers: {
    "Content-Type": contentType;
  };
  body: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
}

export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface TiptapProps {
  headingLevel: Level;
  editorContent: string;
  title: string;
  loading: boolean;
  message: string;
  notes: Note[];
  selectedNoteId: number | null;
  showViewer: boolean;
  viewerNote: Note | null;
}