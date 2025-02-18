export interface Cell {
  id: string;
  type: 'code' | 'markdown' | 'drawing';
  content: string;
  height: number;
}

export interface Notebook {
  id: string;
  name: string;
  cells: Cell[];
}
