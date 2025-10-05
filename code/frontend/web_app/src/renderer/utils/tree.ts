// treeUtils.ts
import { Node, Dir, isDir } from "./treeTypes";

export const ROWS = 5;
export const COLS = 5;

export function createEmptyNode(row: number, col: number): Node {
  return { id: `r${row}c${col}`, type: "empty" };
}

export function createEmptyGrid(): Node[][] {
  return Array.from({ length: ROWS }, (_, row) =>
    Array.from({ length: COLS }, (_, col) => createEmptyNode(row, col))
  );
}

/* ------------------ helpers ------------------ */

const cloneGrid = (grid: Node[][]) => grid.map(row => row.slice());
const cloneDir  = (dir: Dir): Dir => ({ ...dir, children: dir.children.slice() });

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Find a directory by id anywhere in the grid (walks nested children too). */
function findDirById(
  grid: Node[][],
  id: string
): { row: number; col: number; dir: Dir } | null {
  const stack: Array<{ row: number; col: number; node: Node }> = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      stack.push({ row: r, col: c, node: grid[r][c] });
    }
  }
  while (stack.length) {
    const { row, col, node } = stack.pop()!;
    if (isDir(node)) {
      if (node.id === id) return { row, col, dir: node };
      for (const child of node.children) stack.push({ row: -1, col: -1, node: child });
    }
  }
  return null;
}

/** Collect all empty slots; return one at random (or null). */
function findRandomEmptySlot(grid: Node[][]): { row: number; col: number } | null {
  const empties: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c].type === "empty") empties.push({ row: r, col: c });
    }
  }
  if (empties.length === 0) return null;
  return empties[randInt(0, empties.length - 1)];
}

export type InsertLocation =
  | { kind: "root"; row: number; col: number }
  | { kind: "child"; parentId: string; index: number };

export type InsertResult =
  | { ok: true; tree: Node[][]; location: InsertLocation }
  | { ok: false; tree: Node[][]; reason: "PARENT_NOT_FOUND" | "GRID_FULL" };

/**
 * Insert a node at a random location:
 * - If parentDirId is provided and found -> insert at a random index in that directory's children.
 * - Else -> place in a random empty root cell.
 */
export function insertNode(
  tree: Node[][],
  newNode: Node,
  parentDirId?: string
): InsertResult {
  // 1) Target a directory (if provided)
  if (parentDirId) {
    const hit = findDirById(tree, parentDirId);
    if (!hit) return { ok: false, tree, reason: "PARENT_NOT_FOUND" };

    const { row, col, dir } = hit;

    if (row >= 0 && col >= 0) {
      const next = cloneGrid(tree);
      const updatedDir = cloneDir(dir);

      const len = updatedDir.children.length;
      const insertAt = len === 0 ? 0 : randInt(0, len); // random position (append allowed)
      updatedDir.children.splice(insertAt, 0, newNode);

      next[row][col] = updatedDir;

      return {
        ok: true,
        tree: next,
        location: { kind: "child", parentId: updatedDir.id, index: insertAt },
      };
    }

    // If you later support nested non-root dirs needing deep immutable updates, handle here.
  }

  // 2) Random empty root slot
  const slot = findRandomEmptySlot(tree);
  if (!slot) return { ok: false, tree, reason: "GRID_FULL" };

  const next = cloneGrid(tree);
  next[slot.row][slot.col] = newNode;

  return {
    ok: true,
    tree: next,
    location: { kind: "root", row: slot.row, col: slot.col },
  };
}