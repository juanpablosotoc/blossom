export type LeafType = "open" | "liked" | "pinned" | "empty";

export interface Common {
  id: string;
  title?: string;
  favicon?: string;
  thumbnail?: string;
}

// Leaf = single tab
export type Leaf = Common & {
  type: LeafType;
};

// Dir = folder that contains children
export type Dir = Common & {
  type: "dir";
  children: Node[];
};

// Node = either a tab or a dir
export type Node = Leaf | Dir;

export const isDir = (n: Node): n is Dir => n.type === "dir";