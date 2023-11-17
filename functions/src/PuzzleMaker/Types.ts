interface Entry {
  name: string;
  properties: string[];
}

interface PuzzleItem {
  name: string;
  property1: string;
  property2?: string;
}

interface PropPoolItem {
  name: string;
  entries: Entry[];
}

export type { Entry, PuzzleItem, PropPoolItem };
