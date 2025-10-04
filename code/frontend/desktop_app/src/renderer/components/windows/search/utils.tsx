import { insertNode } from "@/utils/tree";
import { Node } from "@/utils/treeTypes";

export const isValidUrl = (string: string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

interface AddTabProps {
    setTree: (prev: any) => void;
}

export function addTab({ setTree }: AddTabProps) {
  const newTab: Node = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    type: "open",
    title: "My New Tab",
    favicon: "/icons/tab.svg",
  };

  setTree(prev => {
    const res = insertNode(prev, newTab);
    if (!res.ok) {
      console.warn("Could not insert:", res.reason);
      return prev;
    }
    // you can use res.location to focus/scroll/select the new node
    // e.g. if (res.location.kind === "root") setActiveRowCol(res.location.row, res.location.col);
    return res.tree;
  });
}

interface AddTabInsideFolderProps {
    parentId: string;
    setTree: (prev: any) => void;
}

export function addTabInsideFolder({ parentId, setTree }: AddTabInsideFolderProps) {
  const child: Node = {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    type: "liked",
    title: "Child in Folder",
  };

  setTree(prev => {
    const res = insertNode(prev, child, parentId);
    if (!res.ok) {
      console.warn("Insert failed:", res.reason);
      return prev;
    }
    return res.tree;
  });
}